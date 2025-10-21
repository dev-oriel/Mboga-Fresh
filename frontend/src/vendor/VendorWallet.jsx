// vendor/VendorWallet.jsx
import React, { useState } from "react";
import Header from "../components/vendorComponents/Header";
import Footer from "../components/vendorComponents/Footer";
import { useVendorData } from "../context/VendorDataContext";
import { useAuth } from "../context/AuthContext";

function VendorWallet() {
  const { user } = useAuth();
  const [mpesa, setMpesa] = useState("254712345678");
  const [amount, setAmount] = useState("");
  const { balances, transactions, handleWithdraw } = useVendorData();

  function handleWithdrawSubmit(e) {
    e.preventDefault();
    if (!amount) {
      alert("Enter an amount to withdraw");
      return;
    }

    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (withdrawAmount > balances.available) {
      alert("Insufficient funds");
      return;
    }

    const success = handleWithdraw(withdrawAmount, mpesa);
    if (success) {
      alert(`Withdrawing Ksh ${withdrawAmount.toLocaleString()} to ${mpesa}`);
      setAmount("");
    } else {
      alert("Withdrawal failed. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header
        avatarUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuDeL7radWSj-FEteEjqLpufXII3-tc_o7GMvLvB07AaD_bYBkfAcIOnNbOXkTdMOHRgJQwLZE-Z_iw72Bd8bpHzfXP_m0pIvteSw7FKZ1qV9GD1KfgyDVG90bCO7OGe6JyYIkm9DBo2ArC60uEqSfDvnnYWeo6IqVEjWxsVX6dUoxjm9ozyVlriiMdVLc_jU9ZxS01QcxNa8hn-ePNbB6IcXSwExf2U61R-epab8nsOkbq95E7z6b-fH4zOt0j2MPt20nrqtPM1NHI"
        userName={user?.name || "Vendor"}
      />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold mb-6">Wallet & Payments</h2>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left / center: main content */}
          <section className="lg:col-span-3 space-y-6">
            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-6 shadow-sm flex flex-col">
                <div className="text-xs text-gray-500">Funds in Escrow</div>
                <div className="mt-4 text-2xl font-bold">
                  Ksh {balances.escrow.toLocaleString()}
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm flex flex-col">
                <div className="text-xs text-gray-500">Available Balance</div>
                <div className="mt-4 text-2xl font-bold">
                  Ksh {balances.available.toLocaleString()}
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm flex flex-col">
                <div className="text-xs text-gray-500">Total Earnings</div>
                <div className="mt-4 text-2xl font-bold">
                  Ksh {balances.earnings.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Transaction history */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-lg mb-4">
                Transaction History
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm table-auto">
                  <thead>
                    <tr className="text-left text-gray-500">
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Order ID</th>
                      <th className="pb-3">Description</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((t, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="py-3 text-gray-600">{t.date}</td>
                        <td className="py-3 text-gray-600">{t.id}</td>
                        <td className="py-3 text-gray-600">{t.desc}</td>
                        <td
                          className={`py-3 ${
                            t.amount < 0 ? "text-red-500" : "text-gray-800"
                          }`}
                        >
                          Ksh {Math.abs(t.amount).toLocaleString()}
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              t.status === "Released"
                                ? "bg-green-100 text-green-700"
                                : t.status === "Completed"
                                ? "bg-gray-100 text-gray-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Right: Withdraw panel */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h4 className="font-semibold text-lg mb-4">Withdraw Funds</h4>

              <form onSubmit={handleWithdrawSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    M-Pesa Number
                  </label>
                  <input
                    value={mpesa}
                    onChange={(e) => setMpesa(e.target.value)}
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Amount
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g., 5000"
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
                    max={balances.available}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Available: Ksh {balances.available.toLocaleString()}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-white rounded-md py-2 font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                  disabled={
                    !amount ||
                    parseFloat(amount) <= 0 ||
                    parseFloat(amount) > balances.available
                  }
                >
                  Withdraw Now
                </button>

                <div className="mt-4 text-sm bg-green-50 border border-green-100 p-3 rounded-md text-green-700">
                  <strong className="block">Tip:</strong>
                  M-Pesa withdrawals are processed instantly but may take up to
                  5 minutes to reflect in your account.
                </div>
              </form>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default VendorWallet;
