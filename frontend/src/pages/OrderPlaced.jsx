// frontend/src/pages/OrderPlaced.jsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import CheckoutProgress from "../components/CheckoutProgress";
import OrderConfirmationCard from "../components/OrderConfirmationCard";
import { useCart } from "../context/CartContext";

const OrderPlaced = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  const {
    orderNumber: stateOrderNumber,
    eta: stateEta,
    itemsSummary,
  } = location.state || {};
  const orderNumber =
    stateOrderNumber ||
    `MBG-${new Date().toISOString().slice(2, 10).replace(/-/g, "")}-${
      Math.floor(Math.random() * 900000) + 100000
    }`;

  // optionally clear cart if not already cleared
  React.useEffect(() => {
    // clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <CheckoutProgress step={3} />

        <div className="max-w-xl mx-auto mt-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-5xl text-emerald-600">
                check_circle
              </span>
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Thank you for your order!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Your order has been successfully placed. You will receive a
            confirmation shortly.
          </p>

          <div className="mb-6">
            <OrderConfirmationCard
              orderNumber={orderNumber}
              eta={stateEta ?? "30 minutes"}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <button
              onClick={() => navigate("/orders")}
              className="w-full sm:w-auto flex items-center justify-center gap-2 font-semibold text-sm rounded-lg px-6 py-3 bg-emerald-600 text-white hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined text-xl">
                receipt_long
              </span>
              View Order Details
            </button>

            <Link
              to="/marketplace"
              className="w-full sm:w-auto flex items-center justify-center gap-2 font-semibold text-sm rounded-lg px-6 py-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-800 transition-colors"
            >
              <span className="material-symbols-outlined text-xl">
                storefront
              </span>
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderPlaced;
