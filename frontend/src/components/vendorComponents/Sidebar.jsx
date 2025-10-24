// frontend/src/components/vendorComponents/Sidebar.jsx

import React from "react";
import { useLocation, useNavigate, NavLink } from "react-router-dom"; // Added NavLink
import { vendorCategories } from "../../constants"; // Removed sidebarLinks as we hardcode the two new links

/**
 * Sidebar component for the Bulk Marketplace (Farmily).
 * NOTE: The cart button no longer navigates, it triggers the cart flyout controlled by Farmily.jsx.
 */
const Sidebar = ({ className = "" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const activeCategory = params.get("category") || null;

  // Define the specific links outside of the general marketplace flow
  const customLinks = [
    {
      label: "My Bulk Cart",
      path: "/bulkcart",
      icon: "shopping_cart",
      isExternal: false,
    }, // Handled as a flyout/modal
    {
      label: "Bulk Orders",
      path: "/bulkorders",
      icon: "receipt_long",
      isExternal: true,
    }, // Dedicated B2B order page
  ];

  const goToCategory = (categorySlug) => {
    // Navigating to the base path with a query param to filter products
    const path =
      categorySlug === "products" || !categorySlug
        ? "/farmily"
        : `/farmily?category=${encodeURIComponent(categorySlug)}`;
    navigate(path);
  };

  // Helper to determine if a category link is active
  const isCategoryActive = (slug) => {
    if (slug === "products" && activeCategory === null) return true;
    if (slug === activeCategory) return true;
    return false;
  };

  // Helper for general NavLink styling
  const linkClass = ({ isActive }) =>
    `w-full text-left flex items-center gap-3 px-4 py-2 rounded-lg transition-colors font-medium 
         ${
           isActive
             ? "bg-emerald-100 dark:bg-emerald-700/20 text-emerald-600"
             : "text-gray-800 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-700/10"
         }`;

  // Handler for the Bulk Cart link (should show a flyout, not navigate to a full page)
  const handleCartClick = () => {
    // NOTE: In Farmily.jsx, you need to check if the path is /bulkcart OR the cart flyout state is active.
    navigate("/farmily?view=full-cart"); // Temporarily navigate to simulate full-page cart view/checkout
  };

  return (
    <aside
      className={`w-80 flex-shrink-0 border-r border-emerald-200/70 dark:border-emerald-700/60 p-6 bg-white dark:bg-gray-900 ${className}`}
    >
      <div className="flex flex-col gap-8">
        <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          Farm-ily Marketplace
        </h1>

        <nav className="flex flex-col gap-2" aria-label="Product categories">
          <span className="text-xs font-semibold text-gray-500 mb-1">
            PRODUCT CATEGORIES
          </span>
          {vendorCategories.map((c) => {
            const parts = c.to.split("/");
            const slug = parts[parts.length - 1] || "";

            return (
              <button
                key={c.to}
                onClick={() => goToCategory(slug)}
                className={`w-full text-left flex items-center gap-3 px-4 py-2 rounded-lg transition-colors font-medium 
                                    ${
                                      isCategoryActive(slug)
                                        ? "bg-emerald-100 dark:bg-emerald-700/20 text-emerald-600"
                                        : "text-gray-800 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-700/10"
                                    }`}
                aria-current={isCategoryActive(slug) ? "true" : undefined}
              >
                {c.icon && (
                  <span className="material-symbols-outlined" aria-hidden>
                    {c.icon}
                  </span>
                )}
                <span>{c.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-emerald-200/60 dark:border-emerald-700/40 my-4" />

        <nav className="flex flex-col gap-2" aria-label="Bulk Management Links">
          <span className="text-xs font-semibold text-gray-500 mb-1">
            MANAGE ORDERS & CART
          </span>

          {/* Bulk Cart Button (Click should show flyout/modal, navigate only on checkout) */}
          <button
            onClick={handleCartClick}
            className={linkClass({
              isActive: location.pathname === "/bulkcart",
            })}
          >
            <span className="material-symbols-outlined">shopping_cart</span>
            <span>My Bulk Cart</span>
          </button>

          {/* Bulk Orders/Quotes Button */}
          <NavLink to="/bulkorders" className={linkClass}>
            <span className="material-symbols-outlined">receipt_long</span>
            <span>Bulk Orders/Quotes</span>
          </NavLink>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
