import React from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { DEFAULT_AVATAR_MAP } from "../../constants";

const RiderHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const userName = user?.name ?? user?.fullName ?? "Rider";
  const avatarSrc = user?.avatar || DEFAULT_AVATAR_MAP.rider;

  const isActive = (path) => location.pathname === path;

  // Navigation items (consistent with rider's workflow)
  const navItems = [
    { label: "Dashboard", path: "/riderdashboard", icon: "dashboard" },
    { label: "Orders", path: "/riderdeliveryqueue", icon: "local_shipping" },
    { label: "Earnings", path: "/riderearnings", icon: "payments" },
    { label: "Help", path: "/riderhelp", icon: "help" },
  ];

  const linkClass = (path) =>
    `text-base font-medium flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
      isActive(path)
        ? "text-emerald-700 border-emerald-700 pb-1"
        : "text-gray-700 hover:text-emerald-700 dark:text-gray-300"
    }`;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-24 items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Logo/Brand Section (Larger Font for Consistency) */}
            <button
              onClick={() => navigate("/riderdashboard")}
              aria-label="Go to Rider Dashboard"
              className="flex items-center gap-2"
            >
              <svg
                className="h-10 w-10 text-emerald-600"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"
                  fill="currentColor"
                />
              </svg>
              <span className="text-3xl font-bold text-gray-900 dark:text-white tracking-tighter">
                Mboga Fresh
              </span>
            </button>

            {/* Navigation Links */}
            <nav
              className="hidden lg:flex items-center gap-4"
              aria-label="Rider navigation"
            >
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={() => linkClass(item.path)}
                >
                  <span
                    className="material-symbols-outlined text-lg"
                    aria-hidden
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Profile Section (Desktop) - Displays Name */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {userName}
                </div>
                <div className="text-xs text-gray-500">Rider</div>
              </div>

              <button
                onClick={() => navigate("/riderprofile")}
                aria-label="Open profile settings"
                className="group w-12 h-12 rounded-full focus:ring-2 focus:ring-emerald-400"
              >
                <img
                  src={avatarSrc}
                  alt={userName}
                  className="w-full h-full object-cover rounded-full"
                />
              </button>


            </div>

            {/* Mobile Hamburger (You'll need a separate mobile menu implementation) */}
            <button
              className="lg:hidden text-gray-600 p-2"
              aria-label="Toggle menu"
            >
              <span className="material-symbols-outlined text-3xl">menu</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default RiderHeader;
