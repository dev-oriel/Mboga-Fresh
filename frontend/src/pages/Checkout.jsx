import React, { useState, useEffect, useMemo } from "react";
import Header from "../components/Header";
import CheckoutProgress from "../components/CheckoutProgress";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { placeOrderRequest, checkPaymentStatus } from "../api/orders";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

// Import the new components
import DeliveryAddressForm from "../components/buyerComponents/DeliveryAddressForm";
import MpesaPaymentBlock from "../components/buyerComponents/MpesaPaymentBlock";
import CheckoutErrorBanner from "../components/buyerComponents/CheckoutErrorBanner";

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
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
    // --- START PHONE VALIDATION ---
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
    // --- END PHONE VALIDATION ---

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
      // 2. Persist New Address
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

      // 3. Send Order and Initiate STK Push
      const result = await placeOrderRequest(payload);
      const orderId = result.orderId;

      // --- 4. START PAYMENT POLLING ---
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
          // Handle 404 (order deleted on backend due to payment failure)
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
        lastMpesaError ||
        err.response?.data?.message ||
        err.message ||
        "Payment process failed. Check your phone for the M-Pesa prompt.";
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

        {/* Consolidated Error Display (Using New Component) */}
        <CheckoutErrorBanner
          formError={formError}
          lastMpesaError={lastMpesaError}
          handleConfirm={handleConfirm}
          isProcessing={isProcessing}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-8">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold mb-6">Checkout</h2>

            <div className="space-y-8">
              {/* Delivery Address (Using New Component) */}
              <DeliveryAddressForm
                addressForm={addressForm}
                handleAddressChange={handleAddressChange}
              />

              {/* Payment Method (Using New Component) */}
              <MpesaPaymentBlock
                paymentPhone={paymentPhone}
                setPaymentPhone={setPaymentPhone}
                handleConfirm={handleConfirm}
                isProcessing={isProcessing}
                lastMpesaError={lastMpesaError}
              />
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
                  <span>KSh {SHIPPING_FEE}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>
                    KSh {(Number(subtotal) + SHIPPING_FEE).toLocaleString()}
                  </span>
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
