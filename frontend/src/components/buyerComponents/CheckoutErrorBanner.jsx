// frontend/src/components/buyerComponents/CheckoutErrorBanner.jsx

import React from "react";

const CheckoutErrorBanner = ({
  formError,
  lastMpesaError,
  handleConfirm,
  isProcessing,
}) => {
  if (!formError && !lastMpesaError) return null;

  return (
    <div
      className={`bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-4 rounded-lg shadow-sm ${
        lastMpesaError ? "border-2 border-dashed border-red-600" : ""
      }`}
    >
      <p className="font-semibold mb-2">
        {lastMpesaError
          ? "⚠️ M-Pesa Transaction Failed"
          : "Error Processing Order"}
      </p>
      <p className="text-sm">{lastMpesaError || formError}</p>
      {lastMpesaError && (
        <button
          onClick={handleConfirm}
          disabled={isProcessing}
          className="mt-3 bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-60 text-sm"
        >
          {isProcessing ? "Retrying..." : "Retry Payment"}
        </button>
      )}
    </div>
  );
};

export default CheckoutErrorBanner;
