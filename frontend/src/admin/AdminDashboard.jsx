import React from "react";
import Header from "../components/adminComponents/AdminHeader";
import Sidebar from "../components/adminComponents/AdminSidebar";

const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />

        <main className="p-6 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                title: "Total Users",
                value: "12,345",
                change: "+10% this month",
                color: "text-green-600",
              },
              {
                title: "Total Transactions",
                value: "6,789",
                change: "+5% this month",
                color: "text-green-600",
              },
              {
                title: "Escrow Balance",
                value: "Ksh 31,850.00",
                change: "+2% this month",
                color: "text-green-600",
              },
              {
                title: "Current Disputes",
                value: "15",
                change: "-1% this month",
                color: "text-red-600",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100"
              >
                <p className="text-gray-600 text-sm font-medium">{card.title}</p>
                <h2 className="text-3xl font-bold text-gray-800 mt-1">
                  {card.value}
                </h2>
                <p className={`text-xs font-semibold mt-1 ${card.color}`}>
                  {card.change}
                </p>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-3">
                Daily Deliveries
              </h3>
              <div className="h-48 bg-green-50 rounded-lg flex items-center justify-center text-green-500 font-medium">
                [Chart Placeholder]
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-3">Orders by Role</h3>
              <div className="space-y-3">
                {[
                  { role: "Buyers", percent: 30 },
                  { role: "Sellers", percent: 25 },
                  { role: "Suppliers", percent: 20 },
                  { role: "Riders", percent: 25 },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm font-medium text-gray-700">
                      <span>{item.role}</span>
                      <span>{item.percent}%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${item.percent}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
