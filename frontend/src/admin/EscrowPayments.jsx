import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Landmark,
  Loader2,
  AlertTriangle,
  Phone,
  Scale,
} from "lucide-react";
import Header from "../components/adminComponents/AdminHeader";
import Sidebar from "../components/adminComponents/AdminSidebar";
import axios from "axios";
// useNavigate is no longer strictly needed if we remove the action buttons,
// but we'll keep the import for completeness of the file's history.
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

// Helper function to format currency (Ensuring NaN is handled)
const formatKsh = (amount) => {
  const safeAmount = Number(amount) || 0;
  return `Ksh ${safeAmount.toLocaleString("en-KE", {
    minimumFractionDigits: 2,
  })}`;
};

const EscrowPayments = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [loadingEscrow, setLoadingEscrow] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  // Removed: setSelectedDispute state (no longer needed for this audit tab)

  const [totalEscrowBalance, setTotalEscrowBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  // Function to fetch the total escrow amount (Unchanged)
  const fetchEscrowBalance = useCallback(async () => {
    setLoadingEscrow(true);
    try {
      const endpoint = `${API_BASE}/api/admin/escrow-balance`;
      const response = await axios.get(endpoint, { withCredentials: true });
      setTotalEscrowBalance(response.data.totalEscrow || 0);
      setFetchError(null);
    } catch (err) {
      console.error("Error fetching escrow balance:", err);
      setTotalEscrowBalance("N/A");
      setFetchError(err.message);
    } finally {
      setLoadingEscrow(false);
    }
  }, []);

  // Function to fetch all transactions (Paid orders)
  const fetchTransactions = useCallback(async () => {
    setLoadingTransactions(true);
    try {
      const response = await axios.get(`${API_BASE}/api/admin/transactions`, {
        withCredentials: true,
      });
      setTransactions(response.data);
      setFetchError(null);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setTransactions([]);
      setFetchError(
        err.response?.data?.message || "Failed to load transaction data."
      );
    } finally {
      setLoadingTransactions(false);
    }
  }, []);

  useEffect(() => {
    fetchEscrowBalance();
    fetchTransactions();
  }, [fetchEscrowBalance, fetchTransactions]);

  // Removed: handleRelease, handleHold, handleInitiateDispute

  const getStatusBadge = (status) => {
    const lowerStatus = status.toLowerCase();
    const styles = {
      delivered: "bg-green-100 text-green-700",
      paid: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      "new order": "bg-yellow-100 text-yellow-700",
      "qr scanning": "bg-yellow-100 text-yellow-700",
      "in delivery": "bg-blue-100 text-blue-700",
      cancelled: "bg-red-100 text-red-700",
      disputed: "bg-red-100 text-red-700",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
          styles[lowerStatus] || styles.pending
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
        {status}
      </span>
    );
  };

  const filteredTransactions = transactions.filter((t) => {
    const orderIdShort = t.id.substring(18).toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesSearch =
      orderIdShort.includes(query) ||
      t.buyerName.toLowerCase().includes(query) ||
      t.phone.includes(query) ||
      t.mpesaCode?.toLowerCase().includes(query);

    const statusMatch =
      statusFilter === "All Statuses" ||
      (statusFilter === "Released" && t.status === "Delivered") ||
      (statusFilter === "Pending" &&
        t.status !== "Delivered" &&
        t.status !== "Cancelled");

    return matchesSearch && statusMatch;
  });

  return (
    <div className="flex min-h-screen bg-[#f7f8f6]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />

        <main className="p-6 space-y-6">
          <h1 className="text-3xl font-bold text-stone-900">
            Financial Transactions (Audit)
          </h1>

          {/* Total Escrow Balance Card - Unchanged */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl shadow-sm border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">
                  Total Funds Held in Escrow
                </p>
                <h2 className="text-4xl font-bold text-[#63cf17] flex items-center gap-3">
                  {loadingEscrow ? (
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                  ) : (
                    formatKsh(totalEscrowBalance)
                  )}
                </h2>
              </div>
              <Landmark className="w-8 h-8 text-[#63cf17]" />
            </div>
          </div>

          {/* Error Banner */}
          {fetchError && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">Error: {fetchError}</span>
            </div>
          )}

          {/* Filters and Search - Unchanged */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 w-full md:max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search ID, Buyer, or M-Pesa Code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#63cf17] focus:border-transparent"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#63cf17] focus:border-transparent"
              >
                <option value="All Statuses">All Transactions</option>
                <option value="Pending">In Escrow (Pending Delivery)</option>
                <option value="Released">Released (Delivered)</option>
                <option value="Disputed">Disputed</option>
              </select>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {loadingTransactions ? (
              <div className="text-center py-12">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-600 mb-2" />
                Loading transactions...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Order ID
                      </th>

                      {/* TRANSACTION DATE */}
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Date
                      </th>

                      {/* TRANSACTION TIME */}
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Time
                      </th>

                      {/* BUYER/PAYMENT PHONE */}
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Buyer (Phone)
                      </th>

                      {/* MPESA CODE */}
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        M-Pesa Code
                      </th>

                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Amount (KSH)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Fulfillment Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredTransactions.map((t) => (
                      <tr
                        key={t.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                          #{t.id.substring(18).toUpperCase()}
                        </td>
                        {/* TRANSACTION DATE COLUMN */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                          {t.transactionDate}
                        </td>
                        {/* TRANSACTION TIME COLUMN */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700">
                          {t.transactionTime}
                        </td>
                        {/* BUYER/PHONE COLUMN */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <span className="font-medium">{t.buyerName}</span>
                          <div className="text-xs text-gray-500 flex items-center">
                            <Phone className="w-3 h-3 mr-1" /> {t.phone}
                          </div>
                        </td>
                        {/* M-PESA CODE COLUMN */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-emerald-600 font-semibold">
                          {t.mpesaCode || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {formatKsh(t.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {/* Action: Send to Disputes Tab */}
                          <button
                            onClick={() =>
                              navigate(
                                `/admindisputeresolution?orderId=${t.id}`
                              )
                            }
                            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs font-medium flex items-center gap-1"
                            title="Initiate conflict resolution or view fulfillment status"
                          >
                            <Scale className="w-3 h-3" /> Resolve
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default EscrowPayments;
