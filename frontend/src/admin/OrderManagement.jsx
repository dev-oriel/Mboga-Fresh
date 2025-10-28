import React, { useState, useEffect, useCallback } from "react";
import AdminHeader from "../components/adminComponents/AdminHeader";
import AdminSidebar from "../components/adminComponents/AdminSidebar";
import { Loader2, Search, Zap, Package, User } from "lucide-react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const formatCurrency = (amount) =>
  `Ksh ${Number(amount).toLocaleString("en-KE", { minimumFractionDigits: 0 })}`;

const getStatusBadge = (status) => {
  const styles = {
    "New Order": "bg-yellow-100 text-yellow-700 border-yellow-300",
    "QR Scanning": "bg-amber-100 text-amber-700 border-amber-300",
    "In Delivery": "bg-blue-100 text-blue-700 border-blue-300",
    Delivered: "bg-emerald-100 text-emerald-700 border-emerald-300",
    Processing: "bg-gray-100 text-gray-700 border-gray-300",
    Cancelled: "bg-red-100 text-red-700 border-red-300",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold border ${
        styles[status] || styles["Processing"]
      }`}
    >
      {status}
    </span>
  );
};

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch ALL orders via the new Admin API endpoint
      const response = await axios.get(`${API_BASE}/api/admin/orders`, {
        withCredentials: true,
      });
      setOrders(response.data);
    } catch (err) {
      console.error("Admin Order Fetch Failed:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load all orders. Check server/auth."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = orders.filter(
    (order) => filter === "all" || order.orderStatus === filter
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />

        <main className="p-6 space-y-6">
          <h1 className="text-3xl font-bold text-stone-900">
            Platform Order Management
          </h1>

          {/* Filters and Quick Stats */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">
                Filter Status:
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white"
              >
                <option value="all">All Orders ({orders.length})</option>
                <option value="New Order">
                  New Orders (
                  {orders.filter((o) => o.orderStatus === "New Order").length})
                </option>
                <option value="QR Scanning">
                  Awaiting Pickup (
                  {orders.filter((o) => o.orderStatus === "QR Scanning").length}
                  )
                </option>
                <option value="In Delivery">
                  In Delivery (
                  {orders.filter((o) => o.orderStatus === "In Delivery").length}
                  )
                </option>
                <option value="Delivered">
                  Delivered (
                  {orders.filter((o) => o.orderStatus === "Delivered").length})
                </option>
                <option value="Cancelled">
                  Cancelled (
                  {orders.filter((o) => o.orderStatus === "Cancelled").length})
                </option>
              </select>
            </div>
            <div className="text-sm font-medium text-gray-600">
              Displaying: {filteredOrders.length} orders
            </div>
          </div>

          {/* Order Table */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            {error ? (
              <div className="p-8 text-red-600">{error}</div>
            ) : loading ? (
              <div className="text-center py-12">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-600 mb-2" />
                Fetching all orders...
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Buyer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Payment Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Fulfillment Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-emerald-50/50 cursor-pointer"
                    >
                      <td className="px-4 py-3 text-sm font-mono text-gray-900">
                        #{order._id.substring(18).toUpperCase()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <div>
                          <span className="font-medium">
                            {order.user?.name || "N/A"}
                          </span>
                          <div className="text-xs text-gray-400">
                            {order.user?.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {getStatusBadge(
                          order.paymentStatus === "Paid" ? "Paid" : "Processing"
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {getStatusBadge(order.orderStatus)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrderManagement;
