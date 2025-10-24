import React, { useState } from "react";
import { Search, X, Scale } from "lucide-react";
import Sidebar from "../components/adminComponents/AdminSidebar";
import Header from "../components/adminComponents/AdminHeader";

const DisputeModal = ({ dispute, onClose }) => {
  if (!dispute) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Dispute Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Info */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-900 mb-2">Dispute Information</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-red-600 font-medium">Dispute ID</p>
                <p className="text-red-900">{dispute.id}</p>
              </div>
              <div>
                <p className="text-red-600 font-medium">Amount</p>
                <p className="text-red-900 font-semibold">
                  Ksh {dispute.amount.toLocaleString("en-KE", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-red-600 font-medium">Buyer</p>
                <p className="text-red-900">{dispute.buyer}</p>
              </div>
              <div>
                <p className="text-red-600 font-medium">Vendor</p>
                <p className="text-red-900">{dispute.vendor}</p>
              </div>
              <div>
                <p className="text-red-600 font-medium">Dispute Type</p>
                <p className="text-red-900">{dispute.type}</p>
              </div>
              <div>
                <p className="text-red-600 font-medium">Date Opened</p>
                <p className="text-red-900">{dispute.date}</p>
              </div>
            </div>
          </div>

          {/* Reason */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Reason for Dispute</h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-gray-700 text-sm">{dispute.reason}</p>
            </div>
          </div>

          {/* Evidence */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Evidence Submitted</h3>
            <div className="grid grid-cols-2 gap-3">
              {dispute.evidence.map((img, i) => (
                <div key={i} className="bg-gray-100 rounded-lg p-4 text-center">
                  <div className="w-full h-32 bg-gray-300 rounded mb-2 flex items-center justify-center overflow-hidden">
                    <img src={img} alt="Evidence" className="object-cover w-full h-full rounded" />
                  </div>
                  <p className="text-xs text-gray-600">Evidence {i + 1}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Admin Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
              Resolve in Favor of Buyer
            </button>
            <button className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              Resolve in Favor of Vendor
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminDisputeManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedDispute, setSelectedDispute] = useState(null);

  // Dummy data
  const disputes = [
    {
      id: "#DSP-001",
      buyer: "Aisha Hassan",
      vendor: "Mama Mboga Grace",
      type: "Buyer vs Vendor",
      amount: 1850.0,
      date: "2025-10-21",
      status: "Open",
      reason: "Buyer received wilted vegetables instead of fresh produce.",
      evidence: [
        "https://images.unsplash.com/photo-1582284540020-4e68b7c3a388?w=400",
        "https://images.unsplash.com/photo-1580910051074-3afbf9c3a1de?w=400",
      ],
    },
    {
      id: "#DSP-002",
      buyer: "John Otieno",
      vendor: "Mama Mboga Njeri",
      type: "Buyer vs Vendor",
      amount: 3200.0,
      date: "2025-10-19",
      status: "Under Review",
      reason: "Buyer claims short delivery of tomatoes and onions.",
      evidence: [
        "https://images.unsplash.com/photo-1576176539993-23c2f6f5f8f9?w=400",
        "https://images.unsplash.com/photo-1584306670957-1d1c8c0a8a57?w=400",
      ],
    },
    {
      id: "#DSP-003",
      buyer: "Grace Wanjiku",
      vendor: "Mama Mboga Beatrice",
      type: "Buyer vs Vendor",
      amount: 4500.0,
      date: "2025-10-17",
      status: "Resolved",
      reason: "Order delayed by 3 days, causing spoilage of perishable goods.",
      evidence: [
        "https://images.unsplash.com/photo-1574672280901-62aa92b4d35b?w=400",
        "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400",
      ],
    },
  ];

  const filteredDisputes = disputes.filter((d) => {
    const matchesSearch =
      d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.buyer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.vendor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "All" || d.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    const styles = {
      Open: "bg-red-100 text-red-700",
      "Under Review": "bg-yellow-100 text-yellow-700",
      Resolved: "bg-green-100 text-green-700",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
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
          {/* Summary Card */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-2xl shadow-sm border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">
                  Active Disputes
                </p>
                <h2 className="text-4xl font-bold text-red-600">
                  {disputes.filter((d) => d.status !== "Resolved").length}
                </h2>
              </div>
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <Scale className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search disputes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-400"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-400"
            >
              <option>All</option>
              <option>Open</option>
              <option>Under Review</option>
              <option>Resolved</option>
            </select>
          </div>

          {/* Disputes Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Dispute ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Buyer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Vendor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Type
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
                  {filteredDisputes.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{d.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{d.buyer}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{d.vendor}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{d.type}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {d.amount.toLocaleString("en-KE", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{d.date}</td>
                      <td className="px-6 py-4">{getStatusBadge(d.status)}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedDispute(d)}
                          className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-xs font-medium"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {selectedDispute && (
        <DisputeModal dispute={selectedDispute} onClose={() => setSelectedDispute(null)} />
      )}
    </div>
  );
};

export default AdminDisputeManagement;
