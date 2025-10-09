// frontend/src/components/CartProgress.jsx
import React from "react";

const Step = ({ num, title, active }) => (
  <div className="flex items-center gap-4">
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
        active
          ? "bg-emerald-600 text-white"
          : "bg-gray-200 dark:bg-gray-700 text-gray-500"
      }`}
    >
      {num}
    </div>
    <p
      className={`text-sm ${
        active
          ? "text-emerald-600 font-semibold"
          : "text-gray-500 dark:text-gray-400"
      }`}
    >
      {title}
    </p>
  </div>
);

const CartProgress = ({ step = 1 }) => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <Step num={1} title="Cart" active={step === 1} />
        <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 mx-4 relative">
          <div
            className={`absolute top-0 left-0 h-full bg-emerald-600`}
            style={{ width: `${(Math.max(1, step) / 3) * 100}%` }}
          />
        </div>
        <Step num={2} title="Checkout" active={step === 2} />
        <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 mx-4" />
        <Step num={3} title="Order Placed" active={step === 3} />
      </div>
    </div>
  );
};

export default CartProgress;
