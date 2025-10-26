import React, { useState, useRef, useEffect } from "react";
import {
  Package,
  MapPin,
  User,
  Clock,
  CheckCircle,
  Camera,
  XCircle,
  AlertCircle,
  Zap,
} from "lucide-react";
// import QrScanner from 'qr-scanner'; // Note: Assuming external scanner library is not mandatory for demo

const QRCodeScanner = ({ orderId = "ORD123456", onScanComplete, onCancel }) => {
  const [scanning, setScanning] = useState(true);
  const [scannedData, setScannedData] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const taskTypeRef = useRef("pickup");

  useEffect(() => {
    // Check for secure context and availability before starting camera
    if (
      window.location.protocol !== "https:" &&
      window.location.hostname !== "localhost"
    ) {
      setError(
        "Camera access requires a secure connection (HTTPS) or localhost. Please use the Demo Scan."
      );
      setCameraActive(false);
      setScanning(false);
    } else if (scanning && !scannedData) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [scanning, scannedData]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const startCamera = async () => {
    setError(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("Camera API not found.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
        // NOTE: Live scanning loop disabled for stability, relying on demo scan
      }
    } catch (err) {
      console.error("Camera access failed:", err);
      setError("Camera access denied. Please check your browser permissions.");
      setCameraActive(false);
    }
  };

  const handleQRCodeDetected = async (qrData) => {
    setScanning(false);
    stopCamera();
    setLoading(true);

    try {
      const parsedData = JSON.parse(qrData);
      setScannedData(parsedData);

      const isPickupScan = !!parsedData.vendorId; // True if Vendor QR was scanned

      const orderData = {
        orderId: parsedData.orderId,
        totalAmount: parsedData.amount,
        isPickup: isPickupScan,
        // Mocked extended data for the confirmation screen
        customerName: "Aisha Hassan",
        deliveryAddress: "2nd Floor, Gibcon House",
        escrowAmount: 750,
        items: [
          { name: "Red Onions", qty: 2 },
          { name: "Maize Stalks", qty: 1 },
        ],
      };

      taskTypeRef.current = isPickupScan ? "pickup" : "delivery";
      setOrderDetails({
        ...orderData,
        status: isPickupScan ? "Confirm Pickup" : "Confirm Final Delivery",
      });
    } catch (err) {
      console.error("Error processing QR code:", err);
      setError("Invalid QR code format. Please rescan.");
      setLoading(false);
      setScanning(true);
      startCamera();
    }
  };

  const handleManualAction = (action) => {
    if (onScanComplete) {
      onScanComplete(orderDetails, action); // Passes to RiderDeliveryDetail.jsx
    }
  };

  const handleManualScan = () => {
    // SIMULATION: Mock VENDOR SCAN data (Order acceptance/Pickup confirmation)
    const mockVendorQR = JSON.stringify({
      orderId: orderId || "ORD-TEST-1234",
      vendorId: "68f7bc6fd39770049bed075d", // Dummy Vendor ID (triggers isPickupScan=true)
      amount: 855.0,
      pickupCode: "H3FG7D",
      timestamp: Date.now(),
    });
    handleQRCodeDetected(mockVendorQR);
  };

  const handleCancel = () => {
    setScanning(false);
    setScannedData(null);
    setOrderDetails(null);
    stopCamera();
    if (onCancel) {
      onCancel();
    }
  };

  const handleRescan = () => {
    setScanning(true);
    setScannedData(null);
    setOrderDetails(null);
    setError(null);
    startCamera();
  };

  // Order confirmation page after successful scan
  if (orderDetails && !loading) {
    return (
      <div className="max-w-md mx-auto p-4">
        <div className="bg-white rounded-xl shadow-xl">
          <div className="p-6 text-center border-b">
            <CheckCircle size={32} className="text-emerald-600 mx-auto mb-2" />
            <h2 className="text-xl font-bold text-gray-900">Order Verified!</h2>
            <p className="text-sm text-gray-600">{orderDetails.status}</p>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <MapPin size={20} className="text-emerald-600" />
              <span className="text-sm font-medium text-gray-800">
                Deliver To: {orderDetails.deliveryAddress}
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-gray-800">Items:</h3>
              {orderDetails.items.map((item, idx) => (
                <p key={idx} className="text-sm text-gray-700">
                  • {item.name} (x{item.quantity})
                </p>
              ))}
            </div>

            <button
              onClick={() => handleManualAction("accepted")}
              className="w-full py-3 rounded-lg font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition"
            >
              {taskTypeRef.current === "pickup"
                ? "Confirm Pickup"
                : "Complete Delivery"}
            </button>
            <button
              onClick={handleRescan}
              className="w-full py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition"
            >
              Cancel / Rescan
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Scanner view
  return (
    <div className="max-w-md mx-auto p-4">
      <div className="bg-white rounded-xl shadow-xl">
        <div className="p-6 text-center border-b">
          <h2 className="text-2xl font-bold text-gray-900">Scan QR Code</h2>
          <p className="text-gray-600 text-sm mt-1">
            Scan Vendor code for Pickup or Buyer code for Delivery.
          </p>
        </div>

        <div className="p-6">
          {error ? (
            <div className="text-center p-4 mb-4 bg-red-50 rounded-lg">
              <AlertCircle size={20} className="text-red-600 mx-auto mb-2" />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          ) : // Only show camera view if active and no error
          cameraActive ? (
            <div className="relative w-full max-w-sm h-80 mx-auto mb-5 rounded-xl overflow-hidden border-4 border-emerald-600 bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] flex items-center justify-center">
                <div className="w-48 h-48 border-4 border-emerald-500 rounded-lg animate-pulse" />
              </div>
            </div>
          ) : (
            // Initial state / Camera failed state
            <div className="w-full max-w-sm h-80 mx-auto mb-5 rounded-xl border-2 border-gray-300 flex items-center justify-center bg-gray-100">
              <Camera size={48} className="text-gray-500" />
            </div>
          )}

          <p className="text-center text-gray-500 text-sm mb-4">
            {cameraActive
              ? "Scanning live feed..."
              : "Use the button below to simulate scan."}
          </p>

          <button
            onClick={handleManualScan}
            className="w-full py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold transition"
          >
            Use Demo Scan (Bypass Camera)
          </button>

          <button
            onClick={handleCancel}
            className="w-full py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition mt-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeScanner;
