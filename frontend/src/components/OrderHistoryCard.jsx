// frontend/src/components/OrderHistoryCard.jsx - MODIFIED FOR DATABASE FETCH

import React, { useState, useEffect } from "react";
import { fetchBuyerOrders } from "../api/orders"; // <-- NEW IMPORT
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Helper to calculate total amount display (assuming only KES for simplicity here)
const formatCurrency = (amount) => `Ksh ${Number(amount).toLocaleString()}`;

const OrderHistoryCard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [openRow, setOpenRow] = useState(null);

  // Fetch the buyer's orders on component mount/user change
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadOrders = async () => {
      try {
        const data = await fetchBuyerOrders();
        setOrders(data);
      } catch (err) {
        console.error("Error fetching profile orders:", err);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user]);

  const badgeClass = (status) => {
    const lowerStatus = status ? status.toLowerCase() : "";
    if (lowerStatus === "delivered") return "bg-green-100 text-green-700";
    if (lowerStatus === "shipped") return "bg-blue-100 text-blue-700";
    if (lowerStatus === "processing") return "bg-yellow-100 text-yellow-700";
    return "bg-gray-100 text-gray-700";
  };

  const toggleDetails = (id) => {
    setOpenRow(openRow === id ? null : id);
  };

  const visibleRows = showAll ? orders : orders.slice(0, 2);

  return (
    <div className="bg-white rounded-xl shadow-md p-6" id="order-history">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Order History</h3>

      {loading ? (
        <div className="text-center py-6 text-gray-600">
          Loading order history...
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-6 text-gray-600">No orders found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="p-4 font-semibold text-gray-700">Order ID</th>
                <th className="p-4 font-semibold text-gray-700">Date</th>
                <th className="p-4 font-semibold text-gray-700">Total</th>
                <th className="p-4 font-semibold text-gray-700">Status</th>
                <th className="p-4 font-semibold text-gray-700 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {visibleRows.map((r) => (
                <React.Fragment key={r._id}>
                  <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-gray-800">
                      #{r._id.substring(18)}
                    </td>
                    <td className="p-4 text-gray-600">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-gray-800 font-medium">
                      {formatCurrency(r.totalAmount)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`${badgeClass(
                          r.orderStatus
                        )} text-xs font-semibold px-2.5 py-0.5 rounded-full`}
                      >
                        {r.orderStatus}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => toggleDetails(r._id)}
                        className="font-medium text-emerald-600 hover:underline"
                      >
                        {openRow === r._id ? "Hide Details" : "View Details"}
                      </button>
                    </td>
                  </tr>

                  {openRow === r._id && (
                    <tr>
                      <td colSpan="5" className="p-4 bg-gray-50 rounded-b-lg">
                        <div className="border border-gray-200 rounded-lg p-4 space-y-3 transition-all duration-300">
                          <h4 className="font-semibold text-gray-800 mb-2">
                            Items Ordered
                          </h4>
                          <ul className="space-y-1">
                            {r.items.map((item, idx) => (
                              <li
                                key={idx}
                                className="flex justify-between text-sm text-gray-700"
                              >
                                <span>
                                  {item.name} × {item.quantity}
                                </span>
                                <span className="font-medium">
                                  {formatCurrency(item.price * item.quantity)}
                                </span>
                              </li>
                            ))}
                          </ul>
                          <div className="pt-2 border-t border-gray-200 mt-3 text-sm text-gray-600">
                            <p>
                              <span className="font-medium text-gray-800">
                                Address:
                              </span>{" "}
                              {r.shippingAddress.street},{" "}
                              {r.shippingAddress.city}
                            </p>
                            <p>
                              <span className="font-medium text-gray-800">
                                Payment Status:
                              </span>{" "}
                              {r.paymentStatus}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {orders.length > 2 && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="font-semibold text-emerald-600 hover:underline transition-colors"
          >
            {showAll ? "Hide Recent Orders" : "View All Orders"}
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryCard;
