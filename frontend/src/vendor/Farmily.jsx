// frontend/src/vendor/Farmily.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/vendorComponents/Header";
import Sidebar from "../components/vendorComponents/Sidebar";
import SearchBar from "../components/vendorComponents/SearchBar";
import ProductCard from "../components/vendorComponents/ProductCard";
import VendorCart from "../components/vendorComponents/VendorCart";
import VendorOrders from "../components/vendorComponents/VendorOrders";
import { fetchBulkProducts } from "../api/bulkProducts";
import { useAuth } from "../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE || "";

const placeholder =
  "https://images.unsplash.com/photo-1518976024611-0a4e3d1c9f05?auto=format&fit=crop&w=1200&q=60";

const resolveImage = (imagePath) => {
  if (!imagePath) return placeholder;
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://"))
    return imagePath;
  if (API_BASE)
    return `${API_BASE.replace(/\/$/, "")}${
      imagePath.startsWith("/") ? imagePath : `/${imagePath}`
    }`;
  return `${window.location.origin}${
    imagePath.startsWith("/") ? imagePath : `/${imagePath}`
  }`;
};

const Farmily = () => {
  const { user } = useAuth();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const category = params.get("category"); // e.g. "vegetables"
  const view = params.get("view"); // e.g. "cart" or "vendor-orders"

  const [bulkProducts, setBulkProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch bulk products from backend. Use `q` param for simple search if category provided.
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    const q = category || undefined;

    (async () => {
      try {
        // ask server for relevant bulk products
        const results = await fetchBulkProducts(
          q ? { q, limit: 200 } : { limit: 200 }
        );
        if (!mounted) return;
        setBulkProducts(Array.isArray(results) ? results : []);
      } catch (err) {
        console.error("Failed to fetch bulk products", err);
        if (!mounted) return;
        setError(
          typeof err === "string" ? err : err?.message || "Failed to fetch"
        );
        setBulkProducts([]);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [category]);

  // Map backend bulk product shape -> ProductCard shape
  const visibleProducts = useMemo(() => {
    if (view === "cart" || view === "vendor-orders") return [];
    if (!bulkProducts || bulkProducts.length === 0) return [];
    return bulkProducts.map((p) => {
      // ownerName convenience (backend may set it) or populated ownerId.name
      const ownerName =
        p.ownerName || (p.ownerId && p.ownerId.name) || p.owner?.name;

      return {
        id: p._id || p.id,
        title: p.name || p.title || "Untitled",
        farmer: ownerName || "Farmer",
        price:
          p.priceLabel ||
          (typeof p.price !== "undefined" ? `KES ${p.price}` : ""),
        image: resolveImage(p.imagePath || p.image || ""),
        __raw: p,
      };
    });
  }, [bulkProducts, view]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header
        avatarUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuDeL7radWSj-FEteEjqLpufXII3-tc_o7GMvLvB07AaD_bYBkfAcIOnNbOXkTdMOHRgJQwLZE-Z_iw72Bd8bpHzfXP_m0pIvteSw7FKZ1qV9GD1KfgyDVG90bCO7OGe6JyYIkm9DBo2ArC60uEqSfDvnnYWeo6IqVEjWxsVX6dUoxjm9ozyVlriiMdVLc_jU9ZxS01QcxNa8hn-ePNbB6IcXSwExf2U61R-epab8nsOkbq95E7z6b-fH4zOt0j2MPt20nrqtPM1NHI"
        userName={user?.name || "Vendor"}
      />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight">
              Buy Fresh Produce Directly from Farmers
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Karibu Farm-ily! Explore a wide range of farm-fresh products
              sourced directly from local farmers.
            </p>
            {category && (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Showing results for{" "}
                <strong className="text-gray-800 dark:text-gray-100">
                  {category}
                </strong>
              </p>
            )}
          </div>

          <SearchBar />

          {view === "cart" ? (
            <VendorCart />
          ) : view === "vendor-orders" ? (
            <VendorOrders />
          ) : (
            <div>
              {loading ? (
                <div className="py-10 text-center text-gray-600 dark:text-gray-400">
                  Loading farmily products...
                </div>
              ) : error ? (
                <div className="py-10 text-center text-red-600">
                  Error loading products: {String(error)}
                </div>
              ) : visibleProducts.length === 0 ? (
                <div className="col-span-full py-10 text-center text-gray-600 dark:text-gray-400">
                  No products found for this category.
                </div>
              ) : (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6">
                  {visibleProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Farmily;
