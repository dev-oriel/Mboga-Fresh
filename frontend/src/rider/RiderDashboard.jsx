import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader2 } from "lucide-react";

// Imports from existing components and files
import StatsCard from "../components/riderComponents/StatsCard";
import RecentDeliveriesTable from "../components/riderComponents/RecentDeliveriesTable";
import RiderHeader from "../components/riderComponents/RiderHeader";
import { fetchRiderAcceptedTasks } from "../api/orders"; // Used for Active Deliveries count

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const formatCurrency = (amount) =>
  `Ksh ${Number(amount).toLocaleString("en-KE", { minimumFractionDigits: 0 })}`;

const RiderDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEarnings: 0,
    activeDeliveries: 0,
    completedDeliveries: 0,
    recentDeliveries: [],
    loading: true,
    error: null,
  });

  // 1. Fetch Dashboard Metrics
  const fetchDashboardData = useCallback(async () => {
    try {
      // Fetch Earnings and History (New Endpoint)
      const earningsResponse = await axios.get(
        `${API_BASE}/api/orders/rider/stats`,
        {
          withCredentials: true,
        }
      );

      // Fetch Active Tasks (Existing Endpoint)
      const activeTasks = await fetchRiderAcceptedTasks();

      const earningsData = earningsResponse.data;

      setStats((prev) => ({
        ...prev,
        totalEarnings: earningsData.totalEarnings,
        completedDeliveries: earningsData.completedCount,
        recentDeliveries: earningsData.recentDeliveries,
        activeDeliveries: activeTasks.length,
        loading: false,
        error: null,
      }));
    } catch (error) {
      console.error("Failed to fetch rider dashboard data:", error);
      setStats((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to load dashboard data. Check server logs.",
      }));
    }
  }, [navigate]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // We will keep the performance rating as static for now since it requires complex calculations
  const performanceRating = 4.8;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <RiderHeader userAvatarUrl="https://via.placeholder.com/200" />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 xl:px-20 2xl:px-40 py-8">
        <div className="mx-auto max-w-7xl flex-col gap-8">
          <div className="flex flex-col gap-2 mb-4">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
              Karibu, Juma!!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Here's a summary of your activity.
            </p>
          </div>

          {stats.loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-600 mb-2" />
              Fetching live dashboard metrics...
            </div>
          ) : stats.error ? (
            <div className="p-4 bg-red-100 text-red-700 rounded-lg">
              {stats.error}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                <StatsCard
                  label="Active Deliveries"
                  value={stats.activeDeliveries.toString()}
                  onClick={() => navigate("/riderdeliveryqueue")}
                  clickable={true}
                />
                <StatsCard
                  label="Total Earnings"
                  value={formatCurrency(stats.totalEarnings)}
                />
                <StatsCard
                  label="Completed Deliveries"
                  value={stats.completedDeliveries.toString()}
                />
                <StatsCard
                  label="Performance Rating"
                  value={
                    <span className="flex items-center gap-2">
                      <span className="text-3xl font-bold">
                        {performanceRating.toFixed(1)}
                      </span>
                      <svg
                        className="w-6 h-6 text-yellow-400"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 .587l3.668 7.431L24 9.753l-6 5.853L19.335 24 12 19.897 4.665 24 6 15.606 0 9.753l8.332-1.735z" />
                      </svg>
                    </span>
                  }
                />
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Recent Deliveries
                  </h2>
                  <button
                    onClick={() => navigate("/riderdeliveryqueue")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    View All Orders
                  </button>
                </div>
                <RecentDeliveriesTable deliveries={stats.recentDeliveries} />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default RiderDashboard;
