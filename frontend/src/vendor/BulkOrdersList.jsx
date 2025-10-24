// frontend/src/vendor/BulkOrdersList.jsx - FINAL VERSION

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetchVendorOrders } from "../api/orders";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

// Helper to format currency
const formatCurrency = (amount) =>
  `Ksh ${Number(amount).toLocaleString("en-KE", { minimumFractionDigits: 0 })}`;

const BulkOrdersList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch orders where THIS vendor is the SELLER (B2C)
  const loadVendorOrders = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      // NOTE: fetchVendorOrders fetches orders where this vendor is the SELLER/PARTNER
      const data = await fetchVendorOrders();
      setOrders(data);
    } catch (err) {
      console.error("Error fetching vendor orders:", err);
      setError("Failed to load your recent customer orders.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadVendorOrders();
  }, [loadVendorOrders]);

  const viewDetails = (id) => {
    alert(`Viewing details for Incoming Customer Order ID: ${id}`);
  };

  const statusStyles = {
    Delivered: "bg-green-50 text-green-700",
    "In Transit": "bg-blue-50 text-blue-700",
    Processing: "bg-yellow-50 text-yellow-700",
    Cancelled: "bg-red-50 text-red-700",
    Default: "bg-gray-100 text-gray-700",
  };

  const getTotalItems = (items) =>
    items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Incoming Customer Orders</h2>

      <p className="mb-6 text-base text-gray-600">
        These are orders placed by buyers (B2C). Manage fulfillment in Order
        Management tab.
      </p>

      {loading ? (
        <div className="text-center py-12 text-gray-600">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
          Loading incoming customer orders...
        </div>
      ) : error ? (
        <div className="text-red-600 bg-red-100 p-3 rounded-lg">{error}</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 text-gray-600 bg-white rounded-xl shadow-md">
          No customer orders found.
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((o) => {
            const badgeClass =
              statusStyles[o.orderStatus] || statusStyles.Default;
            const firstItemName = o.items[0]?.name || "Unknown Product";
            const totalUnits = getTotalItems(o.items);
            const totalAmount = o.totalAmount;

            return (
              <div
                key={o._id}
                className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row gap-4 items-start md:items-center"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badgeClass}`}
                    >
                      {o.orderStatus}
                    </span>
                    <div className="text-sm text-gray-500">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold mt-2">
                    Order #{o._id.substring(18).toUpperCase()}
                  </h3>

                  <p className="text-sm text-gray-700 mt-1">
                    **Items:** {firstItemName} and {o.items.length - 1}{" "}
                    other(s). ({totalUnits} total units)
                  </p>

                  <p className="mt-2 font-semibold text-gray-900">
                    Total Value: {formatCurrency(totalAmount)}
                  </p>
                </div>

                <div className="flex-shrink-0 flex flex-col gap-2 justify-start">
                  <button
                    onClick={() => viewDetails(o._id)}
                    className="px-4 py-2 rounded-lg border border-emerald-600 text-emerald-700 font-semibold hover:bg-emerald-50"
                  >
                    View Order Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BulkOrdersList;
