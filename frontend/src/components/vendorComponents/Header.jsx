import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { DEFAULT_AVATAR_MAP } from "../../constants";
import { useAuth } from "../../context/AuthContext";
import { Bell } from "lucide-react";

const Header = ({
  navItems = [
    { label: "Dashboard", to: "/vendordashboard", icon: "grid_view" },
    { label: "Orders", to: "/ordermanagement", icon: "shopping_cart" },
    { label: "Products", to: "/vendorproducts", icon: "inventory_2" },
    { label: "Payments", to: "/vendorwallet", icon: "paid" },
    { label: "Farm-ily Market", to: "/farmily", icon: "agriculture" },
  ],
  userName = "Vendor",
  unreadCount = 0, // FIX: Accept unreadCount prop
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const finalAvatarUrl =
    user?.avatar ||
    DEFAULT_AVATAR_MAP[user?.role] ||
    DEFAULT_AVATAR_MAP.unknown;

  const handleOpenProfile = () => {
    navigate("/vendorprofile");
    setMobileOpen(false);
  };

  const handleViewNotifications = () => {
    navigate("/vendordashboard");
  };

  const linkClass = (isActive) =>
    `text-sm font-medium flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
      isActive
        ? "text-emerald-700 bg-emerald-100 dark:bg-emerald-700/20 dark:text-emerald-300"
        : "text-gray-700 hover:text-emerald-600 dark:text-gray-200 dark:hover:text-emerald-300"
    }`;

  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-emerald-200/70 dark:border-emerald-700/60">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* left: logo */}
          <div className="flex items-center gap-4">
            <svg
              className="text-emerald-600 w-8 h-8"
              fill="none"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"
                fill="currentColor"
              />
            </svg>

            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Mboga Fresh
            </h2>
          </div>

          {/* center: desktop nav */}
          <nav className="hidden md:flex items-center gap-3">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) => linkClass(isActive)}
              >
                {item.icon && (
                  <span
                    className="material-symbols-outlined text-base"
                    aria-hidden
                    title={item.icon}
                  >
                    {item.icon}
                  </span>
                )}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* right: mobile toggle + user */}
          <div className="flex items-center gap-3">
            {/* 1. NOTIFICATION BELL (Desktop) */}
            <button
              onClick={handleViewNotifications}
              className="relative p-2 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-700/20 transition"
              aria-label={`View ${unreadCount} new notifications`}
            >
              <Bell className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {unreadCount} {/* FIX: Display the count */}
                </span>
              )}
            </button>

            {/* mobile hamburger */}
            <button
              type="button"
              className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((s) => !s)}
            >
              <svg
                className="w-6 h-6 text-gray-700 dark:text-gray-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden
              >
                {mobileOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>

            {/* desktop user */}
            <div className="hidden md:flex items-center gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleOpenProfile}
                  className="w-10 h-10 rounded-full bg-center bg-cover focus:ring-2 focus:ring-emerald-300 dark:focus:ring-emerald-600"
                  style={{
                    backgroundImage: `url("${finalAvatarUrl}")`,
                  }}
                  aria-label="Open vendor profile"
                />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {user?.name || userName}
                </span>
              </div>
            </div>
          </div>

          {/* mobile nav */}
          {mobileOpen && (
            <nav className="md:hidden mt-2 pb-4 border-t border-emerald-200/50 dark:border-emerald-700/40">
              <ul className="flex flex-col gap-1 py-2">
                {navItems.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.to === "/"}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-2 rounded-md transition ${
                          isActive
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-700/20 dark:text-emerald-300"
                            : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800/60"
                        }`
                      }
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.icon && (
                        <span
                          className="material-symbols-outlined text-base"
                          aria-hidden
                        >
                          {item.icon}
                        </span>
                      )}
                      <span>{item.label}</span>
                    </NavLink>
                  </li>
                ))}

                {/* mobile avatar row: also clickable to profile */}
                <li className="mt-2 px-3">
                  <button
                    type="button"
                    onClick={handleOpenProfile}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    aria-label="Open vendor profile"
                  >
                    <div
                      className="w-9 h-9 rounded-full bg-center bg-cover"
                      style={{
                        backgroundImage: `url("${finalAvatarUrl}")`,
                      }}
                      aria-hidden
                    />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {user?.name || userName}
                    </span>
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
