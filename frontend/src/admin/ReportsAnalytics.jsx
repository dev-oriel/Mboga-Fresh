import React, { useState } from "react";
import Header from "../components/adminComponents/AdminHeader";
import Sidebar from "../components/adminComponents/AdminSidebar"; // ✅ import from your index.js
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ReportsAnalytics = () => {
  const [activeTab, setActiveTab] = useState("daily");

  // Dummy data for the chart
  const data = [
    { month: "Jan", value: 120 },
    { month: "Feb", value: 150 },
    { month: "Mar", value: 100 },
    { month: "Apr", value: 160 },
    { month: "May", value: 140 },
    { month: "Jun", value: 180 },
  ];

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <Header />

        {/* Main page content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Page Title and Filter */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Reports & Analytics
              </h1>
              <p className="text-gray-500">
                Track key performance indicators and trends across the Mboga
                Fresh platform.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
              {["daily", "weekly", "monthly"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`capitalize px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? "bg-green-600 text-white"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Top KPIs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Top Vegetables Sold */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-gray-600 text-sm font-medium">
                Top Vegetables Sold
              </h2>
              <p className="text-3xl font-bold text-green-600 mt-2">
                12,500 kg
              </p>
              <p className="text-sm text-gray-500">
                Last Month{" "}
                <span className="text-green-500 font-medium">+15%</span>
              </p>

              <div className="mt-4 space-y-3">
                {[
                  { name: "Tomatoes", percent: 85 },
                  { name: "Potatoes", percent: 70 },
                  { name: "Onions", percent: 60 },
                  { name: "Cabbage", percent: 45 },
                  { name: "Carrots", percent: 30 },
                ].map((veg) => (
                  <div key={veg.name}>
                    <div className="flex justify-between text-sm text-gray-700 mb-1">
                      <span>{veg.name}</span>
                      <span>{veg.percent}%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${veg.percent}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Buyer Growth Trends */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-gray-600 text-sm font-medium">
                Buyer Growth Trends
              </h2>
              <p className="text-3xl font-bold text-green-600 mt-2">+200</p>
              <p className="text-sm text-gray-500">
                Last Month{" "}
                <span className="text-green-500 font-medium">+10%</span>
              </p>

              <div className="mt-4 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <XAxis dataKey="month" stroke="#ccc" />
                    <YAxis hide />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#22c55e"
                      strokeWidth={3}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Delivery Performance */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-gray-600 text-sm font-medium">
                Average Delivery Time
              </h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">45 mins</p>
              <p className="text-sm text-red-500 font-medium">-5%</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-gray-600 text-sm font-medium">
                On-Time Delivery Rate
              </h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">95%</p>
              <p className="text-sm text-green-500 font-medium">+2%</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-gray-600 text-sm font-medium">
                Completed Deliveries
              </h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">5,000</p>
              <p className="text-sm text-green-500 font-medium">+10%</p>
            </div>
          </div>

          {/* Vendor Activity by Area */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Vendor Activity by Area
            </h3>
            <table className="w-full text-left border-t border-gray-100">
              <thead className="text-gray-600 text-sm font-medium">
                <tr>
                  <th className="py-2">AREA</th>
                  <th className="py-2">ACTIVE VENDORS</th>
                  <th className="py-2">NEW VENDORS</th>
                  <th className="py-2">AVERAGE SALES</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm">
                {[
                  {
                    area: "Nairobi Central",
                    active: 25,
                    newVendors: 5,
                    sales: "KES 150,000",
                  },
                  {
                    area: "Westlands",
                    active: 20,
                    newVendors: 3,
                    sales: "KES 120,000",
                  },
                  {
                    area: "Kasarani",
                    active: 18,
                    newVendors: 2,
                    sales: "KES 100,000",
                  },
                  {
                    area: "Ruiru",
                    active: 15,
                    newVendors: 1,
                    sales: "KES 80,000",
                  },
                  {
                    area: "Thika",
                    active: 12,
                    newVendors: 0,
                    sales: "KES 60,000",
                  },
                ].map((row) => (
                  <tr key={row.area} className="border-t border-gray-100">
                    <td className="py-3">{row.area}</td>
                    <td>{row.active}</td>
                    <td>{row.newVendors}</td>
                    <td>{row.sales}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
