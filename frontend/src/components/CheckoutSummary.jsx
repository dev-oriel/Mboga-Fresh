// frontend/src/components/CheckoutSummary.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const formatCurrency = (value) =>
  `KSh ${Number(value).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })}`;

const CheckoutSummary = () => {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const deliveryFee = subtotal >= 1000 || subtotal === 0 ? 0 : 1;
  const total = subtotal + deliveryFee;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-24">
      <h3 className="text-xl font-bold mb-4">Order Summary</h3>

      <div className="space-y-2 text-sm">
        {items.map((it) => (
          <div key={it.id} className="flex justify-between items-center py-2">
            <div className="flex items-center gap-3">
              <div
                className="bg-center bg-no-repeat bg-cover rounded-lg w-12 h-12"
                style={{ backgroundImage: `url("${it.img}")` }}
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
              {formatCurrency((Number(it.price) || 0) * it.qty)}
            </span>
          </div>
        ))}

        <div className="border-t border-gray-200 dark:border-gray-700 my-4" />

        <div className="space-y-3">
          <div className="flex justify-between text-gray-800 dark:text-gray-200">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-800 dark:text-gray-200">
            <span>Delivery Fee</span>
            <span>{formatCurrency(deliveryFee)}</span>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 my-2" />

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        <button
          onClick={() => {
            if (items.length === 0) {
              navigate("/marketplace");
              return;
            }
            // simulate confirm & payment
            clearCart();
            navigate("/orders");
          }}
          className="w-full mt-6 bg-emerald-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          Confirm and Pay
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

export default CheckoutSummary;
