// contexts/VendorDataContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';

const VendorDataContext = createContext();

export const useVendorData = () => {
  const context = useContext(VendorDataContext);
  if (!context) {
    throw new Error('useVendorData must be used within a VendorDataProvider');
  }
  return context;
};

export const VendorDataProvider = ({ children }) => {
  // Shared dashboard data
  const [dashboardData, setDashboardData] = useState({
    ordersReceived: 28,
    pendingDeliveries: 5,
    salesInEscrow: 14500,
    earningsReleased: 7200,
  });

  // Shared notifications
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "order",
      title: "New Order Received!",
      message: "Order #5678 is ready for processing. Check Order Management.",
      icon: "Package",
      isRead: false,
    },
    {
      id: 2,
      type: "payment",
      title: "Funds Released",
      message: "Ksh 3,500 has been released to your available balance.",
      icon: "DollarSign",
      isRead: false,
    },
    {
      id: 3,
      type: "warning",
      title: "Low Stock Alert",
      message: "Potatoes are critically low. Update your inventory now.",
      icon: "AlertTriangle",
      isRead: true,
    },
    {
      id: 4,
      type: "order",
      title: "Order Delivered",
      message: "Order #5674 was successfully delivered and confirmed by the buyer.",
      icon: "CheckCircle",
      isRead: true,
    },
  ]);

  // Shared transaction history
  const [transactions, setTransactions] = useState([
    {
      date: "2024-07-26",
      id: "ORD-20240726-001",
      desc: "Sale of Sukuma Wiki",
      amount: 5000,
      status: "Released",
    },
    {
      date: "2024-07-25",
      id: "ORD-20240725-002",
      desc: "Sale of Tomatoes",
      amount: 3750,
      status: "Released",
    },
    {
      date: "2024-07-24",
      id: "ORD-20240724-003",
      desc: "Sale of Cabbages",
      amount: 7500,
      status: "Released",
    },
    {
      date: "2024-07-23",
      id: "WTH-20240723-001",
      desc: "Withdrawal to M-Pesa",
      amount: -2500,
      status: "Completed",
    },
    {
      date: "2024-07-22",
      id: "DEP-20240722-001",
      desc: "Float Deposit",
      amount: 2500,
      status: "Processed",
    },
  ]);

  // Calculate balances from transactions and dashboard data
  const calculateBalances = useCallback(() => {
    const totalEarnings = transactions
      .filter(t => t.amount > 0 && (t.status === 'Released' || t.status === 'Processed'))
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      escrow: dashboardData.salesInEscrow,
      available: dashboardData.earningsReleased,
      earnings: totalEarnings,
    };
  }, [transactions, dashboardData]);

  // Update dashboard data
  const updateDashboardData = useCallback((updates) => {
    setDashboardData(prev => ({ ...prev, ...updates }));
  }, []);

  // Handle withdrawal
  const handleWithdraw = useCallback((amount, mpesaNumber) => {
    if (amount <= 0 || amount > dashboardData.earningsReleased) return false;

    // Update dashboard data
    setDashboardData(prev => ({
      ...prev,
      earningsReleased: prev.earningsReleased - amount
    }));

    // Add withdrawal transaction
    const newTransaction = {
      date: new Date().toISOString().split('T')[0],
      id: `WTH-${Date.now()}`,
      desc: `Withdrawal to M-Pesa ${mpesaNumber}`,
      amount: -amount,
      status: "Completed",
    };

    setTransactions(prev => [newTransaction, ...prev]);

    // Add notification
    const newNotification = {
      id: Date.now(),
      type: "payment",
      title: "Withdrawal Initiated",
      message: `Ksh ${amount.toLocaleString()} is being processed. Funds should reflect in your account within 24 hours.`,
      icon: "Clock",
      isRead: false,
    };

    setNotifications(prev => [newNotification, ...prev]);

    return true;
  }, [dashboardData.earningsReleased]);

  // Mark notification as read
  const markNotificationAsRead = useCallback((id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  }, []);

  // Delete read notifications
  const deleteReadNotifications = useCallback(() => {
    setNotifications(prev => prev.filter(n => !n.isRead));
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