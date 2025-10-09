// frontend/src/components/CheckoutProgress.jsx
import React from "react";

/**
 * Props:
 *  - step: number (1..3) current step
 *  - labels: optional array of 3 strings for the step labels
 */
const CheckoutProgress = ({
  step = 1,
  labels = ["Cart", "Checkout", "Order Placed"],
}) => {
  const steps = [1, 2, 3];
  return (
    <div className="max-w-2xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {steps.map((s, idx) => {
          const isActive = s === step;
          const isDone = s < step;
          // progress segment between items - last segment is omitted
          return (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center relative">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    isDone
                      ? "bg-emerald-600 text-white"
                      : isActive
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                  }`}
                >
                  {isDone ? (
                    <span className="material-symbols-outlined">check</span>
                  ) : (
                    s
                  )}
                </div>
                <p
                  className={`mt-2 text-sm ${
                    isActive
                      ? "text-emerald-700 font-semibold"
                      : isDone
                      ? "text-emerald-600 font-medium"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {labels[idx]}
                </p>
              </div>

              {/* connector bar (not added after last item) */}
              {s !== steps.length && (
                <div className="flex-1 h-1 mx-4 relative">
                  <div
                    className={`absolute top-0 left-0 h-full ${
                      isDone
                        ? "bg-emerald-600 w-full"
                        : step > s
                        ? "bg-emerald-600 w-1/2"
                        : "bg-gray-200 dark:bg-gray-700 w-0"
                    }`}
                  />
                  <div className="h-1 w-full bg-gray-200 dark:bg-gray-700" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default CheckoutProgress;
