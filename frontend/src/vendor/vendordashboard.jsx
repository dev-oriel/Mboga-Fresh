import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const VendorDashboard = () => {
  // State for dashboard data
  const [dashboardData, setDashboardData] = useState({
    ordersReceived: 0,
    pendingDeliveries: 0,
    salesInEscrow: 0,
    earningsReleased: 0,
  });

  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Get vendor ID from logged-in user or fallback to demo
  const getVendorId = () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      return user.id || user._id;
    }
    return "vendor_123"; // Fallback for demo
  };

  const vendorId = getVendorId();

  // API Base URL
  const API_BASE_URL = "http://localhost:5000/api";

  // Check authentication
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

  // Logout
  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);

      const dashboardResponse = await fetch(
        `${API_BASE_URL}/vendor/${vendorId}/dashboard`
      );
      if (!dashboardResponse.ok)
        throw new Error(`Dashboard API failed (${dashboardResponse.status})`);

      const dashboardData = await dashboardResponse.json();
      setDashboardData(dashboardData);

      const notificationsResponse = await fetch(
        `${API_BASE_URL}/vendor/${vendorId}/notifications`
      );
      if (!notificationsResponse.ok)
        throw new Error(
          `Notifications API failed (${notificationsResponse.status})`
        );

      const notificationsData = await notificationsResponse.json();
      setNotifications(notificationsData);

      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError(`Failed to load dashboard data: ${error.message}`);
      setDashboardData({
        ordersReceived: 0,
        pendingDeliveries: 0,
        salesInEscrow: 0,
        earningsReleased: 0,
      });
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [vendorId]);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  // Manual refresh
  const handleRefresh = () => fetchDashboardData();

  // Quick actions
  const handleAddProduct = () => alert("Add New Product clicked!");
  const handleViewOrders = () => alert("View Orders clicked!");

  const handleWithdrawFunds = async () => {
    const amount = dashboardData.earningsReleased;
    if (amount <= 0) return alert("No funds available for withdrawal.");

    const confirmed = window.confirm(
      `Withdraw Ksh ${amount.toLocaleString()}?`
    );
    if (!confirmed) return;

    alert(`Withdrawal request submitted for Ksh ${amount.toLocaleString()}`);
    setDashboardData((prev) => ({ ...prev, earningsReleased: 0 }));
    fetchDashboardData();
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#42cf17" }}
            >
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="font-bold text-xl text-gray-800">Mboga Fresh</span>
          </div>

          {/* User Info */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user.role}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-600 font-medium text-sm">
                    {user.name ? user.name.charAt(0).toUpperCase() : "V"}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">Demo Mode</p>
                <p className="text-xs text-gray-500">Sample Vendor</p>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6">
          <nav className="flex space-x-8">
            {["Dashboard", "Orders", "Products", "Analytics"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main */}
      <main className="p-6">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <span className="text-red-600 mr-2">⚠️</span>
            <span className="text-red-800">{error}</span>
            <button
              onClick={handleRefresh}
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
