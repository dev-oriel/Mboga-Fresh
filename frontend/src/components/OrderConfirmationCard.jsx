// frontend/src/components/OrderConfirmationCard.jsx
import React from "react";

const OrderConfirmationCard = ({ orderNumber, eta = "30 minutes" }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Order Number</h3>
        <p className="font-mono text-emerald-600 font-semibold">
          {orderNumber}
        </p>
      </div>

      <div className="border-t border-gray-100 dark:border-gray-700" />

      <div className="flex justify-between items-center mt-4">
        <h3 className="font-bold text-lg">Estimated Delivery</h3>
        <p className="font-medium text-gray-700 dark:text-gray-300">{eta}</p>
      </div>
    </div>
  );
};

export default OrderConfirmationCard;
