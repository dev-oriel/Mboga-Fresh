import React, { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";

// --- THIS IS THE FIX ---
// Import from api/orders.js, not api/vendors.js
import { markNotificationAsRead, deleteReadNotifications } from "../api/orders";
// --- END OF FIX ---

const VendorDataContext = createContext();

export const useVendorData = () => {
  const context = useContext(VendorDataContext);
  if (!context) {
    throw new Error("useVendorData must be used within a VendorDataProvider");
  }
  return context;
};

export const VendorDataProvider = ({ children }) => {
  const [dashboardData, setDashboardData] = useState({
    ordersReceived: 0,
    pendingAcceptance: 0,
    pendingDeliveries: 0,
    salesInEscrow: 0,
    earningsReleased: 0,
  });
  const [notifications, setNotifications] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const calculateBalances = useCallback(() => {
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

  const updateDashboardData = useCallback((updates) => {
    setDashboardData((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleWithdraw = useCallback(
    (amount, mpesaNumber) => {
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
  const markNotificationAsReadCallback = useCallback(async (id) => {
    try {
      // --- FIX: Call the correct imported function ---
      await markNotificationAsRead(id); // API Call
      setNotifications((prev) =>
        prev.map((n) =>
          String(n._id) === String(id) ? { ...n, isRead: true } : n
        )
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  }, []); // Dependency array is intentionally empty

  // FIX: Delete read notifications (with DB update)
  const deleteReadNotificationsCallback = useCallback(async () => {
    try {
      // --- FIX: Call the correct imported function ---
      await deleteReadNotifications(); // API Call
      setNotifications((prev) => prev.filter((n) => !n.isRead));
    } catch (error) {
      console.error("Failed to delete read notifications:", error);
    }
  }, []); // Dependency array is intentionally empty

  const value = {
    dashboardData,
    notifications,
    transactions,
    balances: calculateBalances(),
    updateDashboardData,
    handleWithdraw,
    // --- FIX: Expose the correctly named functions ---
    markNotificationAsRead: markNotificationAsReadCallback,
    deleteReadNotifications: deleteReadNotificationsCallback,
    setNotifications,
  };

  return (
    <VendorDataContext.Provider value={value}>
      {children}
    </VendorDataContext.Provider>
  );
};

export default VendorDataProvider;
