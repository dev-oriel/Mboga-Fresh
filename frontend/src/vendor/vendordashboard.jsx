import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/vendorComponents/Header";

// --- DUMMY DATA FOR DEMONSTRATION ---
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
    title: "New Order Received! 📦",
    message: "Order #5678 is ready for processing. Check Order Management.",
    icon: "🛒",
    isRead: false,
  },
  {
    id: 2,
    type: "payment",
    title: "Funds Released ✅",
    message: "Ksh 3,500 has been released to your available balance.",
    icon: "💰",
    isRead: false,
  },
  {
    id: 3,
    type: "warning",
    title: "Low Stock Alert",
    message: "Potatoes are critically low. Update your inventory now.",
    icon: "⚠️",
    isRead: true,
  },
  {
    id: 4,
    type: "order",
    title: "Order Delivered",
    message: "Order #5674 was successfully delivered and confirmed by the buyer.",
    icon: "🚚",
    isRead: true,
  },
];
// ------------------------------------

const VendorDashboard = () => {
  // Use DUMMY DATA directly for initial state
  const [dashboardData, setDashboardData] = useState(DUMMY_DASHBOARD_DATA);
  const [notifications, setNotifications] = useState(DUMMY_NOTIFICATIONS);

  // States related to fetching are no longer needed, keeping for potential future re-use
  // const [activeTab, setActiveTab] = useState("Dashboard");
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);
  // const [lastUpdated, setLastUpdated] = useState(new Date());

  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check authentication (This remains the same)
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

  // Logout (This remains the same, but the fetch call is simulated/simplified)
  const handleLogout = () => {
    // Simulate API call success
    console.log("Simulating logout...");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // The functions below replace the API-fetching logic:
  
  // Quick actions
  const handleAddProduct = () => navigate("/vendorproducts"); 
  const handleViewOrders = () => navigate("/ordermanagement");

  const handleWithdrawFunds = () => {
    const amount = dashboardData.earningsReleased;
    if (amount <= 0) return alert("No funds available for withdrawal.");

    const confirmed = window.confirm(
      `Withdraw Ksh ${amount.toLocaleString()}? This is a simulation.`
    );
    if (!confirmed) return;

    alert(`Simulating withdrawal request for Ksh ${amount.toLocaleString()}`);
    
    // Immediately update the UI for a better user experience simulation
    setDashboardData((prev) => ({ ...prev, earningsReleased: 0 }));
    
    // Optionally, simulate a new notification after withdrawal
    setNotifications((prev) => [
      {
        id: Date.now(),
        type: "payment",
        title: "Withdrawal Requested",
        message: `Ksh ${amount.toLocaleString()} has been sent for processing.`,
        icon: "⏳",
        isRead: false,
      },
      ...prev,
    ]);
  };

  const markNotificationAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const getNotificationBgColor = (type, isRead) => {
    if (isRead) return "#f3f4f6";
    switch (type) {
      case "order":
      case "payment":
        return "#42cf17";
      case "warning":
        return "#fbbf24";
      default:
        return "#42cf17";
    }
  };

  // Since we are using dummy data, we set loading to false and error to null permanently.
  const loading = false;
  const error = null;
  const lastUpdated = new Date();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header
        avatarUrl={user ? user.avatarUrl : "default_avatar.jpg"} // Use actual user data
        userName={user ? user.name : "Demo Vendor"}
        onLogout={handleLogout} // Pass the simplified logout handler
      />

      {/* Main */}
      <main className="p-6">
        {/* Error/Loading Banners are now mostly suppressed */}
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
        
        {/* Last Updated Info */}
        {!loading && (
            <div className="text-right text-sm text-gray-500 mb-4">
                Last UI action: {lastUpdated.toLocaleTimeString()}
            </div>
        )}

        {/* Stats */}
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
              <span className="text-lg">+</span>
              <span>Add New Product</span>
            </button>
            <button
              onClick={handleViewOrders}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition transform hover:scale-105"
            >
              <span className="text-lg">📋</span>
              <span>View Orders</span>
            </button>
            <button
              onClick={handleWithdrawFunds}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition transform hover:scale-105"
            >
              <span className="text-lg">💰</span>
              <span>Withdraw Funds</span>
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Notifications
            </h2>
            <span className="text-sm text-gray-500">
              {notifications.filter((n) => !n.isRead).length} unread
            </span>
          </div>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => markNotificationAsRead(notification.id)}
                className={`bg-white rounded-lg p-4 shadow-sm border border-gray-200 flex items-start space-x-4 cursor-pointer hover:shadow-md transition ${
                  notification.isRead ? "opacity-60" : ""
                }`}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: getNotificationBgColor(
                      notification.type,
                      notification.isRead
                    ),
                    opacity: notification.isRead ? 0.5 : 0.2,
                  }}
                >
                  <span
                    style={{
                      color: notification.isRead
                        ? "#6b7280"
                        : getNotificationBgColor(notification.type, false),
                    }}
                  >
                    {notification.icon}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3
                      className={`font-semibold ${
                        notification.isRead ? "text-gray-600" : "text-gray-900"
                      }`}
                    >
                      {notification.title}
                    </h3>
                    {!notification.isRead && (
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: "#42cf17" }}
                      ></div>
                    )}
                  </div>
                  <p
                    className={`text-sm ${
                      notification.isRead ? "text-gray-500" : "text-gray-600"
                    }`}
                  >
                    {notification.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default VendorDashboard;