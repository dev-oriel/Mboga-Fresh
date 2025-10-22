import React from "react";
import logo from "../../assets/mboga-fresh-icon.png"; // ✅ Import your logo
import {
  LayoutDashboard,
  Users,
  FileText,
  Scale,
  Truck,
  BarChart3,
} from "lucide-react";

const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      {/* Logo and brand name */}
      <div className="flex items-center px-6 py-4 border-b border-gray-100">
        <img
          src={logo}
          alt="Mboga Fresh Logo"
          className="w-8 h-8 object-contain"
        />
        <span className="ml-2 text-lg font-semibold text-gray-800">
          Mboga Fresh
        </span>
      </div>

      {/* Navigation */}
      <nav className="mt-4 space-y-1 flex-1">
        <a
          href="#"
          className="flex items-center px-6 py-2 text-gray-700 hover:text-green-700 hover:bg-green-50 transition-colors"
        >
          <LayoutDashboard className="w-4 h-4 mr-3" /> Dashboard
        </a>
        <a
          href="#"
          className="flex items-center px-6 py-2 text-gray-700 hover:text-green-700 hover:bg-green-50 transition-colors"
        >
          <Users className="w-4 h-4 mr-3" /> User Management
        </a>
        <a
          href="#"
          className="flex items-center px-6 py-2 text-gray-700 hover:text-green-700 hover:bg-green-50 transition-colors"
        >
          <FileText className="w-4 h-4 mr-3" /> Escrow & Payments
        </a>
        <a
          href="#"
          className="flex items-center px-6 py-2 text-gray-700 hover:text-green-700 hover:bg-green-50 transition-colors"
        >
          <Scale className="w-4 h-4 mr-3" /> Dispute Resolution
        </a>
        <a
          href="#"
          className="flex items-center px-6 py-2 text-gray-700 hover:text-green-700 hover:bg-green-50 transition-colors"
        >
          <Truck className="w-4 h-4 mr-3" /> Delivery & Logistics
        </a>
        <a
          href="#"
          className="flex items-center px-6 py-2 text-gray-700 hover:text-green-700 hover:bg-green-50 transition-colors"
        >
          <BarChart3 className="w-4 h-4 mr-3" /> Reports & Analytics
        </a>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
