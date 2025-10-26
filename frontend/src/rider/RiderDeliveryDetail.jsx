// frontend/src/rider/RiderDeliveryDetail.jsx - FINAL DEFINITIVE WORKING VERSION

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import RiderHeader from "../components/riderComponents/RiderHeader";
import {
  fetchOrderDetails,
  confirmPickup,
  confirmDelivery,
} from "../api/orders";
import { useAuth } from "../context/AuthContext";
import {
  Loader2,
  Zap,
  CheckCircle,
  MapPin,
  Package,
  Camera,
  AlertTriangle,
} from "lucide-react";

// --- Helper Functions ---

const getStatusBadgeProps = (status) => {
  const lowerStatus = status ? status.toLowerCase() : "";
  if (lowerStatus === "delivered")
    return {
      label: "Delivered",
      bg: "bg-emerald-100",
      text: "text-emerald-700",
      icon: "check_circle",
    };
  if (lowerStatus === "shipped" || lowerStatus === "in transit")
    return {
      label: "In Transit",
      bg: "bg-blue-100",
      text: "text-blue-700",
      icon: "local_shipping",
    };
  if (
    lowerStatus === "qr scanning" ||
    lowerStatus === "accepted/awaiting pickup"
  )
    return {
      label: "Awaiting Pickup",
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      icon: "schedule",
    };
  return {
    label: status || "Error",
    bg: "bg-gray-100",
    text: "text-gray-700",
    icon: "info",
  };
};

const RiderDeliveryDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [vendorCodeInput, setVendorCodeInput] = useState("");
  const [buyerCodeInput, setBuyerCodeInput] = useState("");
  const [apiMessage, setApiMessage] = useState(null);
  const [processing, setProcessing] = useState(false);

  // State to manage the primary view mode (false = show scan placeholder, true = show manual input)
  // Initialize based on navigation state (if forced from queue) or default to scan view.
  const [showManualInput, setShowManualInput] = useState(
    location.state?.forceManual || false
  );

  // Fetch the order details
  const loadOrderDetails = useCallback(async () => {
    if (!user || !orderId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await fetchOrderDetails(orderId);
      setOrder(data);
    } catch (err) {
      console.error("Error fetching order details:", err);
      setApiMessage({
        type: "error",
        text: "Failed to load task details. (Check console)",
      });
    } finally {
      setLoading(false);
    }
  }, [orderId, user]);

  useEffect(() => {
    loadOrderDetails();
  }, [loadOrderDetails]);

  // Handler for Pickup (Vendor Code) and Delivery (Buyer Code) confirmation
  const handleStatusUpdate = async (actionType) => {
    if (!order) return;
    setProcessing(true);
    setApiMessage(null);

    try {
      if (actionType === "PICKUP") {
        if (vendorCodeInput.length !== 6)
          throw new Error("Pickup code must be 6 characters.");

        await confirmPickup(orderId, vendorCodeInput);
        setApiMessage({
          type: "success",
          text: "Pickup confirmed! Order status updated to In Transit.",
        });
        setVendorCodeInput("");
      } else if (actionType === "DELIVERY") {
        if (buyerCodeInput.length !== 6)
          throw new Error("Buyer confirmation code must be 6 digits.");

        // CRITICAL FIX: Pass buyerCode to the API
        await confirmDelivery(orderId, buyerCodeInput);

        setApiMessage({
          type: "success",
          text: "Delivery complete! Earnings secured.",
        });
        setBuyerCodeInput(""); // Clear code on success
      }

      await loadOrderDetails(); // Refresh data to show new status
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Confirmation failed.";
      setApiMessage({ type: "error", text: msg });
    } finally {
      setProcessing(false);
    }
  };

  // RENDER HELPER: Renders the Manual Input Form
  const renderManualForm = (type) => {
    const isPickup = type === "PICKUP";
    const codeValue = isPickup ? vendorCodeInput : buyerCodeInput;
    const setCodeValue = isPickup ? setVendorCodeInput : setBuyerCodeInput;
    const buttonLabel = isPickup ? "Verify Pickup" : "Complete Delivery";
    const placeholderText = isPickup
      ? "Enter VENDOR Pickup Code"
      : "Enter BUYER Confirmation Code";

    return (
      <div className="space-y-4 pt-2">
        <p className="text-sm text-gray-600 mb-2">
          Enter the 6-digit code provided by{" "}
          {isPickup ? "the Vendor" : "the Buyer"}:
        </p>
        <input
          type={isPickup ? "text" : "number"}
          value={codeValue}
          onChange={(e) =>
            setCodeValue(e.target.value.toUpperCase().substring(0, 6))
          }
          placeholder={placeholderText}
          maxLength={6}
          className="w-full p-3 border-2 border-gray-300 rounded-lg font-mono text-lg uppercase text-center"
          disabled={processing}
        />

        <button
          onClick={() => handleStatusUpdate(type)}
          disabled={processing || codeValue.length !== 6}
          className="w-full py-3 rounded-lg font-bold text-white transition bg-red-600 hover:bg-red-700 disabled:bg-gray-400"
        >
          {processing ? "Verifying..." : buttonLabel}
        </button>
        <button
          onClick={() => setShowManualInput(false)}
          className="w-full py-1 text-sm text-blue-600 hover:underline transition"
        >
          Switch to Camera Scan
        </button>
      </div>
    );
  };

  // RENDER HELPER: Renders the Camera Placeholder View
  const renderScanView = (type) => (
    <div className="space-y-4 pt-2">
      <div className="w-full max-w-sm h-32 mx-auto mb-3 rounded-xl border-4 border-gray-300 flex flex-col items-center justify-center bg-gray-100 text-gray-500">
        <Camera size={40} />
        <p className="mt-2 text-sm text-red-500 font-semibold">
          Camera Blocked on HTTP/IP
        </p>
      </div>
      <button
        onClick={() => setShowManualInput(true)}
        className="w-full py-3 rounded-lg font-bold text-white transition bg-emerald-600 hover:bg-emerald-700"
      >
        Use Manual Code Input
      </button>
    </div>
  );

  // --- Main Render Logic ---

  if (loading || !order) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <RiderHeader />
        <main className="flex-grow container mx-auto p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-600 mt-16" />
        </main>
      </div>
    );
  }

  const badge = getStatusBadgeProps(order.orderStatus);
  const currentStatus = order.orderStatus.toLowerCase();
  const isReadyForPickup =
    currentStatus === "qr scanning" ||
    currentStatus === "accepted/awaiting pickup";
  const isReadyForDeliveryConfirmation =
    currentStatus === "shipped" || currentStatus === "in transit";
  const isCompleted = currentStatus === "delivered";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <RiderHeader />
      <main className="flex-grow p-4 sm:p-8 max-w-lg mx-auto w-full">
        <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-200 space-y-6">
          {/* Header */}
          <div className="pb-4 border-b">
            <h1 className="text-2xl font-bold text-gray-900">
              Task: Order #{orderId.substring(18).toUpperCase()}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Status:{" "}
              <span
                className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}
              >
                {badge.label}
              </span>
            </p>
          </div>

          {/* API Message */}
          {apiMessage && (
            <div
              className={`p-3 rounded-lg text-sm font-medium ${
                apiMessage.type === "error"
                  ? "bg-red-50 text-red-700"
                  : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {apiMessage.text}
            </div>
          )}

          {/* Task Information (Details Section) */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Zap size={20} className="text-red-600" />
              <span className="text-sm font-medium text-gray-700">
                Pickup: {order.shippingAddress.city} (Vendor)
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <MapPin size={20} className="text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                Dropoff: {order.shippingAddress.street} (Buyer)
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Package size={20} className="text-emerald-600" />
              <span className="text-sm font-medium text-gray-700">
                Total Items: {order.items.length}
              </span>
            </div>
          </div>

          {/* 1. PICKUP PHASE */}
          {isReadyForPickup && !isCompleted && (
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Vendor Confirmation
              </h3>
              {showManualInput
                ? renderManualForm("PICKUP")
                : renderScanView("PICKUP")}
            </div>
          )}

          {/* 2. DELIVERY PHASE */}
          {isReadyForDeliveryConfirmation && !isCompleted && (
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Buyer Confirmation
              </h3>
              {renderManualForm("DELIVERY")}
            </div>
          )}

          {/* 3. COMPLETED STATE */}
          {isCompleted && (
            <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <CheckCircle
                size={32}
                className="text-emerald-600 mx-auto mb-2"
              />
              <p className="font-semibold text-emerald-800">
                Task Completed. Earnings secured.
              </p>
            </div>
          )}

          <button
            onClick={() => navigate("/riderdeliveryqueue")}
            className="w-full text-sm text-gray-600 hover:text-gray-900 mt-2"
          >
            Back to Delivery Queue
          </button>
        </div>
      </main>
    </div>
  );
};

export default RiderDeliveryDetail;
