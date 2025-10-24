import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/vendorComponents/Header";
import Sidebar from "../components/vendorComponents/Sidebar";
import SearchBar from "../components/vendorComponents/SearchBar";
import ProductCard from "../components/vendorComponents/ProductCard";
import VendorCart from "../components/vendorComponents/VendorCart";
import BulkOrdersList from "../vendor/BulkOrdersList";
import { fetchBulkProducts } from "../api/bulkProducts";
import { useAuth } from "../context/AuthContext";
import { useBulkCart } from "../context/BulkCartContext";
import { Loader2 } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || "";
const placeholder = "https://img.icons8.com/color/96/000000/cucumber.png";

const resolveImage = (imagePath) => {
  if (!imagePath || imagePath.startsWith("http")) return imagePath || placeholder;
  return `${API_BASE.replace(/\/$/, "")}${imagePath.startsWith("/") ? imagePath : `/${imagePath}`}`;
};

const Farmily = () => {
  const { user } = useAuth();
  const { items: cartItems, addItem } = useBulkCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("none");
  const [bulkProducts, setBulkProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCartVisible, setIsCartVisible] = useState(false);

  // ✅ Fetch products only once
  const loadBulkProducts = useCallback(async () => {
    try {
      setLoading(true);
      const results = await fetchBulkProducts({ limit: 200 });
      setBulkProducts(Array.isArray(results) ? results : []);
    } catch (err) {
      console.error("Failed to fetch bulk products:", err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBulkProducts();
  }, [loadBulkProducts]);

  // ✅ Update filters whenever URL changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category") || "";
    const search = params.get("q") || "";
    setCategoryFilter(category);
    setSearchQuery(search);
  }, [location.search]);

  // ✅ Compute filtered list
  const filteredProducts = useMemo(() => {
    let products = [...bulkProducts];

    const query = searchQuery.trim().toLowerCase();
    if (query) {
      products = products.filter(
        (p) =>
          p.name?.toLowerCase().includes(query) ||
          p.ownerName?.toLowerCase().includes(query) ||
          p.owner?.name?.toLowerCase().includes(query)
      );
    }

    if (categoryFilter) {
      products = products.filter(
        (p) => p.category?.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    if (priceFilter === "Low to High") products.sort((a, b) => a.price - b.price);
    else if (priceFilter === "High to Low") products.sort((a, b) => b.price - a.price);

    return products.map((p) => ({
      id: p._id || p.id,
      title: p.name || "Untitled Product",
      farmer: p.ownerName || p.owner?.name || "Farmer",
      price: p.price ? `KES ${p.price}` : "N/A",
      image: resolveImage(p.imagePath || p.image),
      category: p.category || "Uncategorized",
      __raw: p,
    }));
  }, [bulkProducts, searchQuery, categoryFilter, priceFilter]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const params = new URLSearchParams(location.search);
    if (query) params.set("q", query);
    else params.delete("q");
    navigate(`/farmily?${params.toString()}`, { replace: true });
  };

  const handleAddToCart = (product) => {
    addItem(product, 1);
    setIsCartVisible(true);
    setTimeout(() => setIsCartVisible(false), 3000);
  };

  const params = new URLSearchParams(location.search);
  const currentView = params.get("view");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header avatarUrl={user?.avatar} userName={user?.name || "Vendor"} />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight">Farmily Marketplace</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Explore bulk farm products directly from farmers.
            </p>
          </div>

          <SearchBar
            onSearch={handleSearch}
            onCategoryChange={setCategoryFilter}
            onPriceChange={setPriceFilter}
            initialQuery={searchQuery}
          />

          {currentView === "bulk-orders" ? (
            <BulkOrdersList />
          ) : loading ? (
            <div className="py-10 text-center text-gray-600 dark:text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
              Loading farmily products...
            </div>
          ) : error ? (
            <div className="py-10 text-center text-red-600">{error}</div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-10 text-center text-gray-600 dark:text-gray-400">
              No products found for this category or search.
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} onAdd={() => handleAddToCart(p)} />
              ))}
            </div>
          )}

          {isCartVisible && cartItems.length > 0 && (
            <div className="fixed top-1/4 right-0 z-50 transition-transform duration-300">
              <VendorCart onClose={() => setIsCartVisible(false)} />
            </div>
          )}

          {cartItems.length > 0 && !isCartVisible && (
            <button
              onClick={() => setIsCartVisible(true)}
              className="fixed bottom-10 right-10 bg-emerald-600 text-white p-3 rounded-full shadow-lg hover:bg-emerald-700 transition"
            >
              <div className="relative">
                <span className="material-symbols-outlined text-2xl">shopping_cart</span>
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItems.length}
                </span>
              </div>
            </button>
          )}
        </main>
      </div>
    </div>
  );
};

export default Farmily;
