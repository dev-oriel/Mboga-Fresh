// frontend/src/components/Header.jsx
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

/**
 * Header component
 * Props:
 *  - cartCount (number) optional
 *  - avatarUrl (string) optional
 */
const Header = ({ cartCount = 0, avatarUrl } = {}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", to: "/" },
    { name: "Marketplace", to: "/marketplace" },
    { name: "Orders", to: "/orders" }, // create route later
    { name: "Help", to: "/help" }, // create route later
  ];

  const handleSubmitSearch = (e) => {
    e.preventDefault();
    const trimmed = (query || "").trim();
    // Navigate to /marketplace with query param if provided
    navigate(
      `/marketplace${trimmed ? `?query=${encodeURIComponent(trimmed)}` : ""}`
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-24 items-center justify-between">
          {/* Left: Logo + desktop nav */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate("/")}
              aria-label="Go to home"
              className="flex items-center gap-2"
            >
              <svg
                className="h-10 w-10 text-[#28A745]"
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
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

            {/* Desktop nav */}
            <nav
              className="hidden lg:flex items-center gap-8"
              aria-label="Main navigation"
            >
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    `text-base font-medium transition-colors ${
                      isActive
                        ? "text-[#1e7e34] border-[#1e7e34] pb-1"
                        : "text-gray-700 dark:text-gray-300 hover:text-[#1e7e34]"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Right: search, cart, avatar, mobile menu */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <form
              onSubmit={handleSubmitSearch}
              className="relative hidden md:block"
              role="search"
            >
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                />
              </svg>

              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full max-w-xs rounded-full border-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 py-2.5 pl-10 pr-6 text-sm focus:ring-2 focus:ring-[#28A745] focus:border-[#28A745] transition-all"
                placeholder="Search produce, vendors..."
                type="search"
                aria-label="Search produce and vendors"
              />
            </form>

            {/* Cart */}
            <button
              onClick={() => navigate("/cart")}
              className="relative p-1 rounded-md"
              aria-label="Go to cart"
              title="Cart"
            >
              <svg
                className="h-8 w-8 text-gray-600 dark:text-gray-300 hover:text-[#1e7e34] transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 7M7 13l-2 5m5-5v5m4-5v5m4-5l2 5"
                />
              </svg>

              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-[#28A745] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Avatar (go to profile/login) */}
            <button
              onClick={() => navigate("/login")}
              className="hidden lg:block group"
              aria-label="Open profile"
              title="Profile"
            >
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-12 h-12 ring-2 ring-transparent group-hover:ring-[#28A745] transition-all"
                style={{
                  backgroundImage: `url('${
                    avatarUrl ||
                    "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=512&h=512&fit=crop&auto=format"
                  }')`,
                }}
              />
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen((s) => !s)}
              className="lg:hidden text-gray-600 dark:text-gray-300 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle menu"
            >
              <span className="material-symbols-outlined text-3xl">menu</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu (collapsible) */}
      <div
        id="mobile-menu"
        className={`lg:hidden border-t border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 transition-[max-height] overflow-hidden ${
          mobileOpen ? "max-h-[500px]" : "max-h-0"
        }`}
        aria-hidden={!mobileOpen}
      >
        <div className="container mx-auto px-4 py-4">
          <nav className="flex flex-col gap-3" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? "text-[#1e7e34] bg-gray-100 dark:bg-gray-800"
                      : "text-gray-700 dark:text-gray-300"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            {/* small search for mobile */}
            <form onSubmit={handleSubmitSearch} className="mt-2" role="search">
              <label htmlFor="mobile-search" className="sr-only">
                Search
              </label>
              <div className="relative">
                <input
                  id="mobile-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search produce, vendors..."
                  className="w-full rounded-full border-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 py-2.5 pl-4 pr-10 text-sm focus:ring-2 focus:ring-[#28A745] focus:border-[#28A745]"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 rounded-full bg-[#28A745] text-white text-sm"
                >
                  Go
                </button>
              </div>
            </form>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
