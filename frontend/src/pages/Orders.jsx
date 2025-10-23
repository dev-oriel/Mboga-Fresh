// frontend/src/pages/Orders.jsx - MODIFIED FOR DATABASE FETCH

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/FooterSection.jsx";
import { fetchBuyerOrders } from "../api/orders"; // <-- NEW IMPORT
import { useAuth } from "../context/AuthContext";

// Helper to get status colors
const getStatusBadgeProps = (status) => {
  switch (status) {
    case "Delivered":
      return {
        label: "Delivered",
        bg: "bg-emerald-100",
        text: "text-emerald-700",
        icon: "check_circle",
      };
    case "Shipped":
      return {
        label: "Shipped",
        bg: "bg-blue-100",
        text: "text-blue-700",
        icon: "local_shipping",
      };
    case "Confirmed":
      return {
        label: "Confirmed",
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        icon: "pending",
      };
    case "Processing":
      return {
        label: "Processing",
        bg: "bg-gray-100",
        text: "text-gray-700",
        icon: "schedule",
      };
    default:
      return {
        label: status,
        bg: "bg-gray-100",
        text: "text-gray-700",
        icon: "info",
      };
  }
};

const Orders = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return; // Wait for user authentication

    const loadOrders = async () => {
      try {
        const data = await fetchBuyerOrders();
        setOrders(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user]);

  const handleViewDetails = (orderId) => {
    // Navigate to an order detail route (e.g., to fetch full details by ID)
    navigate(`/order/${orderId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow container mx-auto p-8 text-center">
          <p className="text-lg text-gray-600">Loading your order history...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f8f6] dark:bg-[#1a1a1a] text-[#111827] dark:text-[#E5E7EB]">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-[#111827]/6 dark:bg-[#000000]/20 py-20">
          {/* ... (background image/overlay content remains the same) ... */}
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#111827] dark:text-white mb-4">
              Your Orders
            </h1>
            <p className="text-lg text-[#374151] dark:text-[#D1D5DB] max-w-2xl mx-auto">
              Track your fresh produce from the farm to your doorstep.
            </p>
          </div>
        </section>

        {/* Orders list */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-16">
          <div className="max-w-5xl mx-auto space-y-8">
            {error && <div className="text-red-600 text-center">{error}</div>}

            {orders.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-lg">
                <p className="text-xl font-medium text-gray-700">
                  You have no past orders yet.
                </p>
                <button
                  onClick={() => navigate("/marketplace")}
                  className="mt-4 bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              orders.map((o) => {
                const badge = getStatusBadgeProps(o.orderStatus);
                return (
                  <article
                    key={o._id}
                    className="bg-white dark:bg-[#242424] rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden"
                    aria-labelledby={`order-${o._id}-title`}
                  >
                    <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-8">
                      {/* Image - Placeholder logic using first item's name */}
                      <div
                        className="w-full md:w-48 h-48 md:h-auto md:self-stretch rounded-lg bg-gray-200 bg-center flex-shrink-0 flex items-center justify-center text-gray-500 font-bold"
                        role="img"
                        aria-label={o.items[0]?.name}
                      >
                        {o.items[0]?.name.substring(0, 15)}...
                      </div>

                      {/* Content */}
                      <div className="flex-grow space-y-4 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-3">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badge.bg} ${badge.text}`}
                          >
                            <span
                              className={`material-symbols-outlined text-base mr-1.5`}
                            >
                              {badge.icon}
                            </span>
                            {badge.label}
                          </span>

                          <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                            {new Date(o.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        <h3
                          id={`order-${o._id}-title`}
                          className="text-xl font-bold text-[#111827] dark:text-white"
                        >
                          Order #{o._id.substring(18)}
                        </h3>

                        <p className="text-[#4B5563] dark:text-[#9CA3AF] text-sm">
                          Total: KSh {o.totalAmount.toLocaleString()} (
                          {o.items.length} items)
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start pt-2">
                          <button
                            onClick={() => handleViewDetails(o._id)}
                            className="bg-[#E5E7EB] dark:bg-[#2f2f2f] hover:bg-[#d1d5db] dark:hover:bg-[#3a3a3a] text-[#111827] dark:text-[#E5E7EB] font-bold py-2 px-6 rounded-lg text-sm transition-colors"
                            aria-label={`View details for order ${o._id}`}
                          >
                            View Details
                          </button>

                          {/* Reorder Button Placeholder */}
                          <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
                            Reorder
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
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
