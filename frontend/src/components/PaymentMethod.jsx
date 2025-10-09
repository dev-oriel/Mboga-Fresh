// frontend/src/components/PaymentMethod.jsx
import React, { useState } from "react";

const PaymentMethod = () => {
  const [method, setMethod] = useState("mpesa"); // mpesa | cod
  const [mpesaPhone, setMpesaPhone] = useState("");

  return (
    <div className="space-y-4">
      {/* M-Pesa selected */}
      <div
        className={`rounded-lg p-4 ${
          method === "mpesa"
            ? "border border-emerald-600"
            : "border border-gray-200 dark:border-gray-700"
        } `}
      >
        <label
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setMethod("mpesa")}
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full border-2 border-emerald-600 flex items-center justify-center">
              <div className="w-3 h-3 bg-emerald-600 rounded-full" />
            </div>
            <span className="font-bold">M-Pesa</span>
          </div>
          <img
            alt="M-Pesa Logo"
            className="h-6"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2u5GkHrRLhuO9LpWPl721n2LmnE9GP5yWC_8cgeJ6HwkD50FgaMLcEgTsEDQMRIRx0NmduUyN8q4rBzpY7QuhUZvqUksVdWyRM2esIihJ-Z4PgqhuZDdcLNfJ6nkUcU-yPSWCoevqbTx72CRvOK6KVLBRUKvFM4r5bROSnO6w8-xRoApO7YxDNZnQnx1hdVyPz-CAofPz57bsUR6Uf1KI162Si8Xz1uBT7ptiK8EPthrhCLfjCm7dyi-YQPYrj4y2N-KBY1R1nHI"
          />
        </label>

        <div className="mt-4 pl-9">
          <label
            htmlFor="mpesa-phone"
            className="font-medium text-sm text-gray-600 dark:text-gray-300"
          >
            M-Pesa Phone Number
          </label>
          <div className="flex items-center gap-3 mt-1">
            <div className="relative flex-grow">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                +254
              </span>
              <input
                id="mpesa-phone"
                value={mpesaPhone}
                onChange={(e) => setMpesaPhone(e.target.value)}
                className="form-input w-full pl-14 bg-gray-100 dark:bg-gray-800 border-transparent focus:border-emerald-400 focus:ring-emerald-400 rounded-lg"
                placeholder="712 345 678"
                type="tel"
              />
            </div>

            <button
              onClick={() => {
                // in a real app: initiate mpesa request
                alert("Payment prompt (simulated) will be sent to the number.");
              }}
              className="bg-emerald-600 text-white font-bold py-2 px-6 rounded-lg hover:opacity-90 transition-opacity"
            >
              Pay
            </button>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            A payment prompt will be sent to this number.
          </p>
        </div>
      </div>

      {/* Cash on Delivery (placeholder) */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 opacity-60">
        <label className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600" />
            <span className="font-bold">Cash on Delivery</span>
          </div>

          <span className="text-xs font-semibold bg-yellow-400/20 text-yellow-700 dark:bg-yellow-300/20 dark:text-yellow-300 px-2 py-1 rounded-full">
            Coming Soon
          </span>
        </label>
      </div>
    </div>
  );
};

export default PaymentMethod;
