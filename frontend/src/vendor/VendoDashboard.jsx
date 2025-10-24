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
} from "lucide-react";
import Header from "../components/vendorComponents/Header";
import { useVendorData } from "../context/VendorDataContext";
import { useAuth } from "../context/AuthContext";
import { fetchVendorNotifications } from "../api/orders";

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
    updateDashboardData,
    markNotificationAsRead,
    deleteReadNotifications,
  } = useVendorData();

  const { user, loadingAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Load notifications from API
  const loadNotifications = useCallback(async () => {
    if (!user || loadingAuth) return;
    try {
      const data = await fetchVendorNotifications();
      setNotifications(data);
    } catch (err) {
      console.error("Failed to fetch live notifications:", err);
      setError("Failed to load notifications.");
    }
  }, [user, loadingAuth, setNotifications]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Load dummy dashboard metrics (A proper implementation would have a dedicated API call here)
  useEffect(() => {
    if (user && !loadingAuth && dashboardData.ordersReceived === 0) {
      // Simulate data update just once, when the context is still at initial zero state
      updateDashboardData({
        ordersReceived: 28,
        pendingDeliveries: 5,
        salesInEscrow: 14500,
        earningsReleased: 7200,
      });
    }
  }, [user, loadingAuth, dashboardData.ordersReceived, updateDashboardData]);

  // HANDLERS (Defined directly for use in JSX, resolving Linter warnings)

  const handleAddProduct = useCallback(
    () => navigate("/vendorproducts"),
    [navigate]
  );
  const handleViewOrders = useCallback(
    () => navigate("/ordermanagement"),
    [navigate]
  );

  const handleWithdrawFunds = useCallback(() => {
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
  }, [dashboardData.earningsReleased, handleWithdraw]);

  // Delete read notifications
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
        unreadCount={unreadCount}
      />

      <main className="p-6">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <span className="text-red-600 mr-2">⚠️</span>
            <span className="text-red-800">{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Orders Received",
              value: dashboardData.ordersReceived,
              note: "Total orders processed",
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
              className="flex items-center bg-emerald-600 space-x-2 px-4 py-2 rounded-lg text-white font-medium shadow-sm hover:opacity-90 transition transform hover:scale-105"
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
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
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
                const IconComponent = iconComponents[notification.icon];
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
