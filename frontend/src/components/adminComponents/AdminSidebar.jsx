import React from "react";
import { Link, useLocation } from "react-router-dom"; // ✅ Works fine with your existing setup
import logo from "../../assets/mboga-fresh-icon.png";
import {
  LayoutDashboard,
  Users,
  FileText,
  Scale,
  Truck,
  BarChart3,
  Package,
  ClipboardList,
} from "lucide-react";

const AdminSidebar = () => {
  const location = useLocation();

  const links = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admindashboard" },
    { name: "User Management", icon: Users, path: "/usermanagement" },
    { name: "Product Management", icon: Package, path: "/adminproducts" },
    {
      name: "Order Management",
      icon: ClipboardList,
      path: "/admin/ordermanagement",
    },
    { name: "Escrow & Payments", icon: FileText, path: "/adminescrow" },
    {
      name: "Dispute Resolution",
      icon: Scale,
      path: "/admindisputeresolution",
    },
    {
      name: "Delivery & Logistics",
      icon: Truck,
      path: "/deliveryandlogistics",
    },
    { name: "Reports & Analytics", icon: BarChart3, path: "/adminreports" },
  ];
  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      {/* Logo Section */}
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
        {links.map(({ name, icon: Icon, path }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={name}
              to={path}
              className={`flex items-center px-6 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-green-100 text-green-700 font-semibold"
                  : "text-gray-700 hover:text-green-700 hover:bg-green-50"
              }`}
            >
              <Icon className="w-4 h-4 mr-3" />
              {name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
