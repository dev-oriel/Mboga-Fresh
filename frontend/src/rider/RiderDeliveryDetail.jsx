// frontend/src/rider/RiderDeliveryDetail.jsx - MODIFIED

import React from "react";
import { useParams, useNavigate } from "react-router-dom"; // <-- ADD useNavigate
import RiderHeader from "../components/riderComponents/RiderHeader";
import QRCodeScanner from "../components/riderComponents/QRCodeScanner";

const RiderDeliveryDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate(); // <-- Initialize useNavigate

  // Handler for successful scan (simulated successful pickup/scan at vendor/buyer)
  const handleScanComplete = (scannedOrderData, action) => {
    if (action === "accepted") {
      // Navigate to the final confirmation screen, passing the scanned data in state
      navigate("/rider-confirm-delivery", { state: { scannedOrderData } });
    } else {
      alert("Scan processing error or rejection.");
    }
  };

  const pageContainerStyle = {
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
  };

  const titleBarStyle = {
    padding: "10px 40px",
    backgroundColor: "#fff",
    borderBottom: "1px solid #ddd",
    fontSize: "18px",
    color: "#333",
    fontWeight: "normal",
  };

  return (
    <div style={pageContainerStyle}>
      {/* 1. Page Title Bar */}
      <div style={titleBarStyle}>Delivery Details - Order #{orderId}</div>

      {/* 2. Navigation Header */}
      <RiderHeader />

      {/* 3. Main Content Area - Pass the handler */}
      <main>
        <QRCodeScanner
          orderId={orderId}
          onScanComplete={handleScanComplete} // <-- NEW HANDLER
        />
      </main>
    </div>
  );
};

export default RiderDeliveryDetail;
