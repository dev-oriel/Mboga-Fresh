// frontend/src/admin/AdminDashboard.jsx - FINAL DYNAMIC USER STATS VERSION

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  CheckCircle,
  DollarSign,
  Users,
  Loader2, // <-- FIX 1: Imported Loader2
  AlertTriangle,
} from "lucide-react";
import Header from "../components/adminComponents/AdminHeader";
import Sidebar from "../components/adminComponents/AdminSidebar";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: "...",
    percentageChange: 0,
    totalTransactions: "...",
    escrowBalance: "...",
    currentDisputes: "...",
    roleCounts: [], // For breakdown
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Retained for error display logic

  // 1. Fetch User Statistics
  const fetchUserStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch User Stats
      const userResponse = await axios.get(`${API_BASE}/api/admin/stats`, {
        withCredentials: true,
      });

      setStats((prev) => ({
        ...prev,
        totalUsers: userResponse.data.totalUsers.toLocaleString(),
        percentageChange: userResponse.data.percentageChange,
        roleCounts: userResponse.data.roleCounts,
      }));
    } catch (err) {
      console.error("Failed to fetch user stats:", err);
      setError("Failed to load user statistics. Check server connection.");
    }
    // Note: fetchFinancialData moved inside useEffect for sequential calls
  }, []);

  // 2. Fetch Mock/Placeholder Financial Data (for the other cards)
  const fetchFinancialData = () => {
    setStats((prev) => ({
      ...prev,
      totalTransactions: "6,789",
      escrowBalance: "Ksh 31,850.00",
      currentDisputes: "15",
    }));
  };

  useEffect(() => {
    const loadAllData = async () => {
      await fetchUserStats();
      fetchFinancialData();
      setLoading(false); // Only set false after all fetches are complete
    };
    loadAllData();
  }, [fetchUserStats]);

  const userGrowthColor =
    stats.percentageChange >= 0 ? "text-green-600" : "text-red-600";
  const userGrowthSymbol = stats.percentageChange >= 0 ? "↑" : "↓";
  const userGrowthText = `${userGrowthSymbol}${Math.abs(
    stats.percentageChange
  ).toFixed(1)}% this month`;

  let chartData = [
    { role: "Buyers", percent: 0, count: 0 },
    { role: "Vendors", percent: 0, count: 0 },
    { role: "Farmers", percent: 0, count: 0 },
    { role: "Riders", percent: 0, count: 0 },
  ];

  // Process API data for chart display
  if (stats.roleCounts.length > 0) {
    const total = stats.roleCounts.reduce((sum, r) => sum + r.count, 0) || 1;
    chartData.length = 0;
    stats.roleCounts.forEach((roleData) => {
      chartData.push({
        role:
          roleData.role.charAt(0).toUpperCase() + roleData.role.slice(1) + "s",
        percent: parseFloat(((roleData.count / total) * 100).toFixed(1)),
        count: roleData.count,
      });
    });
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />

        <main className="p-6 space-y-6">
          <h1 className="text-3xl font-bold text-stone-900">Admin Dashboard</h1>

          {/* Error Banner */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 flex items-center gap-3 rounded-lg shadow-sm">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8 text-emerald-600">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
              Loading metrics and financial data...
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* CARD 1: Total Users (Dynamic) */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-gray-600 text-sm font-medium">
                    Total Users
                  </p>
                  <h2 className="text-3xl font-bold text-gray-800 mt-1">
                    {stats.totalUsers}
                  </h2>
                  <p
                    className={`text-xs font-semibold mt-1 ${userGrowthColor}`}
                  >
                    {userGrowthText}
                  </p>
                </div>

                {/* CARD 2: Total Transactions (Mock) */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-gray-600 text-sm font-medium">
                    Total Transactions
                  </p>
                  <h2 className="text-3xl font-bold text-gray-800 mt-1">
                    {stats.totalTransactions}
                  </h2>
                  <p className="text-xs font-semibold mt-1 text-green-600">
                    ↑5% this month
                  </p>
                </div>

                {/* CARD 3: Escrow Balance (Mock) */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-gray-600 text-sm font-medium">
                    Escrow Balance
                  </p>
                  <h2 className="text-3xl font-bold text-gray-800 mt-1">
                    {stats.escrowBalance}
                  </h2>
                  <p className="text-xs font-semibold mt-1 text-green-600">
                    ↑2% this month
                  </p>
                </div>

                {/* CARD 4: Current Disputes (Mock) */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-gray-600 text-sm font-medium">
                    Current Disputes
                  </p>
                  <h2 className="text-3xl font-bold text-gray-800 mt-1">
                    {stats.currentDisputes}
                  </h2>
                  <p className="text-xs font-semibold mt-1 text-red-600">
                    ↓1% this month
                  </p>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-gray-800 mb-3">
                    Daily Deliveries
                  </h3>
                  <div className="h-48 bg-green-50 rounded-lg flex items-center justify-center text-green-500 font-medium">
                    [Chart Placeholder]
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-gray-800 mb-3">
                    Users by Role
                  </h3>
                  <div className="space-y-3">
                    {chartData.map((item, i) => (
                      <div key={item.role}>
                        <div className="flex justify-between text-sm font-medium text-gray-700">
                          <span>{item.role}</span>
                          <span>
                            {item.percent}% ({item.count})
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${item.percent}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
