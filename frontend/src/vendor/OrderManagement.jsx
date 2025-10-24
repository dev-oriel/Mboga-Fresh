// frontend/src/vendor/OrderManagement.jsx - MODIFIED FOR LIVE DATA AND QR GENERATION

import React, { useState, useEffect, useCallback } from "react";
import { QRCodeCanvas } from "qrcode.react";
import Header from "../components/vendorComponents/Header";
import { useAuth } from "../context/AuthContext";
// Import the live data fetching API
import { fetchVendorOrders } from "../api/orders";
import { Loader2 } from "lucide-react";

// --- Helper Functions (Re-used for UI) ---

const formatCurrency = (amount) =>
  `Ksh ${Number(amount).toLocaleString("en-KE", { minimumFractionDigits: 0 })}`;

const getStatusColor = (status) => {
  switch (status) {
    case "Processing":
      return "bg-yellow-100 text-yellow-700";
    case "QR Scanning":
      return "bg-emerald-100 text-emerald-700";
    case "Confirmed":
      return "bg-blue-100 text-blue-700";
    case "Delivered":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getPaymentColor = (payment) => {
  switch (payment) {
    case "Escrow":
      return "bg-yellow-100 text-yellow-700";
    case "Paid":
      return "bg-green-100 text-green-700";
    default:
      return "bg-red-100 text-red-700";
  }
};

const getActionButton = (action) => {
  if (action === "View Details") {
    return "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50";
  } else if (action === "Accept Order") {
    return "bg-green-500 text-white hover:bg-green-600";
  } else if (action === "Show QR Code") {
    return "bg-emerald-500 text-white hover:bg-emerald-600"; // Changed to emerald for QR action
  } else {
    return "bg-gray-100 text-gray-600 cursor-not-allowed";
  }
};
// -----------------------------------------------------------

export default function OrderManagement() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("new");
  const [orders, setOrders] = useState([]); // Will hold LIVE API data
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null); // Used for details modal
  const [showQrCodeModal, setShowQrCodeModal] = useState(false);
  const [qrCodeOrder, setQrCodeOrder] = useState(null); // Order to generate QR for

  // 1. Fetch Live Orders for this Vendor
  const loadVendorOrders = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setApiError(null);
    try {
      const data = await fetchVendorOrders();

      const mappedOrders = data.map((order) => {
        // Ensure total amount is formatted
        const totalAmount = order.totalAmount;
        const totalItems = order.items.reduce((sum, i) => sum + i.quantity, 0);

        const itemsList = order.items
          .map((i) => `${i.quantity}x ${i.name}`)
          .join(", ");

        return {
          id: order._id,
          buyer: `Buyer #${order.user.substring(18).toUpperCase()}`, // Mock buyer name
          items: itemsList,
          amount: formatCurrency(totalAmount),
          status: order.orderStatus,
          payment: order.paymentStatus === "Paid" ? "Escrow" : "Unpaid",
          action:
            order.orderStatus === "Processing"
              ? "Accept Order"
              : order.orderStatus === "QR Scanning"
              ? "Show QR Code"
              : "View Details", // Dynamic Action
          __raw: order,
        };
      });

      setOrders(mappedOrders);
    } catch (err) {
      console.error("Failed to load vendor orders:", err);
      setApiError("Failed to fetch orders. Check API connection.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadVendorOrders();
  }, [loadVendorOrders]);

  // 2. Handle Actions (Accept, Show QR)
  const handleAction = (order) => {
    if (order.action === "Accept Order") {
      // CRITICAL STEP: When accepting, we immediately generate QR data based on the API order ID
      const acceptedOrders = orders.map((o) =>
        o.id === order.id
          ? {
              ...o,
              status: "QR Scanning",
              action: "Show QR Code",
            }
          : o
      );
      setOrders(acceptedOrders);

      // Show QR code right away using the updated order object
      setQrCodeOrder(acceptedOrders.find((o) => o.id === order.id));
      setShowQrCodeModal(true);

      // NOTE: In production, you would call a PATCH /api/orders/{id}/status API here.
    } else if (order.action === "Show QR Code") {
      setQrCodeOrder(order);
      setShowQrCodeModal(true);
    } else if (order.action === "View Details") {
      setSelectedOrder(order);
    }
  };

  const handleMarkAsDelivered = (orderId) => {
    // This button is mainly for the QR scan confirmation process or manual closing.
    // It should call a backend endpoint to finalize the order.
    alert(`Simulating completion for Order ${orderId}`);
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: "Delivered",
              action: "View Details",
              payment: "Paid",
            }
          : o
      )
    );
  };

  // Filters remain dependent on the local 'orders' state
  const filteredOrders = orders.filter((order) => {
    if (activeTab === "new") return order.status === "Processing";
    if (activeTab === "qr") return order.status === "QR Scanning";
    if (activeTab === "delivery") return order.status === "Confirmed";
    if (activeTab === "completed") return order.status === "Delivered";
    return true;
  });

  const getTabCount = (tab) => {
    if (tab === "new")
      return orders.filter((o) => o.status === "Processing").length;
    if (tab === "qr")
      return orders.filter((o) => o.status === "QR Scanning").length;
    if (tab === "delivery")
      return orders.filter((o) => o.status === "Confirmed").length;
    if (tab === "completed")
      return orders.filter((o) => o.status === "Delivered").length;
    return 0;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header avatarUrl={user?.avatar} userName={user?.name || "Vendor"} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Management
          </h1>
          <p className="text-gray-600">
            Manage your incoming and ongoing customer orders.
          </p>
          {apiError && (
            <div className="mt-4 text-red-600 bg-red-100 p-3 rounded-lg">
              {apiError}
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-8 border-b border-gray-200 mb-6">
          {["new", "qr", "delivery", "completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-1 relative ${
                activeTab === tab
                  ? "text-green-600 font-medium"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center space-x-2">
                {/* Using placeholder SVG for icons for brevity, replace with actual Lucide icons */}
                <span>
                  {tab === "new"
                    ? "New Orders"
                    : tab === "qr"
                    ? "QR Scanning"
                    : tab === "delivery"
                    ? "In Delivery"
                    : "Completed"}
                </span>
                <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {getTabCount(tab)}
                </span>
              </div>
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"></div>
              )}
            </button>
          ))}
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow">
          {loading ? (
            <div className="text-center py-12 text-gray-600">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
              Fetching orders...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              No {activeTab} orders to display.
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Buyer
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="py-4 px-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6 text-sm text-gray-900 font-medium">
                      {order.id.substring(18).toUpperCase()}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700">
                      {order.buyer}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700">
                      {order.items}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900 font-medium">
                      {order.amount}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getPaymentColor(
                          order.payment
                        )}`}
                      >
                        {order.payment}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {activeTab !== "delivery" && (
                        <button
                          onClick={() => handleAction(order)}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${getActionButton(
                            order.action
                          )}`}
                        >
                          {order.action}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* QR Code Display Modal (for rider to scan) */}
        {showQrCodeModal && qrCodeOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md relative">
              <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                Rider Confirmation Code
              </h2>
              <p className="text-gray-600 text-sm mb-6 text-center">
                The rider scans this QR code to confirm pickup.
              </p>
              <div className="flex justify-center mb-6 bg-gray-50 p-4 rounded">
                <QRCodeCanvas
                  // CRITICAL: The data must contain the Order ID for the rider to confirm
                  value={JSON.stringify({
                    orderId: qrCodeOrder.id,
                    vendorId: user._id,
                    amount: qrCodeOrder.amount,
                  })}
                  size={256}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <div className="text-center mb-4">
                <p className="text-sm font-medium text-gray-700">
                  Order: #{qrCodeOrder.id.substring(18).toUpperCase()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowQrCodeModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Order Details Modal (Selected Order) - unchanged for now */}
        {selectedOrder && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setSelectedOrder(null)}
          >
            {/* ... (Modal content for details view) ... */}
          </div>
        )}
      </main>
    </div>
  );
}
