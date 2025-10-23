import React, { useState } from "react";
import Header from "../components/Header";
import CheckoutProgress from "../components/CheckoutProgress";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { placeOrderRequest } from "../api/orders"; // <-- NEW IMPORT
import { useAuth } from "../context/AuthContext";

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formError, setFormError] = useState(null);

  // Default/Mock Address State (Replace with real form state later)
  const [address, setAddress] = useState({
    street: "Mama Ngina Street",
    city: "Nairobi",
    postalCode: "00100",
    country: "Kenya",
    phone: "0712345678",
  });

  // Helper to extract clean data from the cart items
  const getOrderItems = () =>
    items.map((item) => ({
      product: item.id, // Assuming item.id is the MongoDB Product ID
      quantity: item.qty,
      // The price validation and total calculation happen on the backend
    }));

  const handleConfirm = async () => {
    if (!user) {
      setFormError("You must be logged in to complete your order.");
      return;
    }

    if (items.length === 0) {
      setFormError("Your cart is empty.");
      return;
    }

    setIsProcessing(true);
    setFormError(null);

    // 1. Prepare Payload
    const payload = {
      items: getOrderItems(),
      shippingAddress: address,
    };

    try {
      // 2. Send order to backend API
      const result = await placeOrderRequest(payload);

      // 3. On Success: Clear cart and navigate
      clearCart();

      // Pass order details to the confirmation page
      navigate("/order-placed", {
        state: {
          orderNumber: result.orderId,
          eta: "2-4 hours",
          itemsSummary: items,
        },
      });
    } catch (err) {
      console.error("Order Placement Error:", err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        "An unexpected error occurred during order processing.";
      setFormError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  // ... (rest of the Checkout component remains the same, but the handleConfirm function is updated) ...

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
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-medium text-sm text-gray-600 dark:text-gray-300">
                      Street Address
                    </label>
                    <input
                      className="form-input w-full mt-1 bg-gray-100 dark:bg-gray-800 border-transparent focus:border-emerald-400 focus:ring-emerald-400 rounded-lg p-2"
                      defaultValue={address.street}
                      // In a real application, you would use state and change handlers here
                    />
                  </div>
                  <div>
                    <label className="font-medium text-sm text-gray-600 dark:text-gray-300">
                      Apartment, suite, etc. (optional)
                    </label>
                    <input className="form-input w-full mt-1 bg-gray-100 dark:bg-gray-800 border-transparent focus:border-emerald-400 focus:ring-emerald-400 rounded-lg p-2" />
                  </div>
                  <div>
                    <label className="font-medium text-sm text-gray-600 dark:text-gray-300">
                      City
                    </label>
                    <input
                      className="form-input w-full mt-1 bg-gray-100 dark:bg-gray-800 border-transparent focus:border-emerald-400 focus:ring-emerald-400 rounded-lg p-2"
                      defaultValue={address.city}
                    />
                  </div>
                  <div>
                    <label className="font-medium text-sm text-gray-600 dark:text-gray-300">
                      Phone Number for delivery updates
                    </label>
                    <input
                      className="form-input w-full mt-1 bg-gray-100 dark:bg-gray-800 border-transparent focus:border-emerald-400 focus:ring-emerald-400 rounded-lg p-2"
                      defaultValue={address.phone}
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
                          M-Pesa (Simulated Payment)
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
                  <span>KSh 210</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>KSh {(Number(subtotal) + 210).toLocaleString()}</span>
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
