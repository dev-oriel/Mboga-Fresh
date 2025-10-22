import React, { useState } from "react";
import { Search, Landmark, X } from "lucide-react";
import Header from "../components/adminComponents/AdminHeader";
import Sidebar from "../components/adminComponents/AdminSidebar";

// Dispute Modal Component
const DisputeModal = ({ transaction, onClose }) => {
  if (!transaction) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Dispute Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Transaction Info */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-900 mb-2">Transaction Information</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-red-600 font-medium">Transaction ID</p>
                <p className="text-red-900">{transaction.id}</p>
              </div>
              <div>
                <p className="text-red-600 font-medium">Amount</p>
                <p className="text-red-900 font-semibold">Ksh {transaction.amount.toLocaleString('en-KE', { minimumFractionDigits: 2 })}</p>
              </div>
              <div>
                <p className="text-red-600 font-medium">Buyer</p>
                <p className="text-red-900">{transaction.buyer}</p>
              </div>
              <div>
                <p className="text-red-600 font-medium">Seller</p>
                <p className="text-red-900">{transaction.seller}</p>
              </div>
            </div>
          </div>

          {/* Dispute Reason */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Dispute Reason</h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-gray-700 text-sm">
                Product quality does not match description. Received wilted vegetables instead of fresh produce as advertised.
              </p>
            </div>
          </div>

          {/* Evidence */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Evidence Submitted</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-100 rounded-lg p-4 text-center">
                <div className="w-full h-32 bg-gray-300 rounded mb-2 flex items-center justify-center text-gray-500">
                  📷 Image 1
                </div>
                <p className="text-xs text-gray-600">Product photo</p>
              </div>
              <div className="bg-gray-100 rounded-lg p-4 text-center">
                <div className="w-full h-32 bg-gray-300 rounded mb-2 flex items-center justify-center text-gray-500">
                  📷 Image 2
                </div>
                <p className="text-xs text-gray-600">Receipt</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Dispute Timeline</h3>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-[#63cf17] mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Order Placed</p>
                  <p className="text-xs text-gray-500">2023-10-20 10:30 AM</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Product Delivered</p>
                  <p className="text-xs text-gray-500">2023-10-22 02:15 PM</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Dispute Raised</p>
                  <p className="text-xs text-gray-500">2023-10-24 09:00 AM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button className="flex-1 py-2 px-4 bg-[#63cf17] text-white rounded-lg hover:bg-[#52b012] transition-colors font-medium">
              Resolve in Favor of Buyer
            </button>
            <button className="flex-1 py-2 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium">
              Resolve in Favor of Seller
            </button>
            <button 
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Escrow & Payments Component
const EscrowPayments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [transactions, setTransactions] = useState([
    {
      id: "#MBG-84321",
      buyer: "Aisha Hassan",
      seller: "Fresh Veggies Ltd.",
      amount: 5200.00,
      date: "2023-10-26",
      status: "Released"
    },
    {
      id: "#MBG-84320",
      buyer: "James Omondi",
      seller: "Mama Mboga Grace",
      amount: 1850.00,
      date: "2023-10-25",
      status: "Pending"
    },
    {
      id: "#MBG-84319",
      buyer: "David Koech",
      seller: "Kilimo Fresh Farm",
      amount: 12500.00,
      date: "2023-10-24",
      status: "Disputed"
    },
    {
      id: "#MBG-84318",
      buyer: "Mary Wanjiru",
      seller: "City Grocers",
      amount: 3400.00,
      date: "2023-10-23",
      status: "Released"
    },
    {
      id: "#MBG-84317",
      buyer: "Peter Gitau",
      seller: "Urban Farmers Co-op",
      amount: 8900.00,
      date: "2023-10-22",
      status: "Pending"
    }
  ]);

  const totalEscrowBalance = transactions.reduce((sum, t) => sum + t.amount, 0);

  const handleRelease = (id) => {
    setTransactions(prev =>
      prev.map(t => t.id === id ? { ...t, status: "Released" } : t)
    );
  };

  const handleHold = (id) => {
    setTransactions(prev =>
      prev.map(t => t.id === id ? { ...t, status: "Pending" } : t)
    );
  };

  const handleViewDispute = (transaction) => {
    setSelectedDispute(transaction);
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.buyer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.seller.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All Statuses" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const styles = {
      Released: "bg-green-100 text-green-700",
      Pending: "bg-yellow-100 text-yellow-700",
      Disputed: "bg-red-100 text-red-700"
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${styles[status]}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
        {status}
      </span>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#f7f8f6]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />

        <main className="p-6 space-y-6">
          {/* Total Escrow Balance Card */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl shadow-sm border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">
                  Total Escrow Balance
                </p>
                <h2 className="text-4xl font-bold text-[#63cf17]">
                  Ksh {totalEscrowBalance.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h2>
              </div>
              <button className="p-3 bg-white rounded-lg hover:bg-green-50 transition-colors shadow-sm">
                <Landmark className="w-6 h-6 text-[#63cf17]" />
              </button>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 w-full md:max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
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
                <option>All Statuses</option>
                <option>Released</option>
                <option>Pending</option>
                <option>Disputed</option>
              </select>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Transaction ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Buyer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Seller
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Amount (KSH)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {transaction.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {transaction.buyer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {transaction.seller}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {transaction.amount.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {transaction.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(transaction.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {transaction.status === "Pending" ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleRelease(transaction.id)}
                              className="px-3 py-1 bg-[#63cf17] text-white rounded-lg hover:bg-[#52b012] transition-colors text-xs font-medium"
                            >
                              Release
                            </button>
                            <button
                              onClick={() => handleHold(transaction.id)}
                              className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs font-medium"
                            >
                              Hold
                            </button>
                          </div>
                        ) : transaction.status === "Disputed" ? (
                          <button 
                            onClick={() => handleViewDispute(transaction)}
                            className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs font-medium"
                          >
                            View Dispute
                          </button>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Dispute Modal */}
      {selectedDispute && (
        <DisputeModal 
          transaction={selectedDispute} 
          onClose={() => setSelectedDispute(null)} 
        />
      )}
    </div>
  );
};

export default EscrowPayments;