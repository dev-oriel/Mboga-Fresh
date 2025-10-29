// frontend/src/components/vendorComponents/Sidebar.jsx
import React from "react";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import { vendorCategories } from "../../constants";

const Sidebar = ({ className = "" }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Only enable filtering inside /farmily route
  const isFarmily = location.pathname.startsWith("/farmily");
  const params = new URLSearchParams(location.search);
  const activeCategory = params.get("category") || "All Categories";

  const goToCategory = (categorySlug) => {
    if (!isFarmily) return; // ignore for other pages

    const category =
      !categorySlug || categorySlug === "products"
        ? "All Categories"
        : decodeURIComponent(categorySlug);

    // ✅ only navigate if it’s actually different
    if (category !== activeCategory) {
      const path =
        category === "All Categories"
          ? "/farmily"
          : `/farmily?category=${encodeURIComponent(category)}`;
      navigate(path);
    }
  };

  const isCategoryActive = (slug) => {
    if (!isFarmily) return false;
    if (slug === "products" && activeCategory === "All Categories") return true;
    return slug.toLowerCase() === activeCategory.toLowerCase();
  };

  const handleCartClick = () => {
    if (isFarmily) navigate("/farmily?view=full-cart");
    else navigate("/bulkcart");
  };

  const linkClass = ({ isActive }) =>
    `w-full text-left flex items-center gap-3 px-4 py-2 rounded-lg transition-colors font-medium 
     ${
       isActive
         ? "bg-emerald-100 dark:bg-emerald-700/20 text-emerald-600"
         : "text-gray-800 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-700/10"
     }`;

  return (
    <aside
      className={`w-80 flex-shrink-0 border-r border-emerald-200/70 dark:border-emerald-700/60 p-6 bg-white dark:bg-gray-900 ${className}`}
    >
      <div className="flex flex-col gap-8">
        <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          Farm-ily Marketplace
        </h1>

        {/* Product Categories - Always visible */}
        <nav className="flex flex-col gap-2" aria-label="Product categories">
          <span className="text-xs font-semibold text-gray-500 mb-1">
            PRODUCT CATEGORIES
          </span>
          {vendorCategories.map((c) => {
            const slug = c.to.split("/").pop();
            return (
              <button
                key={c.to}
                onClick={() => goToCategory(slug)}
                className={`w-full text-left flex items-center gap-3 px-4 py-2 rounded-lg transition-colors font-medium ${
                  isCategoryActive(slug)
                    ? "bg-emerald-100 dark:bg-emerald-700/20 text-emerald-600"
                    : "text-gray-800 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-700/10"
                }`}
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

          <button
            onClick={handleCartClick}
            className={linkClass({
              isActive:
                location.pathname.includes("/bulkcart") ||
                location.search.includes("view=full-cart"),
            })}
          >
            <span className="material-symbols-outlined">shopping_cart</span>
            <span>My Bulk Cart</span>
          </button>

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
