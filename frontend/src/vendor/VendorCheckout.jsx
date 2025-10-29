import React, { useState, useEffect, useMemo } from "react";
import Header from "../components/vendorComponents/Header";
import Sidebar from "../components/vendorComponents/Sidebar";
import CheckoutProgress from "../components/CheckoutProgress";
import { useBulkCart } from "../context/BulkCartContext";
import { useNavigate } from "react-router-dom";
import { placeOrderRequest, checkPaymentStatus } from "../api/orders";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const VendorCheckout = () => {
  const { items, subtotal, clearCart } = useBulkCart();
  const { user, refresh } = useAuth();
  const navigate = useNavigate();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [formError, setFormError] = useState(null);
  const [lastMpesaError, setLastMpesaError] = useState(null);

  const SHIPPING_FEE = 1;

  const [paymentPhone, setPaymentPhone] = useState(user?.phone || "");
  const [addressForm, setAddressForm] = useState({
    street: "",
    city: "",
    postalCode: "",
    country: "Kenya",
    phone: "",
  });

  const primaryAddress = useMemo(() => {
    if (!user || !Array.isArray(user.addresses)) return null;
    const p = user.addresses.find((a) => a.isPrimary);
    if (p && p.details) {
      const parts = p.details.split(",").map((s) => s.trim());
      return {
        street: parts[0] || p.details,
        city: parts[1] || "Nairobi",
        postalCode: parts[2] || "00100",
        country: "Kenya",
        phone: user.phone || "",
      };
    }
    return null;
  }, [user]);

  useEffect(() => {
    if (primaryAddress) {
      setAddressForm(primaryAddress);
      setPaymentPhone(primaryAddress.phone);
    } else if (user) {
      setAddressForm((prev) => ({
        ...prev,
        phone: user.phone || "07XXXXXXXX",
      }));
      setPaymentPhone(user.phone || "");
    }
  }, [user, primaryAddress]);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirm = async () => {
    // Phone validation
    let rawPhone = paymentPhone.replace(/\D/g, "");
    let normalizedPhone;

    if (rawPhone.startsWith("0")) {
      normalizedPhone = "254" + rawPhone.substring(1);
    } else if (rawPhone.length === 9 && rawPhone.startsWith("7")) {
      normalizedPhone = "254" + rawPhone;
    } else if (rawPhone.startsWith("254")) {
      normalizedPhone = rawPhone;
    } else {
      setFormError("M-Pesa phone format must be 07XXXXXXXX or 2547XXXXXXXX.");
      return;
    }
    const mpesaPhoneNumber = normalizedPhone;

    if (!user) {
      setFormError("You must be logged in to complete your order.");
      return;
    }
    if (items.length === 0) {
      setFormError("Your cart is empty.");
      return;
    }
    if (
      !addressForm.street ||
      !addressForm.city ||
      !addressForm.phone ||
      !mpesaPhoneNumber
    ) {
      setFormError(
        "Please fill in all delivery address and M-Pesa Phone Number fields."
      );
      return;
    }

    setIsProcessing(true);
    setFormError(null);
    setLastMpesaError(null);

    const payload = {
      items: items.map((item) => ({ product: item.id, quantity: item.qty })),
      shippingAddress: {
        street: addressForm.street,
        city: addressForm.city,
        postalCode: addressForm.postalCode || "00000",
        country: addressForm.country,
      },
      mpesaPhone: mpesaPhoneNumber,
    };

    try {
      // Persist new address if needed
      if (!primaryAddress && user) {
        const newPrimaryAddressPayload = {
          addresses: [
            {
              label: "Primary Address",
              details: `${addressForm.street}, ${addressForm.city}, ${
                addressForm.postalCode || "00000"
              }`,
              isPrimary: true,
            },
          ],
        };
        await axios.put(
          `${
            import.meta.env.VITE_API_BASE || "http://localhost:5000"
          }/api/profile/addresses`,
          newPrimaryAddressPayload,
          { withCredentials: true }
        );
        await refresh();
      }

      // Send order and initiate STK push
      const result = await placeOrderRequest(payload);
      const orderId = result.orderId;

      // Payment polling
      let paymentComplete = false;
      let paymentFailed = false;
      let attempts = 0;
      let maxAttempts = 20;
      let finalErrorMessage = "M-Pesa payment timed out. Please retry.";
      let statusCheck;

      while (!paymentComplete && !paymentFailed && attempts < maxAttempts) {
        await new Promise((r) => setTimeout(r, 3000));

        try {
          statusCheck = await checkPaymentStatus(orderId);
        } catch (pollingError) {
          if (pollingError.response?.status === 404) {
            paymentFailed = true;
            finalErrorMessage =
              "Payment process cancelled or failed at M-Pesa. No order was recorded.";
            break;
          }
          console.warn(
            "Polling still running, encountered non-fatal error:",
            pollingError
          );
        }

        if (statusCheck?.paymentStatus === "Paid") {
          paymentComplete = true;
        } else if (statusCheck?.paymentStatus === "Failed") {
          paymentFailed = true;
          finalErrorMessage =
            statusCheck.paymentFailureReason ||
            "M-Pesa transaction failed due to insufficient balance or cancellation.";
        }
        attempts++;
      }

      if (paymentFailed || !paymentComplete) {
        setLastMpesaError(finalErrorMessage);
        throw new Error(finalErrorMessage);
      }

      // On success: clear cart and navigate
      clearCart();

      navigate("/order-placed", {
        state: {
          orderNumber: orderId,
          eta: "2-4 hours",
          itemsSummary: items,
        },
      });
    } catch (err) {
      console.error("Order Placement Error:", err);
      const msg =
        lastMpesaError ||
        err.response?.data?.message ||
        err.message ||
        "Payment process failed. Check your phone for the M-Pesa prompt.";
      setFormError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  // If cart is empty, show message
  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Header avatarUrl={user?.avatar} userName={user?.name || "Vendor"} />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8">
            <div className="max-w-2xl mx-auto text-center py-16">
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                Your cart is empty
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Add some items to your cart before proceeding to checkout.
              </p>
              <button
                onClick={() => navigate("/farmily")}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
              >
                Continue Shopping
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header avatarUrl={user?.avatar} userName={user?.name || "Vendor"} />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <CheckoutProgress step={2} />

          <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
            Vendor Checkout
          </h1>

          {/* Error Display */}
          {(formError || lastMpesaError) && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
              <p className="text-red-800 dark:text-red-300 font-semibold">
                {formError || lastMpesaError}
              </p>
              {lastMpesaError && (
                <button
                  onClick={handleConfirm}
                  disabled={isProcessing}
                  className="mt-3 text-sm text-red-600 dark:text-red-400 underline hover:no-underline"
                >
                  Retry Payment
                </button>
              )}
            </div>
          )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            {/* Delivery Address */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                Delivery Address
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={addressForm.street}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="123 Main Street"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={addressForm.city}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Nairobi"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={addressForm.postalCode}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="00100"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={addressForm.phone}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="07XXXXXXXX"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                Payment Method
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 border-2 border-emerald-500 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                  <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">M</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      M-Pesa
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Pay with your M-Pesa account
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    M-Pesa Phone Number
                  </label>
                  <input
                    type="tel"
                    value={paymentPhone}
                    onChange={(e) => setPaymentPhone(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="07XXXXXXXX or 2547XXXXXXXX"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    You will receive an STK push to approve the payment
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <aside className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                Order Summary
              </h3>
              <div className="space-y-3 mb-6">
                {items.map((item) => {
                  const priceValue = Number(
                    item.price.match(/(\d+(\.\d+)?)/)?.[0] || 0
                  );
                  return (
                    <div
                      key={item.id}
                      className="flex justify-between items-center py-2"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-semibold text-sm text-gray-900 dark:text-white">
                            {item.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            x{item.qty}
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        KSh {(priceValue * item.qty).toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Subtotal</span>
                  <span>KSh {Number(subtotal).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Delivery Fee</span>
                  <span>KSh {SHIPPING_FEE}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="flex justify-between font-bold text-lg text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span>
                      KSh {(Number(subtotal) + SHIPPING_FEE).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleConfirm}
                disabled={isProcessing}
                className="w-full mt-6 bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? "Processing Payment..." : "Place Order & Pay"}
              </button>

              <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
                By placing your order, you agree to our terms and conditions
              </p>
            </div>
          </aside>
        </div>
        </main>
      </div>
    </div>
  );
};

export default VendorCheckout;
