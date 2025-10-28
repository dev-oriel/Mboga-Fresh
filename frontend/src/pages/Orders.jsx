import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/FooterSection.jsx";
import { fetchBuyerOrders } from "../api/orders";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

// --- Helper Functions (Only utility functions remain) ---

const formatCurrency = (amount) =>
  `Ksh ${Number(amount).toLocaleString("en-KE", { minimumFractionDigits: 0 })}`;

const getStatusBadgeProps = (status) => {
  const lowerStatus = status ? status.toLowerCase() : "";
  if (lowerStatus === "delivered")
    return {
      label: "Delivered",
      bg: "bg-emerald-100",
      text: "text-emerald-700",
      icon: "check_circle",
    };
  if (
    lowerStatus === "shipped" ||
    lowerStatus === "in delivery" ||
    lowerStatus === "in transit"
  )
    return {
      label: "In Transit",
      bg: "bg-blue-100",
      text: "text-blue-700",
      icon: "local_shipping",
    };
  if (
    lowerStatus === "processing" ||
    lowerStatus === "confirmed" ||
    lowerStatus === "new order" ||
    lowerStatus === "qr scanning"
  )
    return {
      label: "Processing",
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      icon: "schedule",
    };
  if (lowerStatus === "cancelled")
    return {
      label: "Cancelled",
      bg: "bg-red-100",
      text: "text-red-700",
      icon: "cancel",
    };
  return {
    label: status || "Pending",
    bg: "bg-gray-100",
    text: "text-gray-700",
    icon: "info",
  };
};

// --- Main Component ---

const Orders = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadOrders = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await fetchBuyerOrders();
      setOrders(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders. Please try refreshing.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleViewDetails = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow container mx-auto p-8 text-center">
          <div className="text-lg text-gray-600 mt-16">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-600 mb-3" />
            Loading your order history...
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // FIX: Define a single inline function for image source resolution
  const resolveItemImageSrc = (item) => {
    const imagePath = item.image || item.imagePath || item.img;

    if (imagePath && imagePath.startsWith("http")) {
      return imagePath;
    }
    if (imagePath) {
      // Prepend API_BASE if path is relative
      const normalizedPath = imagePath.startsWith("/")
        ? imagePath
        : `/${imagePath}`;
      return `${API_BASE}${normalizedPath}`;
    }

    // Final fallback: Use a simple, visible icon that clearly shows the image failed to load
    return "https://img.icons8.com/material-outlined/96/CCCCCC/image.png";
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f8f6]">
      <Header />

      <main className="flex-grow">
        {/* Hero Section - Clean Header */}
        <section className="py-12 bg-white shadow-sm border-b border-gray-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              My Order History
            </h1>
            <p className="text-lg text-gray-600">
              You have completed{" "}
              <span className="font-bold text-gray-900">{orders.length}</span>{" "}
              orders with Mboga Fresh.
            </p>
          </div>
        </section>

        {/* Orders List Container */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-4xl mx-auto space-y-6">
            {error && (
              <div className="bg-red-100 text-red-700 p-4 rounded-lg">
                {error}
              </div>
            )}

            {orders.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-gray-200">
                <p className="text-xl font-medium text-gray-700">
                  You have no past orders yet.
                </p>
                <button
                  onClick={() => navigate("/marketplace")}
                  className="mt-4 bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              orders.map((o) => {
                // Ensure items is always an array for safe processing
                const safeItems = Array.isArray(o.items) ? o.items : [];

                const badge = getStatusBadgeProps(o.orderStatus);

                // FIX: Use safeItems for all mapping/reducing operations
                const itemNamesList = safeItems.map((i) => i.name).join(", ");
                const totalItems = safeItems.reduce(
                  (sum, i) => sum + i.quantity,
                  0
                );

                const totalItemsDisplay =
                  safeItems.length > 3
                    ? `3+ items`
                    : `${safeItems.length} items`;

                return (
                  <div
                    key={o._id}
                    className="bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                  >
                    {/* Order Header Row */}
                    <div className="p-5 flex justify-between items-start border-b border-gray-100">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">
                          Order ID
                        </p>
                        <p className="font-mono text-base font-semibold text-gray-800">
                          #{o._id.substring(18).toUpperCase()}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badge.bg} ${badge.text}`}
                      >
                        <span
                          className={`material-symbols-outlined text-base mr-1`}
                        >
                          {badge.icon}
                        </span>
                        {badge.label}
                      </span>
                    </div>

                    {/* Items & Total Section */}
                    <div className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                      {/* Item Images/Previews */}
                      <div className="flex items-center gap-2 mr-4 mb-4 sm:mb-0 w-full sm:w-auto">
                        {safeItems.slice(0, 3).map((item, index) => (
                          <img
                            key={item.product || index}
                            src={resolveItemImageSrc(item)}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://img.icons8.com/material-outlined/96/CCCCCC/image.png";
                            }}
                          />
                        ))}

                        <div className="text-sm text-gray-600 whitespace-nowrap">
                          {totalItemsDisplay}
                        </div>
                      </div>

                      {/* Summary & Total */}
                      <div className="flex-1 min-w-0 mr-4">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          <span className="font-bold">Items:</span>{" "}
                          {itemNamesList}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Delivering to {o.shippingAddress?.city} (
                          {o.shippingAddress?.street})
                        </p>
                      </div>

                      <div className="flex flex-col items-end pt-3 sm:pt-0">
                        <p className="text-xl font-bold text-gray-900">
                          {formatCurrency(o.totalAmount)}
                        </p>
                        <button
                          onClick={() => handleViewDetails(o._id)}
                          className="mt-2 text-sm font-semibold text-emerald-600 hover:underline"
                        >
                          View All Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Orders;
