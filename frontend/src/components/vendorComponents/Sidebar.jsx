import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { vendorCategories, sidebarLinks } from "../../constants";

/**
 * Sidebar (Farmily-scoped)
 * - category clicks -> /farmily?category=<slug>
 * - My Cart -> /farmily?view=cart (vendor cart)
 * - Orders & Deliveries -> /farmily?view=vendor-orders (vendor's order management)
 *
 * Keeps using vendorCategories and sidebarLinks from constants (no mutation required).
 */
const Sidebar = ({ className = "" }) => {
  const navigate = useNavigate();
  const { search, pathname } = useLocation();
  const params = new URLSearchParams(search);
  const activeCategory = params.get("category") || null;
  const activeView = params.get("view") || null;

  const goToCategory = (to) => {
    const parts = to.split("/");
    const slug = parts[parts.length - 1] || "";
    if (slug === "products" || slug === "") {
      navigate("/farmily");
    } else {
      navigate(`/farmily?category=${encodeURIComponent(slug)}`);
    }
  };

  const goToCart = () => navigate("/farmily?view=cart");
  const goToVendorOrders = () => navigate("/farmily?view=vendor-orders");

  return (
    <aside
      className={`w-80 flex-shrink-0 border-r border-emerald-200/70 dark:border-emerald-700/60 p-6 bg-white dark:bg-gray-900 ${className}`}
    >
      <div className="flex flex-col gap-8">
        <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          Farm-ily Marketplace
        </h1>

        <nav className="flex flex-col gap-2" aria-label="Product categories">
          {vendorCategories.map((c) => {
            const parts = c.to.split("/");
            const slug =
              parts[parts.length - 1] ||
              (c.to === "/products" ? "products" : "");
            const isActive =
              (slug === "products" &&
                activeCategory === null &&
                activeView !== "cart" &&
                activeView !== "vendor-orders") ||
              (slug && activeCategory === slug);

            return (
              <button
                key={c.to}
                onClick={() => goToCategory(c.to)}
                className={`w-full text-left flex items-center gap-3 px-4 py-2 rounded-lg transition-colors font-medium ${
                  isActive
                    ? "bg-emerald-100 dark:bg-emerald-700/20 text-emerald-600"
                    : "text-gray-800 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-700/10"
                }`}
                aria-current={isActive ? "true" : undefined}
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

        <nav className="flex flex-col gap-2" aria-label="Account links">
          {sidebarLinks.map((link) => {
            const isCartLink =
              link.to === "/cart" || link.to === "/shoppingcart";
            const isOrdersLink = link.to === "/orders";

            const isActive = isCartLink
              ? activeView === "cart"
              : isOrdersLink
              ? activeView === "vendor-orders"
              : pathname === link.to;

            // route internal vendor views for cart and vendor-orders
            const handleClick = () => {
              if (isCartLink) return goToCart();
              if (isOrdersLink) return goToVendorOrders();
              // otherwise navigate to the link directly (rare for vendor sidebar)
              navigate(link.to);
            };

            return (
              <button
                key={link.to}
                onClick={handleClick}
                className={`w-full text-left flex items-center gap-3 px-4 py-2 rounded-lg transition-colors font-medium ${
                  isActive
                    ? "bg-emerald-100 dark:bg-emerald-700/20 text-emerald-600"
                    : "text-gray-800 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-700/10"
                }`}
                aria-current={isActive ? "true" : undefined}
              >
                {link.icon && (
                  <span className="material-symbols-outlined" aria-hidden>
                    {link.icon}
                  </span>
                )}
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
