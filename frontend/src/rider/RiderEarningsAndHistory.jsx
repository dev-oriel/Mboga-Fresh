import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import RiderHeader from "../components/riderComponents/RiderHeader";
import { useVendorData } from "../context/VendorDataContext"; // Reusing VendorContext model for Wallet logic
import axios from "axios";
import { Loader2, DollarSign } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const formatCurrency = (amount) =>
  `Ksh ${Number(amount).toLocaleString("en-KE", { minimumFractionDigits: 0 })}`;

const RiderEarningsAndHistory = () => {
  const navigate = useNavigate();
  const {
    balances, // Fetches available, escrow, etc.
    handleWithdraw, // Function to simulate/process withdrawal
    updateDashboardData, // Used to mock update state on fetch failure
  } = useVendorData(); // Assuming Rider also uses the general VendorDataContext model

  const [earningsData, setEarningsData] = useState({
    totalEarnings: 0,
    completedCount: 0,
    recentDeliveries: [],
    thisWeekEarnings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [mpesaNumber, setMpesaNumber] = useState("2547XXXXXXXX");
  const [withdrawMessage, setWithdrawMessage] = useState(null);

  const fetchEarningsData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Calls the aggregated endpoint we created previously
      const response = await axios.get(`${API_BASE}/api/orders/rider/stats`, {
        withCredentials: true,
      });

      const data = response.data;

      setEarningsData({
        totalEarnings: data.totalEarnings,
        completedCount: data.completedCount,
        recentDeliveries: data.recentDeliveries,
        thisWeekEarnings: data.totalEarnings * 0.4, // Mocked for display
        bonuses: 1500,
      });

      // Important: Update the context balance using the live fetched data
      updateDashboardData({
        earningsReleased: data.totalEarnings,
        ordersReceived: data.completedCount,
      });
    } catch (err) {
      console.error("Failed to fetch earnings data:", err);
      setError(err.response?.data?.message || "Failed to load earnings data.");
    } finally {
      setLoading(false);
    }
  }, [updateDashboardData]);

  useEffect(() => {
    fetchEarningsData();
  }, [fetchEarningsData]);

  const getHistoryRows = () => {
    return earningsData.recentDeliveries.map((payout) => ({
      date: new Date(payout.date).toLocaleDateString(),
      amount: payout.earnings,
      status: payout.status,
      id: payout.id.toString(),
    }));
  };

  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    const amountNum = parseFloat(withdrawAmount);

    if (isNaN(amountNum) || amountNum <= 0) {
      setWithdrawMessage({
        type: "error",
        text: "Please enter a valid amount.",
      });
      return;
    }
    if (amountNum > balances.available) {
      setWithdrawMessage({
        type: "error",
        text: "Insufficient available funds.",
      });
      return;
    }

    // This calls the context function which updates local state and simulates the transaction
    const success = handleWithdraw(amountNum, mpesaNumber);

    if (success) {
      setWithdrawMessage({
        type: "success",
        text: `Ksh ${amountNum.toLocaleString()} withdrawal initiated! Check your M-Pesa soon.`,
      });
      setWithdrawAmount("");
    } else {
      setWithdrawMessage({
        type: "error",
        text: "Withdrawal failed. Try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <RiderHeader />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Earnings & History
        </h2>

        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-600 mb-2" />
            Fetching financial data...
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Column - Earnings Summary */}
            <div className="lg:col-span-3 space-y-6">
              <section>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">
                  Current Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm col-span-2 border-l-4 border-emerald-600">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Available for Withdrawal
                    </div>
                    <div className="text-4xl font-bold text-emerald-600">
                      {formatCurrency(balances.available)}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Total Earned
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(earningsData.totalEarnings)}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Completed Deliveries
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {earningsData.completedCount.toLocaleString()}
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">
                  Payout History
                </h3>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-white dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          DATE
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          ORDER ID
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          AMOUNT
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          STATUS
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {getHistoryRows().map((payout) => (
                        <tr key={payout.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {payout.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            #{payout.id.substring(18).toUpperCase()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {formatCurrency(payout.amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                              {payout.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            {/* Right Column - Withdrawal Panel */}
            <aside className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-20 border border-gray-200">
                <div className="flex items-center mb-4 pb-4 border-b border-gray-100">
                  <DollarSign className="w-6 h-6 text-emerald-600 mr-2" />
                  <h3 className="text-xl font-bold text-gray-900">
                    Withdraw Funds
                  </h3>
                </div>

                {withdrawMessage && (
                  <div
                    className={`mb-4 p-3 text-sm rounded-lg ${
                      withdrawMessage.type === "success"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {withdrawMessage.text}
                  </div>
                )}

                <form onSubmit={handleWithdrawSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Available Balance
                    </label>
                    <div className="text-3xl font-extrabold text-emerald-600">
                      {formatCurrency(balances.available)}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      M-Pesa Number
                    </label>
                    <input
                      type="tel"
                      value={mpesaNumber}
                      onChange={(e) => setMpesaNumber(e.target.value)}
                      placeholder="2547XXXXXXXX"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount to Withdraw
                    </label>
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="e.g., 5000"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      max={balances.available}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={
                      balances.available <= 0 ||
                      parseFloat(withdrawAmount) > balances.available ||
                      !withdrawAmount
                    }
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg disabled:bg-gray-300 transition-colors"
                  >
                    Initiate Withdrawal
                  </button>

                  <p className="text-xs text-gray-500 pt-1">
                    Payouts are simulated and transferred instantly to your
                    M-Pesa.
                  </p>
                </form>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
};

export default RiderEarningsAndHistory;
