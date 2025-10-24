import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const RiderHeader = ({ userAvatarUrl = "" }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Function to check if a path is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Navigation items with icons
  const navItems = [
    { label: "Dashboard", path: "/riderdashboard", icon: "dashboard" },
    { label: "Orders", path: "/riderdeliveryqueue", icon: "local_shipping" },
    { label: "Earnings", path: "/riderearnings", icon: "payments" }, // Changed from /vendorwallet to /riderearnings
    { label: "Help", path: "/riderhelp", icon: "help" },
  ];

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-green-200 px-6 py-4 bg-white dark:bg-gray-900">
      <button 
        onClick={() => navigate("/")}
        className="flex items-center gap-4 text-green-600 hover:opacity-80 transition-opacity"
        aria-label="Go to home"
      >
        <div className="w-10 h-10">
          <svg
            className="w-full h-full"
            fill="none"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold tracking-tighter text-gray-900 dark:text-gray-100">
          Mboga Fresh
        </h2>
      </button>

      <nav className="hidden md:flex items-center gap-3">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              isActive(item.path)
                ? "text-green-700 bg-green-100 dark:bg-green-700/20 dark:text-green-300"
                : "text-gray-700 hover:text-green-600 dark:text-gray-200 dark:hover:text-green-300"
            }`}
          >
            {item.icon === "dashboard" ? (
              // Custom symmetrical dashboard icon
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            ) : (
              <span className="material-symbols-outlined text-lg">
                {item.icon}
              </span>
            )}
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="flex items-center justify-end">
        {/* Profile icon/avatar with active state */}
        <div
          className={`h-10 w-10 rounded-full bg-cover bg-center cursor-pointer transition-all ${
            isActive("/riderprofile")
              ? "ring-2 ring-green-500 ring-offset-2 dark:ring-offset-gray-900"
              : "hover:opacity-80"
          }`}
          style={{
            backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBJvhCPfy-faTmiNp5FaD8U8OQDrurmKSUnSlYuQ2M14fH-YG6cSyDmfPQv316Sa4RaWG5adOiTrlQ6HjYDZjeSNmtOqWjsF3bGxuvj-3nBhufGuw33616fohvQFG4vxviW4rpjnuSGe95qI4-UobmFyYjCzyRUdYApeklvcJ-jx_Yp_M2wdXFzSMb4Q5eDRWObm8ty8xhDuFhgyu9PWpuLUcGgS1ELu0eAw7FolOnHmBzE6TjCegb2ctjgbhRNo9AH1F5KPK2lDcc")`,
          }}
          onClick={() => navigate("/riderprofile")}
          aria-label="Profile settings"
        />
      </div>
    </header>
  );
};

export default RiderHeader;
