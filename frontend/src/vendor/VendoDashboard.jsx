import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
// Importing Lucide icons
import { CheckCircle, DollarSign, Package, AlertTriangle, X, Clock, Plus, ClipboardList, Trash2 } from "lucide-react";
import Header from "../components/vendorComponents/Header";
import Footer from "../components/vendorComponents/Footer";

// DUMMY DATA
const DUMMY_DASHBOARD_DATA = {
  ordersReceived: 28,
  pendingDeliveries: 5,
  salesInEscrow: 14500, // Ksh
  earningsReleased: 7200, // Ksh
};

const DUMMY_NOTIFICATIONS = [
  {
    id: 1,
    type: "order",
    title: "New Order Received!",
    message: "Order #5678 is ready for processing. Check Order Management.",
    icon: <Package className="w-5 h-5" />,
    isRead: false,
  },
  {
    id: 2,
    type: "payment",
    title: "Funds Released",
    message: "Ksh 3,500 has been released to your available balance.",
    icon: <DollarSign className="w-5 h-5" />,
    isRead: false,
  },
  {
    id: 3,
    type: "warning",
    title: "Low Stock Alert",
    message: "Potatoes are critically low. Update your inventory now.",
    icon: <AlertTriangle className="w-5 h-5" />,
    isRead: true, // Marked as read for the delete feature test
  },
  {
    id: 4,
    type: "order",
    title: "Order Delivered",
    message: "Order #5674 was successfully delivered and confirmed by the buyer.",
    icon: <CheckCircle className="w-5 h-5" />,
    isRead: true, // Marked as read for the delete feature test
  },
];

const VendorDashboard = () => {
  // Use DUMMY DATA directly for initial state
  const [dashboardData, setDashboardData] = useState(DUMMY_DASHBOARD_DATA);
  const [notifications, setNotifications] = useState(DUMMY_NOTIFICATIONS);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Since we are using dummy data, these are static
  const loading = false;
  const error = null;

  // Check authentication (Kept for basic routing security simulation)
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== "vendor") {
        navigate("/login");
        return;
      }
      setUser(parsedUser);
    } else {
      console.log("Running in demo mode - no authenticated user");
    }
  }, [navigate]);

  // Logout (Simplified)
  const handleLogout = () => {
    console.log("Simulating logout...");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // --- QUICK ACTIONS ---
  const handleAddProduct = () => navigate("/vendorproducts");
  const handleViewOrders = () => navigate("/ordermanagement");

  // Functional: Handles the simulated withdrawal of funds
  const handleWithdrawFunds = useCallback(() => {
    const amount = dashboardData.earningsReleased;
    if (amount <= 0) return;

    const confirmed = window.confirm(
      `CONFIRM WITHDRAWAL: Do you want to withdraw Ksh ${amount.toLocaleString()}? This is a simulation.`
    );
    if (!confirmed) return;

    console.log(`Simulating successful withdrawal of Ksh ${amount.toLocaleString()}`);

    // Update the UI: set earnings to 0
    setDashboardData((prev) => ({ ...prev, earningsReleased: 0 }));

    // Add a success notification to the top of the list
    setNotifications((prev) => [
      {
        id: Date.now(),
        type: "payment",
        title: "Withdrawal Initiated",
        message: `Ksh ${amount.toLocaleString()} is being processed. Funds should reflect in your account within 24 hours.`,
        icon: <Clock className="w-5 h-5" />,
        isRead: false,
      },
      ...prev,
    ]);
  }, [dashboardData.earningsReleased, setDashboardData, setNotifications]);

  // --- NOTIFICATION HANDLERS ---

  // Functional: Marks a notification as read
  const markNotificationAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  // Functional: Deletes all notifications that have been marked as read
  const handleDeleteReadNotifications = () => {
    const readCount = notifications.filter(n => n.isRead).length;
    if (readCount === 0) return;

    const confirmed = window.confirm(`Are you sure you want to delete ${readCount} read notification(s)?`);

    if (!confirmed) return;

    // Filter the current list, keeping only notifications where isRead is false
    const unreadNotifications = notifications.filter(n => !n.isRead);

    // Update the state with the filtered list
    setNotifications(unreadNotifications);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header
        avatarUrl={user ? user.avatarUrl : "default_avatar.jpg"}
        userName={user ? user.name : "Demo Vendor"}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="p-6">
        {/* Error/Loading Banners (kept for future API implementation) */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <span className="text-red-600 mr-2">⚠️</span>
            <span className="text-red-800">{error}</span>
            <button
              onClick={() => console.log("Simulating retry...")}
              className="ml-auto text-red-600 hover:text-red-800 underline"
            >
              Retry
            </button>
          </div>
        )}

        {loading && (
          <div className="mb-6 flex justify-center text-gray-600">
            <svg
              className="animate-spin w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Loading dashboard data...
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Orders Received",
              value: dashboardData.ordersReceived,
              note: "+2 from yesterday",
            },
            {
              title: "Pending Deliveries",
              value: dashboardData.pendingDeliveries,
              note: "Need attention",
            },
            {
              title: "Sales in Escrow",
              value: `Ksh ${dashboardData.salesInEscrow.toLocaleString()}`,
              note: "Pending delivery confirmation",
            },
            {
              title: "Earnings Released",
              value: `Ksh ${dashboardData.earningsReleased.toLocaleString()}`,
              note: "Available for withdrawal",
            },
          ].map((card, i) => (
            <div
              key={i}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                {card.title}
              </h3>
              <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              <p className="text-xs text-gray-500 mt-1">{card.note}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleAddProduct}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white font-medium shadow-sm hover:opacity-90 transition transform hover:scale-105"
              style={{ backgroundColor: "#42cf17" }}
            >
              <Plus className="w-5 h-5" />
              <span>Add New Product</span>
            </button>
            <button
              onClick={handleViewOrders}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition transform hover:scale-105"
            >
              <ClipboardList className="w-5 h-5" />
              <span>View Orders</span>
            </button>
            <button
              onClick={handleWithdrawFunds}
              disabled={dashboardData.earningsReleased <= 0}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium shadow-sm transition transform hover:scale-105 ${
                dashboardData.earningsReleased > 0
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              <DollarSign className="w-5 h-5" />
              <span>Withdraw Funds</span>
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Recent Notifications
            </h2>
            <div className="flex items-center space-x-4">
              {/* Delete All Read Notifications Button */}
              <button
                onClick={handleDeleteReadNotifications}
                className="flex items-center space-x-1 text-sm font-medium text-red-500 hover:text-red-700 disabled:text-gray-400 disabled:cursor-not-allowed transition"
                disabled={notifications.filter(n => n.isRead).length === 0}
                title="Delete all read notifications"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Read</span>
              </button>
              <span className="text-sm text-gray-500">
                {notifications.filter((n) => !n.isRead).length} unread
              </span>
            </div>
          </div>
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="text-gray-500 p-6 bg-white rounded-lg text-center border">
                All caught up! No notifications to display.
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-white rounded-lg p-4 shadow-sm border border-gray-200 flex items-start space-x-4 transition ${
                    notification.isRead
                      ? "opacity-70 border-l-4 border-l-gray-300"
                      : "border-l-4 border-l-green-600 hover:shadow-lg"
                  }`}
                >
                  {/* Icon Container */}
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0 ${
                      notification.isRead ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-600'
                    }`}
                  >
                    {notification.icon}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h3
                        className={`font-semibold ${
                          notification.isRead ? "text-gray-600" : "text-gray-900"
                        }`}
                      >
                        {notification.title}
                      </h3>
                    </div>
                    <p
                      className={`text-sm mt-1 ${
                        notification.isRead ? "text-gray-500" : "text-gray-600"
                      }`}
                    >
                      {notification.message}
                    </p>
                  </div>

                  {/* Mark as Read / Read Status */}
                  {!notification.isRead ? (
                    <button
                      onClick={() => markNotificationAsRead(notification.id)}
                      className="text-xs font-semibold text-green-600 hover:text-green-800 ml-4 flex items-center space-x-1 flex-shrink-0"
                      title="Mark as Read"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Mark Read</span>
                    </button>
                  ) : (
                    <X className="w-4 h-4 text-gray-400 ml-4 flex-shrink-0" title="Dismissed" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default VendorDashboard;

