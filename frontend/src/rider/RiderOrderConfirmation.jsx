// frontend/src/rider/RiderOrderConfirmation.jsx (NEW FILE)

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import RiderHeader from "../components/riderComponents/RiderHeader";
import {
  CheckCircle,
  Truck,
  MapPin,
  User,
  DollarSign,
  XCircle,
} from "lucide-react";

// Helper function to format currency
const formatKsh = (amount) =>
  `Ksh ${Number(amount).toLocaleString("en-KE", { minimumFractionDigits: 0 })}`;

const RiderOrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // The data is passed via state from the page that processes the scan (e.g., QRCodeScanner.jsx)
  const { scannedOrderData } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [confirmationStatus, setConfirmationStatus] = useState(
    scannedOrderData ? "Awaiting Action" : "Error"
  );

  // Mock/Simulated Order Details (Replace with a call to fetchOrderDetails(scannedOrderData.id) in production)
  const order = scannedOrderData
    ? {
        id: scannedOrderData.id,
        amount: scannedOrderData.total,
        customerName: "Aisha Hassan",
        customerPhone: "0712 XXX XXX",
        deliveryAddress: "123 Acacia Avenue, Westlands",
        items: scannedOrderData.items || [
          { name: "Fresh Tomatoes", qty: 2 },
          { name: "Red Onions", qty: 3 },
        ],
        escrowAmount: scannedOrderData.total, // Assuming total amount is held in escrow
      }
    : null;

  const handleConfirmDelivery = async () => {
    if (!order || confirmationStatus !== "Awaiting Action") return;

    setLoading(true);
    // Simulate API call to mark order as DELIVERED and release escrow funds
    console.log(`Rider confirming delivery for Order ID: ${order.id}`);

    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay

    // In a real application:
    // try { await axios.patch('/api/orders/confirm-delivery', { orderId: order.id, riderId: user.id }) }
    // catch (err) { setError(err); setConfirmationStatus('Failed'); }

    setConfirmationStatus("Delivered");
    setLoading(false);
  };

  const isDelivered = confirmationStatus === "Delivered";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <RiderHeader />
      <main className="flex-grow p-4 sm:p-8 max-w-lg mx-auto w-full">
        <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-200 space-y-6">
          {/* Status Header */}
          <div className="text-center pb-4 border-b">
            {isDelivered ? (
              <CheckCircle
                size={48}
                className="text-emerald-600 mx-auto mb-3"
              />
            ) : confirmationStatus === "Error" ? (
              <XCircle size={48} className="text-red-600 mx-auto mb-3" />
            ) : (
              <Truck size={48} className="text-amber-600 mx-auto mb-3" />
            )}
            <h1 className="text-2xl font-bold text-gray-900">
              {isDelivered
                ? "Delivery Confirmed!"
                : `Order #${order?.id.substring(4) || "Error"}`}
            </h1>
            <p className="text-sm text-gray-600">
              {isDelivered
                ? "Funds released successfully."
                : "Ready for Final Confirmation."}
            </p>
          </div>

          {order && !isDelivered && (
            <>
              {/* Order Details */}
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-gray-800">
                  Delivery Information
                </h2>
                <DetailRow
                  icon={MapPin}
                  label="Address"
                  value={order.deliveryAddress}
                />
                <DetailRow
                  icon={User}
                  label="Customer"
                  value={order.customerName}
                />
                <DetailRow
                  icon={DollarSign}
                  label="Escrow Value"
                  value={formatKsh(order.escrowAmount)}
                />
              </div>

              {/* Items List - Concise */}
              <div className="space-y-2 border-t pt-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Items ({order.items.length})
                </h2>
                {order.items.map((item, index) => (
                  <p key={index} className="text-sm text-gray-700">
                    • {item.name} (x{item.qty})
                  </p>
                ))}
              </div>
            </>
          )}

          {/* Action Button */}
          <button
            onClick={handleConfirmDelivery}
            disabled={loading || isDelivered || !order}
            className={`w-full py-3 rounded-lg font-bold text-white transition ${
              isDelivered
                ? "bg-emerald-600 cursor-not-allowed"
                : loading
                ? "bg-gray-400"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading
              ? "Processing..."
              : isDelivered
              ? "Delivery Complete"
              : "Confirm Delivery"}
          </button>

          {/* Back button */}
          <button
            onClick={() => navigate("/riderdeliveryqueue")}
            className="w-full text-sm text-gray-600 hover:text-gray-900 mt-2"
          >
            Back to Queue
          </button>
        </div>
      </main>
    </div>
  );
};

// Helper component for clean detail rows
const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
    <Icon size={18} className="text-emerald-600 flex-shrink-0" />
    <div className="text-sm">
      <span className="font-medium text-gray-700">{label}:</span>
      <span className="font-semibold text-gray-900 ml-1">{value}</span>
    </div>
  </div>
);

export default RiderOrderConfirmation;
