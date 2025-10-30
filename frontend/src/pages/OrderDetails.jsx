import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/FooterSection";
import { fetchOrderDetails } from "../api/orders";
import { Loader2, Zap, AlertTriangle } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

const formatCurrency = (amount) =>
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
  if (
    lowerStatus === "in delivery" ||
    lowerStatus === "shipped" ||
    lowerStatus === "in transit"
  )
    return {
      label: "In Transit",
      bg: "bg-blue-100",
      text: "text-blue-700",
      icon: "local_shipping",
    };
  if (
    lowerStatus === "processing" ||
    lowerStatus === "confirmed" ||
    lowerStatus === "new order" ||
    lowerStatus === "qr scanning"
  )
    return {
      label: "Processing",
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      icon: "schedule",
    };
  if (lowerStatus === "cancelled")
    return {
      label: "Cancelled",
      bg: "bg-red-100",
      text: "text-red-700",
      icon: "cancel",
    };
  return {
    label: status || "Pending",
    bg: "bg-gray-100",
    text: "text-gray-700",
    icon: "info",
  };
};

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadOrderDetails = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchOrderDetails(orderId);
      setOrder(data);
      console.log("Order details loaded:", data); // Log to see if 'task' is present
      setError(null);
    } catch (err) {
      console.error("Error fetching order details:", err);
      setError(
        "Failed to load order details. It might not exist or you don't have permission."
      );
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    loadOrderDetails();
  }, [loadOrderDetails]);

  // --- FIX: QR Code now uses the buyerConfirmationCode from the task ---
  const buyerCode = order?.task?.buyerConfirmationCode || "NO-CODE";
  const qrData = JSON.stringify({
    type: "DELIVERY",
    code: buyerCode,
  });
  // --- END OF FIX ---

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow container mx-auto p-8 text-center">
          <div className="text-lg text-gray-600 mt-16">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-600 mb-3" />
            Loading order details...
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow container mx-auto p-8 text-center">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mt-16 max-w-md mx-auto">
            <p>{error || "Order details could not be loaded."}</p>
            <button
              onClick={() => navigate("/orders")}
              className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
            >
              Back to Order History
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const badge = getStatusBadgeProps(order.orderStatus);
  const shippingFee =
    order.totalAmount -
    (order.items || []).reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  const itemSubtotal = order.totalAmount - shippingFee;

  // --- FIX: Show QR section only if the task exists and order is not delivered ---
  const showQrSection =
    order.task &&
    order.orderStatus !== "Delivered" &&
    order.orderStatus !== "Cancelled";

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f8f6]">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: QR Code & Status */}
          {showQrSection && (
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 text-center sticky top-20">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center justify-center">
                  <Zap size={20} className="mr-2 text-emerald-600" /> Delivery
                  Confirmation
                </h2>

                <div className="flex justify-center mb-4 p-2 bg-gray-100 rounded-lg">
                  <QRCodeCanvas
                    value={qrData}
                    size={200}
                    level="H"
                    includeMargin={false}
                  />
                </div>

                {/* --- FIX: Show the manual code --- */}
                <p className="text-sm font-medium text-gray-700">
                  Or show the rider this manual code:
                </p>
                <p className="text-4xl font-bold text-gray-900 tracking-widest my-2">
                  {buyerCode}
                </p>

                <p className="text-xs text-gray-500 mt-2">
                  Order ID:{" "}
                  <span className="font-mono font-semibold">{order._id}</span>
                </p>
              </div>
            </div>
          )}

          {/* Right Column: Order Details, Items, and Totals */}
          <div
            className={
              showQrSection
                ? "lg:col-span-2 space-y-6"
                : "lg:col-span-3 space-y-6"
            }
          >
            {/* Order Header/Status */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  Order #{order._id.substring(18).toUpperCase()}
                </h1>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badge.bg} ${badge.text}`}
                >
                  {badge.label}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Placed on {new Date(order.createdAt).toLocaleDateString()} at{" "}
                {new Date(order.createdAt).toLocaleTimeString()}
              </p>
            </div>

            {/* Items List */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Items Summary
              </h2>
              <div className="divide-y divide-gray-100">
                {(order.items || []).map((item, index) => (
                  <div
                    key={item.product || index}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="flex-grow">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">x{item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-800">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Address and Financial Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Shipping Details */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">
                  Shipping To
                </h2>
                <p className="font-medium text-gray-900">
                  {order.shippingAddress.street}
                </p>
                <p className="text-gray-600 text-sm">
                  {order.shippingAddress.city},{" "}
                  {order.shippingAddress.postalCode}
                </p>
                <p className="text-gray-600 text-sm">
                  {order.shippingAddress.country}
                </p>
              </div>

              {/* Financial Summary */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">
                  Charges
                </h2>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between text-gray-700">
                    <span>Item Subtotal:</span>{" "}
                    <span>{formatCurrency(itemSubtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Delivery Fee:</span>{" "}
                    <span>{formatCurrency(shippingFee)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t font-bold text-lg text-gray-900">
                    <span>Total Paid:</span>{" "}
                    <span>{formatCurrency(order.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderDetails;
