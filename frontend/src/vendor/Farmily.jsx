import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/vendorComponents/Header";
import Sidebar from "../components/vendorComponents/Sidebar";
import SearchBar from "../components/vendorComponents/SearchBar";
import ProductCard from "../components/vendorComponents/ProductCard";
import VendorCart from "../components/vendorComponents/VendorCart";
import VendorOrders from "../components/vendorComponents/VendorOrders";
import { sampleProducts } from "../constants";

const Farmily = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const category = params.get("category"); // e.g. "vegetables"
  const view = params.get("view"); // e.g. "cart" or "vendor-orders"

  const visibleProducts = useMemo(() => {
    if (view === "cart" || view === "vendor-orders") return [];
    if (!category) return sampleProducts;
    const slug = category.toLowerCase();
    return sampleProducts.filter((p) => {
      if (!p.category) return false;
      const pSlug = String(p.category).toLowerCase();
      return pSlug.includes(slug);
    });
  }, [category, view]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header avatarUrl="..." userName="Daniel Mutuku" />

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
            <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6">
              {visibleProducts.length === 0 ? (
                <div className="col-span-full py-10 text-center text-gray-600 dark:text-gray-400">
                  No products found for this category.
                </div>
              ) : (
                visibleProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Farmily;
