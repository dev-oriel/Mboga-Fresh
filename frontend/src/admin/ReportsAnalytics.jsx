import React, { useState } from "react";
import Header from "../components/adminComponents/AdminHeader";
import Sidebar from "../components/adminComponents/AdminSidebar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BarChart3 } from "lucide-react";

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

  // Helper to standardize button style
  const getTabClass = (tab) =>
    `capitalize px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
      activeTab === tab
        ? "bg-emerald-600 text-white shadow-md" // Using emerald for consistency
        : "text-gray-700 hover:bg-gray-200"
    }`;

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
            <div className="flex items-center space-x-3">
              <BarChart3 size={32} className="text-emerald-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Reports & Analytics
                </h1>
                <p className="text-gray-600 text-sm">
                  Track key performance indicators and trends across the Mboga
                  Fresh platform.
                </p>
              </div>
            </div>

            {/* Filter buttons */}
            <div className="flex space-x-2 bg-gray-100 p-1 rounded-xl shadow-inner">
              {["daily", "weekly", "monthly"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={getTabClass(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* KPI and Chart Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Top Vegetables Sold */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Top Vegetables Sold (Volume)
              </h2>
              <div className="mt-4 space-y-4">
                {[
                  { name: "Tomatoes", percent: 85, value: "2,125 kg" },
                  { name: "Potatoes", percent: 70, value: "1,750 kg" },
                  { name: "Onions", percent: 60, value: "1,500 kg" },
                  { name: "Cabbage", percent: 45, value: "1,125 kg" },
                  { name: "Carrots", percent: 30, value: "750 kg" },
                ].map((veg) => (
                  <div key={veg.name}>
                    <div className="flex justify-between text-sm text-gray-700 mb-1">
                      <span className="font-medium">{veg.name}</span>
                      <span className="font-semibold text-gray-900">
                        {veg.value}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full">
                      <div
                        className="bg-emerald-500 h-2 rounded-full" // Changed to emerald
                        style={{ width: `${veg.percent}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Buyer Growth Trends */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Revenue Trend ({activeTab.toUpperCase()})
              </h2>
              <div className="flex items-end justify-between mb-4">
                <p className="text-4xl font-bold text-gray-900">Ksh 15,400</p>
                <p className="text-sm text-green-500 font-medium flex items-center">
                  <span className="material-symbols-outlined text-base">
                    trending_up
                  </span>
                  +10.5%
                </p>
              </div>

              <div className="mt-4 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={data}
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                  >
                    <XAxis dataKey="month" stroke="#a1a1aa" fontSize={12} />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#059669" // Using emerald-600 hex
                      strokeWidth={3}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Delivery Performance and Area Activity Row */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
            {/* Delivery Performance KPIs (takes 2 columns) */}
            <div className="md:col-span-2 grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-gray-600 text-xs font-medium">
                  Avg. Delivery Time
                </h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">45 mins</p>
                <p className="text-xs text-red-500 font-medium flex items-center">
                  <span className="material-symbols-outlined text-base">
                    trending_down
                  </span>
                  -5%
                </p>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-gray-600 text-xs font-medium">
                  On-Time Rate
                </h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">95%</p>
                <p className="text-xs text-green-500 font-medium flex items-center">
                  <span className="material-symbols-outlined text-base">
                    trending_up
                  </span>
                  +2%
                </p>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-gray-600 text-xs font-medium">
                  Completed Deliveries
                </h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">5,000</p>
                <p className="text-xs text-green-500 font-medium flex items-center">
                  <span className="material-symbols-outlined text-base">
                    trending_up
                  </span>
                  +10%
                </p>
              </div>
            </div>

            {/* Vendor Activity by Area (takes 3 columns) */}
            <div className="md:col-span-3 bg-white p-6 rounded-2xl shadow-md border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Vendor Activity by Area
              </h3>
              <table className="w-full text-left border-t border-gray-100">
                <thead className="text-gray-600 text-xs font-semibold tracking-wider uppercase border-b border-gray-100">
                  <tr>
                    <th className="py-3 px-2">AREA</th>
                    <th className="py-3 px-2">ACTIVE VENDORS</th>
                    <th className="py-3 px-2">NEW VENDORS (30D)</th>
                    <th className="py-3 px-2">AVG. SALES (KES)</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 text-sm divide-y divide-gray-50">
                  {[
                    {
                      area: "Nairobi Central",
                      active: 25,
                      newVendors: 5,
                      sales: "150,000",
                    },
                    {
                      area: "Westlands",
                      active: 20,
                      newVendors: 3,
                      sales: "120,000",
                    },
                    {
                      area: "Kasarani",
                      active: 18,
                      newVendors: 2,
                      sales: "100,000",
                    },
                    {
                      area: "Ruiru",
                      active: 15,
                      newVendors: 1,
                      sales: "80,000",
                    },
                    {
                      area: "Thika",
                      active: 12,
                      newVendors: 0,
                      sales: "60,000",
                    },
                  ].map((row) => (
                    <tr key={row.area} className="hover:bg-gray-50">
                      <td className="py-3 px-2 font-medium">{row.area}</td>
                      <td className="py-3 px-2">{row.active}</td>
                      <td className="py-3 px-2">{row.newVendors}</td>
                      <td className="py-3 px-2 font-semibold">
                        KES {row.sales}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
