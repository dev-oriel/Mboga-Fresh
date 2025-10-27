import React, { useState, useEffect, useCallback } from "react";
import RiderHeader from "../components/riderComponents/RiderHeader";
import DeliveryItem from "../components/riderComponents/DeliveryItem";
import {
  fetchAllAvailableTasks,
  acceptRiderTask,
  fetchRiderAcceptedTasks,
} from "../api/orders"; // Updated imports
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const formatCurrency = (amount) =>
  `Ksh ${Number(amount).toLocaleString("en-KE", { minimumFractionDigits: 0 })}`;

const RiderDeliveryQueue = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [availableTasks, setAvailableTasks] = useState([]);
  const [acceptedTasks, setAcceptedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("available"); // 'available' or 'accepted'

  const loadTasks = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const [availableData, acceptedData] = await Promise.all([
        fetchAllAvailableTasks(),
        fetchRiderAcceptedTasks(),
      ]);
      setAvailableTasks(availableData);
      setAcceptedTasks(acceptedData);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to load delivery tasks.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadTasks();
    // Optional: setup interval to refresh available tasks
    const interval = setInterval(loadTasks, 60000);
    return () => clearInterval(interval);
  }, [loadTasks]);

  // Handler for accepting a task
  const handleAcceptTask = async (taskId) => {
    if (!window.confirm("Confirm acceptance of this delivery task?")) return;

    setLoading(true);
    try {
      await acceptRiderTask(taskId);
      alert("Task accepted! Proceed to Vendor Pickup.");
      await loadTasks(); // Refresh list to update states
      setActiveTab("accepted"); // Switch view to My Tasks
    } catch (err) {
      console.error("Error accepting task:", err);
      setError(err.message || "Failed to accept task. It might be taken.");
    } finally {
      setLoading(false);
    }
  };

  // Handler to view/start the confirmation process (for accepted tasks)
  const handleViewConfirmation = (orderId) => {
    navigate(`/riderdelivery/${orderId}`);
  };

  // Determine which list to display
  const currentTasks =
    activeTab === "available" ? availableTasks : acceptedTasks;
  const isAvailableTab = activeTab === "available";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="flex flex-col min-h-screen">
        <RiderHeader />

        <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white text-center">
              Delivery Queue
            </h1>

            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {/* Tab Selector */}
            <div className="flex space-x-6 border-b pb-2">
              <button
                onClick={() => setActiveTab("available")}
                className={`text-lg font-semibold px-2 pb-2 transition-colors ${
                  isAvailableTab
                    ? "text-emerald-600 border-b-2 border-emerald-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Open Tasks ({availableTasks.length})
              </button>
              <button
                onClick={() => setActiveTab("accepted")}
                className={`text-lg font-semibold px-2 pb-2 transition-colors ${
                  !isAvailableTab
                    ? "text-emerald-600 border-b-2 border-emerald-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                My Active Tasks ({acceptedTasks.length})
              </button>
            </div>

            {/* Task List Container */}
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              {loading ? (
                <div className="text-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-600 mb-2" />
                  Checking tasks...
                </div>
              ) : currentTasks.length === 0 ? (
                <div className="text-center py-12 text-gray-600">
                  {isAvailableTab
                    ? "No open tasks right now."
                    : "You have no active deliveries."}
                </div>
              ) : (
                <ul
                  className="divide-y divide-gray-200 dark:divide-gray-700"
                  role="list"
                >
                  {currentTasks.map((task) => (
                    <DeliveryItem
                      key={task.id}
                      id={task.orderId}
                      pickup={task.pickupAddress}
                      dropoff={task.deliveryAddress}
                      earnings={formatCurrency(task.deliveryFee)}
                      vendor={task.vendorName}
                      status={task.status}
                      onAccept={() => handleAcceptTask(task.id)}
                      isTaskAvailable={isAvailableTab}
                      onScan={() => handleViewConfirmation(task.orderId)} // FIX: Route to detail page
                    />
                  ))}
                </ul>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RiderDeliveryQueue;
