import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  DollarSign,
  Package,
  AlertTriangle,
  X,
  Clock,
  Plus,
  ClipboardList,
  Trash2,
  Loader2,
} from "lucide-react";
import Header from "../components/vendorComponents/Header";
import { useVendorData } from "../context/VendorDataContext";
import { useAuth } from "../context/AuthContext";
import { fetchVendorNotifications, fetchVendorOrders } from "../api/orders"; // fetchVendorOrders added
import axios from "axios";

// Icon mapping
const iconComponents = {
  Package: Package,
  DollarSign: DollarSign,
  AlertTriangle: AlertTriangle,
  CheckCircle: CheckCircle,
  Clock: Clock,
};

const VendorDashboard = () => {
  const {
    dashboardData,
    notifications,
    handleWithdraw,
    setNotifications,
    updateDashboardData, // <-- Needed to update live stats
    markNotificationAsRead,
    deleteReadNotifications,
  } = useVendorData();

  const { user, loadingAuth } = useAuth();
  const [loading, setLoading] = useState(true); // Set to true to control initial data fetch
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Helper to fetch and map metrics
  const loadDashboardMetrics = useCallback(async () => {
    if (!user || loadingAuth) return;

    setLoading(true);
    setError(null);
    try {
      const [ordersData, notifsData] = await Promise.all([
        fetchVendorOrders(), // Fetch all orders for this vendor
        fetchVendorNotifications(), // Fetch notifications
      ]);

      // 1. Update Notifications
      setNotifications(notifsData);

      // 2. Calculate Order Metrics from ordersData
      const totalOrders = ordersData.length;
      const pendingOrders = ordersData.filter(
        (o) => o.orderStatus === "Processing" || o.orderStatus === "QR Scanning"
      ).length;

      // Mocking Escrow logic as we don't have a specific endpoint yet
      const totalSalesValue = ordersData.reduce(
        (sum, o) => sum + o.totalAmount,
        0
      );

      updateDashboardData({
        ordersReceived: totalOrders,
        pendingDeliveries: pendingOrders,
        salesInEscrow: totalSalesValue * 0.7, // Mock: 70% in escrow
        earningsReleased: totalSalesValue * 0.3, // Mock: 30% released
      });
    } catch (err) {
      console.error("Failed to load dashboard metrics:", err);
      setError("Failed to load dashboard data. Please check API status.");
    } finally {
      setLoading(false);
    }
  }, [user, loadingAuth, setNotifications, updateDashboardData]);

  useEffect(() => {
    // Initial data load when user context is ready
    if (user && !loadingAuth) {
      loadDashboardMetrics();
    }
  }, [user, loadingAuth, loadDashboardMetrics]);

  // Quick Actions
  const handleAddProduct = () => navigate("/vendorproducts");
  const handleViewOrders = () => navigate("/ordermanagement");

  // Withdraw funds (unchanged)
  const handleWithdrawFunds = () => {
    const amount = dashboardData.earningsReleased;
    if (amount <= 0) return;
    const confirmed = window.confirm(
      `CONFIRM WITHDRAWAL: Do you want to withdraw Ksh ${amount.toLocaleString()}? This is a simulation.`
    );
    if (!confirmed) return;
    const success = handleWithdraw(amount, "254712345678");
    if (success) {
      console.log(
        `Simulating successful withdrawal of Ksh ${amount.toLocaleString()}`
      );
    }
  };

  // Delete read notifications (unchanged)
  const handleDeleteReadNotifications = () => {
    const readCount = notifications.filter((n) => n.isRead).length;
    if (readCount === 0) return;
    const confirmed = window.confirm(
      `Are you sure you want to delete ${readCount} read notification(s)?`
    );
    if (!confirmed) return;
    deleteReadNotifications();
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        avatarUrl={user?.avatar}
        userName={user?.name || "Vendor"}
        unreadCount={unreadCount} // <-- PASS COUNT TO HEADER
      />

      <main className="p-6">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <span className="text-red-600 mr-2">⚠️</span>
            <span className="text-red-800">{error}</span>
          </div>
        )}

        {loading && (
          <div className="mb-6 flex justify-center text-gray-600">
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Loading dashboard data...
          </div>
        )}

        {/* Stats Cards (Now using dynamic dashboardData) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Orders Received",
              value: dashboardData.ordersReceived.toLocaleString(),
              note: "Total orders processed",
            },
            {
              title: "Pending Deliveries",
              value: dashboardData.pendingDeliveries.toLocaleString(),
              note: "Awaiting Rider/Confirmation",
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

        {/* Quick Actions (unchanged) */}
        {/* ... */}

        {/* Notifications */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Recent Notifications
            </h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleDeleteReadNotifications}
                className="flex items-center space-x-1 text-sm font-medium text-red-500 hover:text-red-700 disabled:text-gray-400 disabled:cursor-not-allowed transition"
                disabled={notifications.filter((n) => n.isRead).length === 0}
                title="Delete all read notifications"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Read</span>
              </button>
              <span className="text-sm text-gray-500">
                {unreadCount} unread
              </span>
            </div>
          </div>
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="text-gray-500 p-6 bg-white rounded-lg text-center border">
                All caught up! No notifications to display.
              </div>
            ) : (
              notifications.map((notification) => {
                const IconComponent =
                  iconComponents[notification.icon || "Package"];
                return (
                  <div
                    key={notification.id}
                    className={`bg-white rounded-lg p-4 shadow-sm border border-gray-200 flex items-start space-x-4 transition ${
                      notification.isRead
                        ? "opacity-70 border-l-4 border-l-gray-300"
                        : "border-l-4 border-l-green-600 hover:shadow-lg"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0 ${
                        notification.isRead
                          ? "bg-gray-100 text-gray-500"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h3
                          className={`font-semibold ${
                            notification.isRead
                              ? "text-gray-600"
                              : "text-gray-900"
                          }`}
                        >
                          {notification.title}
                        </h3>
                      </div>
                      <p
                        className={`text-sm mt-1 ${
                          notification.isRead
                            ? "text-gray-500"
                            : "text-gray-600"
                        }`}
                      >
                        {notification.message}
                      </p>
                    </div>

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
                      <X
                        className="w-4 h-4 text-gray-400 ml-4 flex-shrink-0"
                        title="Dismissed"
                      />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default VendorDashboard;
