import React, { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";

// Define the assumed API calls for notifications
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const markNotificationAsReadRequest = async (notificationId) => {
  const url = `${API_BASE}/api/notifications/${notificationId}/read`;
  // Assuming a simple PATCH endpoint exists under /api/notifications (you'll need to add this route/controller)
  const res = await axios.patch(url, {}, { withCredentials: true });
  return res.data;
};

const deleteReadNotificationsRequest = async () => {
  const url = `${API_BASE}/api/notifications/read`;
  const res = await axios.delete(url, { withCredentials: true });
  return res.data;
};

const VendorDataContext = createContext();

export const useVendorData = () => {
  const context = useContext(VendorDataContext);
  if (!context) {
    throw new Error("useVendorData must be used within a VendorDataProvider");
  }
  return context;
};

export const VendorDataProvider = ({ children }) => {
  // Shared dashboard data - Initialized to 0/empty, ready for API fetch
  const [dashboardData, setDashboardData] = useState({
    ordersReceived: 0,
    pendingAcceptance: 0, // FIX: Added missing property
    pendingDeliveries: 0,
    salesInEscrow: 0,
    earningsReleased: 0,
  });

  // Shared notifications - Initialized as empty array, ready for API fetch
  const [notifications, setNotifications] = useState([]);

  // Shared transaction history - Initialized as empty array, ready for API fetch
  const [transactions, setTransactions] = useState([]);

  // Calculate balances from transactions and dashboard data
  const calculateBalances = useCallback(() => {
    // NOTE: This logic assumes 'transactions' and 'dashboardData' are eventually populated by API fetches.
    const totalEarnings = transactions
      .filter(
        (t) =>
          t.amount > 0 && (t.status === "Released" || t.status === "Processed")
      )
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      escrow: dashboardData.salesInEscrow,
      available: dashboardData.earningsReleased,
      earnings: totalEarnings,
    };
  }, [transactions, dashboardData]);

  // Update dashboard data
  const updateDashboardData = useCallback((updates) => {
    setDashboardData((prev) => ({ ...prev, ...updates }));
  }, []);

  // Handle withdrawal
  const handleWithdraw = useCallback(
    (amount, mpesaNumber) => {
      // Dummy withdrawal logic remains the same for now
      if (amount <= 0 || amount > dashboardData.earningsReleased) return false;

      setDashboardData((prev) => ({
        ...prev,
        earningsReleased: prev.earningsReleased - amount,
      }));

      const newTransaction = {
        date: new Date().toISOString().split("T")[0],
        id: `WTH-${Date.now()}`,
        desc: `Withdrawal to M-Pesa ${mpesaNumber}`,
        amount: -amount,
        status: "Completed",
      };

      setTransactions((prev) => [newTransaction, ...prev]);

      const newNotification = {
        id: Date.now(),
        type: "payment",
        title: "Withdrawal Initiated",
        message: `Ksh ${amount.toLocaleString()} is being processed. Funds should reflect in your account within 24 hours.`,
        icon: "Clock",
        isRead: false,
      };

      setNotifications((prev) => [newNotification, ...prev]);

      return true;
    },
    [dashboardData.earningsReleased]
  );

  // FIX: Mark notification as read (with DB update)
  const markNotificationAsRead = useCallback(async (id) => {
    try {
      await markNotificationAsReadRequest(id); // API Call
      setNotifications((prev) =>
        prev.map((n) =>
          String(n.id) === String(id) ? { ...n, isRead: true } : n
        )
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      // Optionally show a local failure message
    }
  }, []);

  // FIX: Delete read notifications (with DB update)
  const deleteReadNotifications = useCallback(async () => {
    try {
      await deleteReadNotificationsRequest(); // API Call
      setNotifications((prev) => prev.filter((n) => !n.isRead));
    } catch (error) {
      console.error("Failed to delete read notifications:", error);
      // Optionally show a local failure message
    }
  }, []);

  const value = {
    dashboardData,
    notifications,
    transactions,
    balances: calculateBalances(),
    updateDashboardData,
    handleWithdraw,
    markNotificationAsRead,
    deleteReadNotifications,
    setNotifications,
  };

  return (
    <VendorDataContext.Provider value={value}>
      {children}
    </VendorDataContext.Provider>
  );
};

export default VendorDataProvider;
