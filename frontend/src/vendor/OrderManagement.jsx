import React, { useState } from "react";
import { orders as initialOrders } from "../constants";
import Header from "../components/vendorComponents/Header";
import Footer from "../components/vendorComponents/Footer"; 

export default function OrderManagement() {
  const [activeTab, setActiveTab] = useState("new");
  const [orders, setOrders] = useState(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // 🔹 Status color helper
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Confirmed":
        return "bg-blue-100 text-blue-700";
      case "Delivered":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // 🔹 Payment color helper
  const getPaymentColor = (payment) => {
    return payment === "Paid"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";
  };

  // 🔹 Button styling
  const getActionButton = (action) => {
    if (action === "View Details") {
      return "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50";
    } else if (action === "Mark as Delivered") {
      return "border border-green-600 text-green-600 bg-white hover:bg-green-50";
    } else {
      return "bg-green-500 text-white hover:bg-green-600";
    }
  };

  // 🔹 Handle order actions
  const handleAction = (order) => {
    if (order.action === "Accept Order") {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id
            ? { ...o, status: "Confirmed", action: "Mark as Delivered" }
            : o
        )
      );
    } else if (order.action === "Mark as Delivered") {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id
            ? { ...o, status: "Delivered", action: "View Details" }
            : o
        )
      );
    } else if (order.action === "View Details") {
      setSelectedOrder(order);
    }
  };

  // 🔹 Filter orders by active tab
  const filteredOrders = orders.filter((order) => {
    if (activeTab === "new") return order.status === "Pending";
    if (activeTab === "delivery") return order.status === "Confirmed";
    if (activeTab === "completed") return order.status === "Delivered";
    return true;
  });

  // 🔹 Count for each tab
  const getTabCount = (tab) => {
    if (tab === "new")
      return orders.filter((o) => o.status === "Pending").length;
    if (tab === "delivery")
      return orders.filter((o) => o.status === "Confirmed").length;
    if (tab === "completed")
      return orders.filter((o) => o.status === "Delivered").length;
    return 0;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ Keep Original Header */}
      <Header
        avatarUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuDeL7radWSj-FEteEjqLpufXII3-tc_o7GMvLvB07AaD_bYBkfAcIOnNbOXkTdMOHRgJQwLZE-Z_iw72Bd8bpHzfXP_m0pIvteSw7FKZ1qV9GD1KfgyDVG90bCO7OGe6JyYIkm9DBo2ArC60uEqSfDvnnYWeo6IqVEjWxsVX6dUoxjm9ozyVlriiMdVLc_jU9ZxS01QcxNa8hn-ePNbB6IcXSwExf2U61R-epab8nsOkbq95E7z6b-fH4zOt0j2MPt20nrqtPM1NHI"
        userName="Daniel Mutuku"
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Management
          </h1>
          <p className="text-gray-600">
            Manage your incoming and ongoing orders, Mama Mboga.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-8 border-b border-gray-200 mb-6">
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
                  d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                />
              </svg>
              <span>In Delivery</span>
            </div>
            {activeTab === "delivery" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"></div>
            )}
          </button>

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
            </div>
            {activeTab === "completed" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"></div>
            )}
          </button>
        </div>

        {/* Orders Table */}
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
                        order.payment
                      )}`}
                    >
                      {order.payment}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleAction(order)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${getActionButton(
                        order.action
                      )}`}
                    >
                      {order.action}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

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
                      selectedOrder.payment
                    )}`}
                  >
                    {selectedOrder.payment}
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
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer /> {/* Footer integration */}
    </div>
  );
}