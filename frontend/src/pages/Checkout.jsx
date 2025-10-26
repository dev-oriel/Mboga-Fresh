import React, { useState, useEffect, useMemo } from "react";
import Header from "../components/Header";
import CheckoutProgress from "../components/CheckoutProgress";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { placeOrderRequest, checkPaymentStatus } from "../api/orders";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const { user, refresh } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formError, setFormError] = useState(null);

  const SHIPPING_FEE = 50;

  // State for the phone number specifically used for M-Pesa push
  const [paymentPhone, setPaymentPhone] = useState(user?.phone || "");

  // Internal state for the checkout form fields
  const [addressForm, setAddressForm] = useState({
    street: "",
    city: "",
    postalCode: "",
    country: "Kenya",
    phone: "",
  });

  // Determine the user's primary address using useMemo
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

  // Effect to initialize form with primary address or user phone
  useEffect(() => {
    if (primaryAddress) {
      setAddressForm(primaryAddress);
      setPaymentPhone(primaryAddress.phone); // Sync payment phone
    } else if (user) {
      setAddressForm((prev) => ({
        ...prev,
        phone: user.phone || "07XXXXXXXX",
      }));
      setPaymentPhone(user.phone || ""); // Set initial phone for Mpesa
    }
  }, [user, primaryAddress]);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirm = async () => {
    // --- START PHONE NORMALIZATION ---
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
    const finalTotal = subtotal + SHIPPING_FEE;
    // --- END PHONE NORMALIZATION ---

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
        "Please fill in all address and M-Pesa Phone Number fields."
      );
      return;
    }

    setIsProcessing(true);
    setFormError(null);

    // 1. Prepare Payload
    const payload = {
      items: items.map((item) => ({ product: item.id, quantity: item.qty })),
      shippingAddress: {
        street: addressForm.street,
        city: addressForm.city,
        postalCode: addressForm.postalCode || "00000",
        country: addressForm.country,
      },
      mpesaPhone: mpesaPhoneNumber, // CRITICAL: Send normalized M-Pesa phone number
    };

    try {
      // 2. Persist New Address (if new)
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

      // 3. Send Order and Initiate STK Push (API CALL)
      const result = await placeOrderRequest(payload);
      const orderId = result.orderId;

      // --- 4. START PAYMENT POLLING ---
      let paymentComplete = false;
      let paymentFailed = false;
      let attempts = 0;
      let finalErrorMessage = "M-Pesa payment timed out. Please try again.";

      while (!paymentComplete && !paymentFailed && attempts < 10) {
        await new Promise((r) => setTimeout(r, 3000)); // Wait 3 seconds
        const statusCheck = await checkPaymentStatus(orderId); // Uses imported function

        if (statusCheck.paymentStatus === "Paid") {
          paymentComplete = true;
        } else if (statusCheck.paymentStatus === "Failed") {
          // Check for failed status
          paymentFailed = true;
          // CRITICAL: Extract the specific failure reason from the DB polling response
          finalErrorMessage =
            statusCheck.paymentFailureReason ||
            "M-Pesa transaction failed: Insufficient funds or cancelled by user.";
        }
        attempts++;
      }

      if (paymentFailed) {
        throw new Error(finalErrorMessage); // Throw the specific failure message
      }

      if (!paymentComplete) {
        throw new Error(finalErrorMessage); // Handles timeout case
      }

      // 5. On Success: Clear cart and navigate
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
        err.response?.data?.message || err.message || "Payment process failed.";
      setFormError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <CheckoutProgress step={2} />
        {formError && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-4 rounded-lg shadow-sm">
            {formError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-8">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold mb-6">Checkout</h2>

            <div className="space-y-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                  <span className="material-symbols-outlined text-emerald-600">
                    local_shipping
                  </span>{" "}
                  Delivery Address
                  {primaryAddress && (
                    <span className="text-xs font-normal text-gray-500 ml-3">
                      (Primary: {primaryAddress.street}, {primaryAddress.city})
                    </span>
                  )}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-medium text-sm text-gray-600 dark:text-gray-300">
                      Street Address
                    </label>
                    <input
                      className="form-input w-full mt-1 bg-gray-100 dark:bg-gray-800 border-transparent focus:border-emerald-400 focus:ring-emerald-400 rounded-lg p-2"
                      name="street"
                      value={addressForm.street}
                      onChange={handleAddressChange}
                    />
                  </div>
                  <div>
                    <label className="font-medium text-sm text-gray-600 dark:text-gray-300">
                      City
                    </label>
                    <input
                      className="form-input w-full mt-1 bg-gray-100 dark:bg-gray-800 border-transparent focus:border-emerald-400 focus:ring-emerald-400 rounded-lg p-2"
                      name="city"
                      value={addressForm.city}
                      onChange={handleAddressChange}
                    />
                  </div>
                  <div>
                    <label className="font-medium text-sm text-gray-600 dark:text-gray-300">
                      Postal Code
                    </label>
                    <input
                      className="form-input w-full mt-1 bg-gray-100 dark:bg-gray-800 border-transparent focus:border-emerald-400 focus:ring-emerald-400 rounded-lg p-2"
                      name="postalCode"
                      value={addressForm.postalCode}
                      onChange={handleAddressChange}
                    />
                  </div>
                  <div>
                    <label className="font-medium text-sm text-gray-600 dark:text-gray-300">
                      Phone Number for delivery updates
                    </label>
                    <input
                      className="form-input w-full mt-1 bg-gray-100 dark:bg-gray-800 border-transparent focus:border-emerald-400 focus:ring-emerald-400 rounded-lg p-2"
                      name="phone"
                      value={addressForm.phone}
                      onChange={handleAddressChange}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                  <span className="material-symbols-outlined text-emerald-600">
                    payment
                  </span>{" "}
                  Payment Method
                </h3>

                <div className="space-y-4">
                  <div className="border border-emerald-600 rounded-lg p-4">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full border-2 border-emerald-600 flex items-center justify-center">
                          <div className="w-3 h-3 bg-emerald-600 rounded-full" />
                        </div>
                        <span className="font-bold">
                          M-Pesa (Live STK Push)
                        </span>
                      </div>
                      <img
                        alt="M-Pesa Logo"
                        className="h-6"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2u5GkHrRLhuO9LpWPl721n2LmnE9GP5yWC_8cgeJ6HwkD50FgaMLcEgTsEDQMRIRx0NmduUyN8q4rBzpY7QuhUZvqUksVdWyRM2esIihJ-Z4PgqhuZDdcLNfJ6nkUcU-yPSWCoevqbTx72CRvOK6KVLBRUKvFM4r5bROSnO6w8-xRoApO7YxDNZnQnx1hdVyPz-CAofPz57bsUR6Uf1KI162Si8Xz1uBT7ptiK8EPthrhCLfjCm7dyi-YQPYrj4y2N-KBY1R1nHI"
                      />
                    </label>

                    <div className="mt-4 pl-9">
                      <label className="font-medium text-sm text-gray-600 dark:text-gray-300">
                        M-Pesa Phone Number
                      </label>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="relative flex-grow">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                            +254
                          </span>
                          <input
                            className="form-input w-full pl-14 bg-gray-100 dark:bg-gray-800 border-transparent focus:border-emerald-400 focus:ring-emerald-400 rounded-lg p-2"
                            placeholder="712 345 678"
                            type="tel"
                            value={paymentPhone}
                            onChange={(e) => setPaymentPhone(e.target.value)}
                          />
                        </div>
                        <button
                          className="bg-emerald-600 text-white font-bold py-2 px-6 rounded-lg hover:opacity-90 transition-opacity"
                          onClick={handleConfirm}
                          disabled={isProcessing}
                        >
                          {isProcessing ? "Processing..." : "Pay"}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        A payment prompt will be sent to this number.
                      </p>
                    </div>
                  </div>

                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 opacity-60">
                    <label className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600"></div>
                        <span className="font-bold">Cash on Delivery</span>
                      </div>
                      <span className="text-xs font-semibold bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                        Coming Soon
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm">
                {items.map((it) => (
                  <div
                    key={it.id}
                    className="flex justify-between items-center py-2"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={it.img}
                        alt={it.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-semibold">
                          {it.title}{" "}
                          <span className="font-normal text-gray-500 dark:text-gray-400">
                            x{it.qty}
                          </span>
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold">
                      KSh {(Number(it.price) * it.qty).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-800 dark:text-gray-200">
                  <span>Subtotal</span>
                  <span>KSh {Number(subtotal).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-800 dark:text-gray-200">
                  <span>Delivery Fee</span>
                  <span>KSh 1</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>KSh {(Number(subtotal) + 1).toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleConfirm}
                disabled={isProcessing}
                className="w-full mt-6 bg-emerald-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity"
              >
                {isProcessing ? "Confirming..." : "Confirm and Pay"}
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
