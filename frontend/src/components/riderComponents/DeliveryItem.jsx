import React from "react";
import { useNavigate } from "react-router-dom";
import { Truck, MapPin } from "lucide-react";

const DeliveryItem = ({
  id,
  pickup,
  dropoff,
  earnings,
  vendor,
  status,
  onAccept,
  // onScan: This parameter is indeed unused in the final component logic,
  // as the actions are tied to internal navigation handlers.
  isTaskAvailable = false,
}) => {
  const navigate = useNavigate();

  // Handler to navigate and immediately activate manual input mode on the next page.
  // This bypasses the default camera check in development.
  const handleManualClick = (orderId) => {
    navigate(`/riderdelivery/${orderId}`, { state: { forceManual: true } });
  };

  // Handler for a simple detail click (no forced state).
  const handleDetailClick = (orderId) => {
    navigate(`/riderdelivery/${orderId}`);
  };

  // Determine the action button text/color and its action handler
  const getTaskAction = () => {
    if (isTaskAvailable) {
      return {
        label: "Accept Task",
        action: onAccept, // Action is the function passed from parent (RiderDeliveryQueue)
        style: "bg-red-600 hover:bg-red-700 text-white",
        showManualLink: false,
      };
    }

    // For Accepted/In Transit tasks, the primary action must go to the confirmation screen.
    if (status === "Accepted/Awaiting Pickup") {
      return {
        label: "Scan Pickup QR",
        // CRITICAL FIX: Direct the main button to force manual input/scanner view
        action: () => handleManualClick(id),
        style: "bg-emerald-600 hover:bg-emerald-700 text-white",
        showManualLink: true,
      };
    }
    if (status === "In Transit") {
      return {
        label: "Scan Buyer QR",
        // CRITICAL FIX: Direct the main button to force manual input/scanner view
        action: () => handleManualClick(id),
        style: "bg-amber-600 hover:bg-amber-700 text-white",
        showManualLink: true,
      };
    }
    return {
      label: "View Details",
      action: () => handleDetailClick(id),
      style: "border border-gray-300 text-gray-700 hover:bg-gray-100",
      showManualLink: false,
    };
  };

  const actionButton = getTaskAction();
  const orderIdShort = id.toString().substring(18).toUpperCase();

  return (
    <li className="p-6 hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors duration-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 size-14 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
            <Truck className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1">
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              Task for Order #{orderIdShort}
            </p>
            {vendor && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-300">
                From: {vendor}
              </p>
            )}
            <div className="mt-1 text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <div className="flex items-center gap-1">
                <Truck size={14} /> Pickup:{" "}
                <span className="font-semibold">{pickup}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin size={14} /> Dropoff:{" "}
                <span className="font-semibold">{dropoff}</span>
              </div>
            </div>
            <p className="mt-2 text-sm font-semibold text-green-600 dark:text-green-400">
              Est. Earnings: {earnings}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${
              status === "In Transit"
                ? "bg-blue-100 text-blue-700"
                : status === "Awaiting Acceptance"
                ? "bg-amber-100 text-amber-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {status || "Awaiting"}
          </span>
          <div className="flex flex-col gap-1 w-full sm:w-auto">
            {" "}
            {/* Wrapper for button and link */}
            <button
              onClick={actionButton.action}
              className={`flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-bold shadow-lg transition-all ${actionButton.style}`}
            >
              <span className="material-symbols-outlined">
                {isTaskAvailable ? "check_circle" : "qr_code_scanner"}
              </span>
              <span>{actionButton.label}</span>
            </button>
            {/* CRITICAL FIX: The manual link, only visible for active tasks */}
            {actionButton.showManualLink && status !== "Delivered" && (
              <button
                onClick={() => handleManualClick(id)}
                className="text-xs text-gray-500 hover:text-red-600 underline mt-1"
                title="Bypass camera issue"
              >
                Use Manual Code Input
              </button>
            )}
          </div>
        </div>
      </div>
    </li>
  );
};

export default DeliveryItem;
