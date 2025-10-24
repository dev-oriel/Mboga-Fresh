import React, { createContext, useContext, useState, useCallback } from "react";

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
      if (amount <= 0 || amount > dashboardData.earningsReleased) return false;

      // Logic for updating local state and pushing a notification/transaction when a simulated withdrawal occurs
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

  // Mark notification as read
  const markNotificationAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }, []);

  // Delete read notifications
  const deleteReadNotifications = useCallback(() => {
    setNotifications((prev) => prev.filter((n) => !n.isRead));
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
