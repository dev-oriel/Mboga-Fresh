import React from "react";

const MpesaPaymentBlock = ({
  paymentPhone,
  setPaymentPhone,
  handleConfirm,
  isProcessing,
  lastMpesaError,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
        <span className="material-symbols-outlined text-emerald-600">
          payment
        </span>{" "}
        Payment Method
      </h3>

      <div className="space-y-4">
        {/* M-Pesa Live STK Block */}
        <div
          className={`rounded-lg p-4 ${
            lastMpesaError
              ? "border-2 border-red-600"
              : "border border-emerald-600"
          }`}
        >
          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full border-2 border-emerald-600 flex items-center justify-center">
                <div className="w-3 h-3 bg-emerald-600 rounded-full" />
              </div>
              <span className="font-bold">M-Pesa (Live STK Push)</span>
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

        {/* Cash on Delivery Block (Coming Soon) */}
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
  );
};

export default MpesaPaymentBlock;
