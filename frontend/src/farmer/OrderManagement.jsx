import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { orders as initialOrders } from "../constants";
import Header from "../components/vendorComponents/Header";

export default function OrderManagement() {
  const [activeTab, setActiveTab] = useState("new");
  const [orders, setOrders] = useState(
    initialOrders.map((o) => ({ ...o, payment: "Escrow" }))
  );
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showQrCodeModal, setShowQrCodeModal] = useState(false);
  const [qrCodeOrder, setQrCodeOrder] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "QR Scanning":
        return "bg-green-100 text-green-700"; // changed to green
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
      return "bg-green-500 text-white hover:bg-green-600";
    } else {
      return "bg-gray-100 text-gray-600 cursor-not-allowed";
    }
  };

  const handleAction = (order) => {
    if (order.action === "Accept Order") {
      // When accepting order, generate QR code for customer to scan
      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id
            ? {
                ...o,
                status: "QR Scanning",
                action: "Show QR Code",
                payment: "Escrow",
              }
            : o
        )
      );
    } else if (order.action === "Show QR Code") {
      // Show QR code modal for customer to scan
      setQrCodeOrder(order);
      setShowQrCodeModal(true);
    } else if (order.action === "View Details") {
      setSelectedOrder(order);
    }
  };

  const handleMarkAsDelivered = (orderId) => {
    // Move to delivered/completed and mark as paid
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

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "new") return order.status === "Pending";
    if (activeTab === "qr") return order.status === "QR Scanning";
    if (activeTab === "delivery") return order.status === "Confirmed";
    if (activeTab === "completed") return order.status === "Delivered";
    return true;
  });

  const getTabCount = (tab) => {
    if (tab === "new")
      return orders.filter((o) => o.status === "Pending").length;
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
      <Header
        avatarUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuDeL7radWSj-FEteEjqLpufXII3-tc_o7GMvLvB07AaD_bYBkfAcIOnNbOXkTdMOHRgJQwLZE-Z_iw72Bd8bpHzfXP_m0pIvteSw7FKZ1qV9GD1KfgyDVG90bCO7OGe6JyYIkm9DBo2ArC60uEqSfDvnnYWeo6IqVEjWxsVX6dUoxjm9ozyVlriiMdVLc_jU9ZxS01QcxNa8hn-ePNbB6IcXSwExf2U61R-epab8nsOkbq95E7z6b-fH4zOt0j2MPt20nrqtPM1NHI"
        userName="Daniel Mutuku"
      />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Management
          </h1>
          <p className="text-gray-600">
            Manage your incoming and ongoing orders, Mama Mboga.
          </p>
        </div>

        <div className="flex space-x-8 border-b border-gray-200 mb-6">
          {/* New Orders */}
          <button
            onClick={() => setActiveTab("new")}
            className={`pb-4 px-1 relative ${
              activeTab === "new"
                ? "text-green-600 font-medium"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <div className="flex items-center space-x-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span>New Orders</span>
              <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                {getTabCount("new")}
              </span>
            </div>
            {activeTab === "new" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"></div>
            )}
          </button>

          {/* QR Scanning */}
          <button
            onClick={() => setActiveTab("qr")}
            className={`pb-4 px-1 relative ${
              activeTab === "qr"
                ? "text-green-600 font-medium"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <div className="flex items-center space-x-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4h5v5H4zM15 4h5v5h-5zM4 15h5v5H4zM15 15h5v5h-5z"
                />
              </svg>
              <span>QR Scanning</span>
              <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                {getTabCount("qr")}
              </span>
            </div>
            {activeTab === "qr" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"></div>
            )}
          </button>

          {/* In Delivery */}
          <button
            onClick={() => setActiveTab("delivery")}
            className={`pb-4 px-1 relative ${
              activeTab === "delivery"
                ? "text-green-600 font-medium"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <div className="flex items-center space-x-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9"
                />
              </svg>
              <span>In Delivery</span>
              <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                {getTabCount("delivery")}
              </span>
            </div>
            {activeTab === "delivery" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"></div>
            )}
          </button>

          {/* Completed */}
          <button
            onClick={() => setActiveTab("completed")}
            className={`pb-4 px-1 relative ${
              activeTab === "completed"
                ? "text-green-600 font-medium"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <div className="flex items-center space-x-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Completed</span>
              <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                {getTabCount("completed")}
              </span>
            </div>
            {activeTab === "completed" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"></div>
            )}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow">
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
                    {order.id}
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
                        order.status === "Delivered" ? "Paid" : order.payment
                      )}`}
                    >
                      {order.status === "Delivered" ? "Paid" : order.payment}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {/* Don't show button in delivery tab */}
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
        </div>
      </main>

      {/* QR Code Display Modal (for customer to scan) */}
      {showQrCodeModal && qrCodeOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md relative">
            <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center">
              Customer Scan Code
            </h2>
            <p className="text-gray-600 text-sm mb-6 text-center">
              Show this QR code to the Rider to scan
            </p>
            <div className="flex justify-center mb-6 bg-white p-4 rounded">
              <QRCodeCanvas
                value={JSON.stringify({
                  orderId: qrCodeOrder.id,
                  buyer: qrCodeOrder.buyer,
                  amount: qrCodeOrder.amount,
                  timestamp: Date.now(),
                })}
                size={256}
                level="H"
                includeMargin={true}
              />
            </div>
            <div className="text-center mb-4">
              <p className="text-sm font-medium text-gray-700">
                Order: {qrCodeOrder.id}
              </p>
              <p className="text-sm text-gray-600">
                Buyer: {qrCodeOrder.buyer}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowQrCodeModal(false);
                  setQrCodeOrder(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Order Details
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedOrder.id}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Buyer</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedOrder.buyer}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Items</p>
                <p className="text-lg font-semibold text-gray-900">
                  {selectedOrder.items}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedOrder.amount}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Status</p>
                  <span
                    className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getPaymentColor(
                      selectedOrder.status === "Delivered"
                        ? "Paid"
                        : selectedOrder.payment
                    )}`}
                  >
                    {selectedOrder.status === "Delivered"
                      ? "Paid"
                      : selectedOrder.payment}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Order Status</p>
                <span
                  className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                    selectedOrder.status
                  )}`}
                >
                  {selectedOrder.status}
                </span>
              </div>

              {/* Show Mark as Delivered only if in delivery */}
              {selectedOrder.status === "Confirmed" && (
                <button
                  onClick={() => {
                    handleMarkAsDelivered(selectedOrder.id);
                    setSelectedOrder(null);
                  }}
                  className="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                >
                  Mark as Delivered
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
