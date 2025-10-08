// frontend/src/components/OrderSummary.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const formatCurrency = (value) =>
  `KSh ${Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

const OrderSummary = () => {
  const { subtotal, items, clearCart } = useCart();
  const navigate = useNavigate();

  // simple delivery logic for demo
  const deliveryFee = subtotal >= 1000 || subtotal === 0 ? 0 : 210;
  const total = subtotal + deliveryFee;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-24">
      <h3 className="text-xl font-bold mb-4">Order Summary</h3>

      <div className="space-y-3">
        <div className="flex justify-between text-gray-800 dark:text-gray-200">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>

        <div className="flex justify-between text-gray-800 dark:text-gray-200">
          <span>Delivery Fee</span>
          <span>{formatCurrency(deliveryFee)}</span>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="font-bold mb-2">Delivery Address</h4>

        <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
          <span className="material-symbols-outlined mt-1 text-emerald-600">home</span>
          <div>
            <p className="font-medium">Nairobi, Kenya</p>
            <button className="text-sm text-emerald-600 font-semibold">Change</button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="font-bold mb-2">Payment Options</h4>
        <div className="space-y-2 text-sm text-gray-800 dark:text-gray-200">
          <p>Cash on Delivery</p>
          <p>Mpesa</p>
        </div>
      </div>

      <button
        onClick={() => {
          // simple demo checkout: clear cart and navigate to orders or confirmation
          if (items.length === 0) {
            navigate("/marketplace");
            return;
          }
          // in a real app you'd run checkout flow here
          clearCart();
          navigate("/orders");
        }}
        className="w-full mt-8 bg-emerald-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity"
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default OrderSummary;
