import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Added useNavigate
import Header from "../components/vendorComponents/Header";
import Sidebar from "../components/vendorComponents/Sidebar";
import SearchBar from "../components/vendorComponents/SearchBar";
import ProductCard from "../components/vendorComponents/ProductCard";
import VendorCart from "../components/vendorComponents/VendorCart"; // B2B Cart Preview
import BulkOrdersList from "../vendor/BulkOrdersList";

import { fetchBulkProducts } from "../api/bulkProducts";
import { useAuth } from "../context/AuthContext";
import { useBulkCart } from "../context/BulkCartContext"; // CRITICAL: Use Bulk Cart
import { Loader2 } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || "";

const placeholder = "https://img.icons8.com/color/96/000000/cucumber.png";

const resolveImage = (imagePath) => {
  if (!imagePath || imagePath.startsWith("http"))
    return imagePath || placeholder;

  return `${API_BASE.replace(/\/$/, "")}${
    imagePath.startsWith("/") ? imagePath : `/${imagePath}`
  }`;
};

const Farmily = () => {
  const { user } = useAuth();
  const { items: cartItems, addItem } = useBulkCart();
  const navigate = useNavigate(); // For navigation

  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const category = params.get("category");
  const [searchQuery, setSearchQuery] = useState(params.get("q") || "");

  const [bulkProducts, setBulkProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCartVisible, setIsCartVisible] = useState(false); // State to control cart flyout

  // Fetch bulk products from backend. Use query/category filters.
  const loadBulkProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    const q = searchQuery.trim() || undefined;

    try {
      const results = await fetchBulkProducts(
        q ? { q, category, limit: 200 } : { category, limit: 200 }
      );
      setBulkProducts(Array.isArray(results) ? results : []);
    } catch (err) {
      console.error("Failed to fetch bulk products", err);
      setError(
        typeof err === "string"
          ? err
          : err?.message || "Failed to fetch bulk products"
      );
      setBulkProducts([]);
    } finally {
      setLoading(false);
    }
  }, [category, searchQuery]);

  useEffect(() => {
    loadBulkProducts();
  }, [loadBulkProducts]);

  // Map backend bulk product shape -> ProductCard shape
  const visibleProducts = useMemo(() => {
    return bulkProducts.map((p) => {
      const ownerName =
        p.ownerName ||
        (p.ownerId && p.ownerId.name) ||
        p.owner?.name ||
        "Farmer";

      return {
        id: p._id || p.id,
        title: p.name || p.title || "Untitled",
        farmer: ownerName,
        price:
          p.priceLabel ||
          (typeof p.price !== "undefined" ? `KES ${p.price}` : ""),
        image: resolveImage(p.imagePath || p.image || ""),
        __raw: p,
      };
    });
  }, [bulkProducts]);

  const handleSearch = (q) => {
    setSearchQuery(q);
  };

  const handleAddToCart = (product) => {
    addItem(product, 1); // Add to the bulk cart
    setIsCartVisible(true); // Show cart preview on add
    // Optional: Set a timeout to hide the cart automatically
    setTimeout(() => setIsCartVisible(false), 3000);
  };

  const handleSidebarNavigation = (view) => {
    if (view === "cart") {
      setIsCartVisible(true);
      // Do not navigate, just show the flyout/modal
    } else if (view === "bulk-orders") {
      navigate("/bulkorders"); // Navigate to dedicated page
    }
  };

  // --- RENDER LOGIC ---

  // RENDER the cart full-page if accessed directly via URL, otherwise render the marketplace.
  const currentView = params.get("view");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header avatarUrl={user?.avatar} userName={user?.name || "Vendor"} />

      <div className="flex">
        <Sidebar onNavigation={handleSidebarNavigation} />{" "}
        {/* Pass navigation handler */}
        <main className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight">
              Bulk Marketplace (Farm-ily)
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Source bulk fresh produce directly from farmers.
            </p>
          </div>

          <SearchBar onSearch={handleSearch} initialQuery={searchQuery} />

          {currentView === "full-cart" ? (
            // If a dedicated full cart page is built, render it here
            <VendorCart />
          ) : currentView === "bulk-orders" ? (
            // If B2B orders list is accessed via URL
            <BulkOrdersList />
          ) : (
            <div>
              {loading ? (
                <div className="py-10 text-center text-gray-600 dark:text-gray-400">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                  Loading farmily products...
                </div>
              ) : error ? (
                <div className="py-10 text-center text-red-600">
                  Error loading products: {String(error)}
                </div>
              ) : visibleProducts.length === 0 ? (
                <div className="col-span-full py-10 text-center text-gray-600 dark:text-gray-400">
                  No bulk products found matching your search/filters.
                </div>
              ) : (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6">
                  {visibleProducts.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onAdd={() => handleAddToCart(p)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* BULK CART FLYOUT */}
          {isCartVisible && cartItems.length > 0 && (
            <div className="fixed top-1/4 right-0 z-50 transform translate-x-0 transition-transform duration-300">
              <VendorCart onClose={() => setIsCartVisible(false)} />
            </div>
          )}

          {/* Floating Cart Button for visibility */}
          {cartItems.length > 0 && !isCartVisible && (
            <button
              onClick={() => setIsCartVisible(true)}
              className="fixed bottom-10 right-10 bg-emerald-600 text-white p-3 rounded-full shadow-lg hover:bg-emerald-700 transition"
            >
              <span className="material-symbols-outlined">shopping_cart</span>
              <span className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full">
                {cartItems.length}
              </span>
            </button>
          )}
        </main>
      </div>
    </div>
  );
};

export default Farmily;
