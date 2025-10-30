import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import RiderHeader from "../components/riderComponents/RiderHeader";
import {
  fetchOrderDetails,
  confirmPickup,
  confirmDelivery,
  fetchRiderAcceptedTasks,
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
  X,
  DollarSign,
} from "lucide-react";
import QrScanner from "qr-scanner"; // 1. IMPORT THE SCANNER

const formatKsh = (amount) =>
  `Ksh ${Number(amount).toLocaleString("en-KE", { minimumFractionDigits: 0 })}`;

const getStatusBadgeProps = (status) => {
  const lowerStatus = status ? status.toLowerCase() : "";
  if (lowerStatus === "delivered")
    return {
      label: "Delivered",
      bg: "bg-emerald-100",
      text: "text-emerald-700",
      icon: "check_circle",
    };
  if (lowerStatus === "in delivery" || lowerStatus === "in transit")
    return {
      label: "In Delivery",
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
    label: status || "Pending",
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
  const [fetchError, setFetchError] = useState(null);
  const [vendorCodeInput, setVendorCodeInput] = useState("");
  const [buyerCodeInput, setBuyerCodeInput] = useState("");
  const [apiMessage, setApiMessage] = useState(null);
  const [processing, setProcessing] = useState(false);

  const [showManualInput, setShowManualInput] = useState(
    location.state?.forceManual || false
  );

  // 2. ADD REFS FOR SCANNER
  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);

  const loadOrderDetails = useCallback(async () => {
    if (!user || !orderId) {
      setLoading(false);
      setFetchError("Invalid Order ID provided in URL.");
      return;
    }
    setLoading(true);
    setFetchError(null);

    try {
      // Attempt 1: Direct Fetch (Relies on backend authorization check)
      const data = await fetchOrderDetails(orderId);
      setOrder(data);
    } catch (err) {
      const status = err.response?.status;
      console.error(
        `[RiderDetail] Direct fetch failed (Status: ${status}). Attempting Failover.`,
        err
      );

      // Attempt 2: Failover - Find order in accepted queue list
      try {
        const acceptedTasks = await fetchRiderAcceptedTasks();
        const task = acceptedTasks.find(
          (t) => String(t.orderId) === String(orderId)
        );

        if (task) {
          setOrder({
            _id: task.orderId,
            orderStatus: task.status,
            shippingAddress: { street: task.deliveryAddress, city: "" },
            items: [
              { name: "Delivery Task", quantity: 1, vendor: task.vendorName },
            ],
            task: {
              pickupCode: task.pickupCode,
              buyerConfirmationCode: task.buyerConfirmationCode,
            },
            __isFallback: true,
          });
          setFetchError(
            `(Warning: Code ${
              status || "N/A"
            }) Authorization issue. Displaying basic task info.`
          );
        } else {
          setOrder(null);
          setFetchError(
            `(Code ${status || "N/A"}) The order or task could not be found.`
          );
        }
      } catch (failoverError) {
        setOrder(null);
        setFetchError(
          `FATAL ERROR. Cannot verify task status. Message: ${
            failoverError.message || failoverError
          }`
        );
      }
    } finally {
      setLoading(false);
    }
  }, [orderId, user]);

  useEffect(() => {
    loadOrderDetails();
  }, [loadOrderDetails]);

  // This function is now wrapped in useCallback
  const handleStatusUpdate = useCallback(
    async (actionType, scannedCode) => {
      if (!order) return;
      setProcessing(true);
      setApiMessage(null);

      // Use the scanned code if provided, otherwise use the state input
      const codeToUse = scannedCode
        ? scannedCode.toUpperCase()
        : actionType === "PICKUP"
        ? vendorCodeInput
        : buyerCodeInput;

      try {
        if (actionType === "PICKUP") {
          if (!codeToUse || codeToUse.length < 6)
            throw new Error("Pickup code must be 6 characters.");

          await confirmPickup(orderId, codeToUse);

          setApiMessage({
            type: "success",
            text: "Pickup confirmed! Order status updated to In Delivery.",
          });
          setVendorCodeInput("");
        } else if (actionType === "DELIVERY") {
          if (!codeToUse || codeToUse.length < 6)
            throw new Error("Buyer confirmation code must be 6 digits.");

          await confirmDelivery(orderId, codeToUse);

          setApiMessage({
            type: "success",
            text: "Delivery complete! Earnings secured.",
          });
          setBuyerCodeInput("");
        }

        await loadOrderDetails(); // Refresh data to show new status
      } catch (err) {
        const msg =
          err.response?.data?.message || err.message || "Confirmation failed.";
        setApiMessage({ type: "error", text: msg });
        // If the scan failed, restart the camera
        setShowManualInput(false);
      } finally {
        setProcessing(false);
      }
    },
    [order, orderId, vendorCodeInput, buyerCodeInput, loadOrderDetails]
  ); // Dependencies

  // 3. ADD useEffect FOR CAMERA LIFECYCLE
  useEffect(() => {
    // Only run if not in manual mode, ref is ready, and not already processing
    if (!showManualInput && videoRef.current && !processing) {
      qrScannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          if (processing) return; // Don't allow multiple scans if one is processing

          console.log("Decoded QR code:", result.data);
          qrScannerRef.current.stop(); // Stop the camera immediately

          let scannedCode;
          let scannedType;

          // --- NEW VALIDATION LOGIC ---
          try {
            // Try to parse the code as JSON
            const parsedData = JSON.parse(result.data);
            scannedCode = parsedData.code.trim().toUpperCase();
            scannedType = parsedData.type.trim().toUpperCase();
          } catch (e) {
            // If it's not JSON, it's an old or simple code (like "H3FG7D")
            scannedCode = result.data.trim().toUpperCase();
            scannedType = "SIMPLE"; // A simple code
          }
          // --- END NEW LOGIC ---

          const currentStatus = order?.orderStatus?.toLowerCase() || "";
          const isPickup =
            currentStatus === "qr scanning" ||
            currentStatus === "accepted/awaiting pickup";
          const isDelivery =
            currentStatus === "in delivery" || currentStatus === "in transit";

          if (isPickup) {
            // We are in PICKUP phase. We expect a PICKUP code (or a SIMPLE code for fallback)
            if (scannedType === "PICKUP" || scannedType === "SIMPLE") {
              setVendorCodeInput(scannedCode);
              handleStatusUpdate("PICKUP", scannedCode);
            } else {
              // Scanned a DELIVERY code at the vendor
              setApiMessage({
                type: "error",
                text: "Wrong QR Code. Please scan the VENDOR's code.",
              });
              // Restart camera after a delay
              setTimeout(() => qrScannerRef.current?.start(), 2000);
            }
          } else if (isDelivery) {
            // We are in DELIVERY phase. We only expect a DELIVERY code.
            if (scannedType === "DELIVERY" || scannedType === "SIMPLE") {
              setBuyerCodeInput(scannedCode);
              handleStatusUpdate("DELIVERY", scannedCode);
            } else {
              // Scanned a VENDOR code at the buyer
              setApiMessage({
                type: "error",
                text: "Wrong QR Code. Please scan the BUYER's code.",
              });
              // Restart camera after a delay
              setTimeout(() => qrScannerRef.current?.start(), 2000);
            }
          }
        },
        {
          onDecodeError: (error) => {
            // console.warn("QR Scan Error:", error);
          },
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      qrScannerRef.current.start().catch((err) => {
        console.error("Failed to start QR scanner", err);
        setApiMessage({
          type: "error",
          text: "Could not start camera. Check permissions and use manual input.",
        });
        setShowManualInput(true);
      });
    }

    // Cleanup
    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.stop();
        qrScannerRef.current.destroy();
        qrScannerRef.current = null;
      }
    };
  }, [showManualInput, order, processing, handleStatusUpdate]);

  // RENDER HELPER: Renders the Manual Input Form
  const renderManualForm = (type) => {
    const isPickup = type === "PICKUP";
    const codeValue = isPickup ? vendorCodeInput : buyerCodeInput;
    const setCodeValue = isPickup ? setVendorCodeInput : setBuyerCodeInput;
    const buttonLabel = isPickup ? "Verify Pickup" : "Complete Delivery";
    const placeholderText = isPickup
      ? "Enter VENDOR Pickup Code"
      : "Enter BUYER Confirmation Code";
    const isCodeValid = codeValue.length === 6;

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
          className={`w-full p-3 border-2 rounded-lg font-mono text-lg uppercase text-center ${
            isCodeValid ? "border-emerald-400" : "border-gray-300"
          }`}
          disabled={processing}
        />

        <button
          onClick={() => handleStatusUpdate(type)}
          disabled={processing || !isCodeValid}
          className={`w-full py-3 rounded-lg font-bold text-white transition bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400`}
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

  // Renders the Camera Placeholder View
  const renderScanView = (type) => (
    <div className="space-y-4 pt-2">
      <div className="relative w-full max-w-sm h-64 mx-auto mb-3 rounded-xl overflow-hidden border-4 border-gray-300 bg-black">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          style={{ transform: "scaleX(-1)" }} // Flip horizontally for a mirror effect
        />
        <div className="absolute inset-0 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] flex items-center justify-center">
          <div className="w-48 h-48 border-4 border-emerald-500 rounded-lg" />
        </div>
      </div>

      <button
        onClick={() => setShowManualInput(true)}
        className="w-full py-3 rounded-lg font-bold text-white transition bg-red-600 hover:bg-red-700"
      >
        Use Manual Code Input
      </button>
    </div>
  );

  // --- Main Render Logic ---

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <RiderHeader />
        <main className="flex-grow container mx-auto p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-600 mt-16" />
        </main>
      </div>
    );
  }

  if (fetchError || !order) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <RiderHeader />
        <main className="flex-grow container mx-auto p-8 max-w-lg">
          <div className="bg-white rounded-xl shadow-xl p-6 border-l-4 border-red-500 mt-16 text-center">
            <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-3" />
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              Error Loading Task
            </h1>
            <p className="text-sm text-gray-600 mb-4">
              <strong>
                {fetchError || "The order or task could not be found."}
              </strong>
              <br />
              <span className="text-xs text-gray-400 mt-1 block">
                Ensure the task is accepted and you are the assigned rider.
              </span>
            </p>
            <button
              onClick={() => navigate("/riderdeliveryqueue")}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
            >
              Back to Queue
            </button>
          </div>
        </main>
      </div>
    );
  }

  // ----- CODE RESUMES FROM YOUR SCREENSHOT -----

  const badge = getStatusBadgeProps(order.orderStatus);
  const currentStatus = order.orderStatus.toLowerCase();
  const isReadyForPickup =
    currentStatus === "qr scanning" ||
    currentStatus === "accepted/awaiting pickup";
  const isReadyForDeliveryConfirmation =
    currentStatus === "in delivery" || currentStatus === "in transit";
  const isCompleted = currentStatus === "delivered";

  const vendorName =
    order.items?.[0]?.vendor?.businessName ||
    order.items?.[0]?.vendor?.name ||
    order.items?.[0]?.vendor ||
    "Vendor";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <RiderHeader />
      <main className="flex-grow p-4 sm:p-8 max-w-lg mx-auto w-full">
        <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-200 space-y-6">
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

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Zap size={20} className="text-red-600" />
              <span className="text-sm font-medium text-gray-700">
                Pickup: {vendorName}
              </span>
              <span className="text-xs text-gray-400">
                {order.shippingAddress.city}
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <MapPin size={20} className="text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                Dropoff: {order.shippingAddress.street}
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Package size={20} className="text-emerald-600" />
              <span className="text-sm font-medium text-gray-700">
                Total Items: {order.items.length}
              </span>
            </div>
          </div>

          {isReadyForPickup && !isCompleted && (
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Vendor Confirmation (Pickup)
              </h3>
              {showManualInput
                ? renderManualForm("PICKUP")
                : renderScanView("PICKUP")}
            </div>
          )}

          {isReadyForDeliveryConfirmation && !isCompleted && (
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Buyer Confirmation (Dropoff)
              </h3>
              {showManualInput
                ? renderManualForm("DELIVERY")
                : renderScanView("DELIVERY")}
            </div>
          )}

          {isCompleted && (
            <div className="pt-4 border-t border-gray-200">
              <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <CheckCircle
                  size={32}
                  className="text-emerald-600 mx-auto mb-2"
                />
                <p className="font-semibold text-emerald-800">
                  Task Completed. Order fulfillment finished.
                </p>
              </div>
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
