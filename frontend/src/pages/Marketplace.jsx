// frontend/src/pages/Marketplace.jsx
import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import CategoryCard from "../components/CategoryCard";
import VendorCard from "../components/VendorCard";
import ProductCard from "../components/ProductCard";
import SearchInput from "../components/SearchInput";
import Footer from "../components/FooterSection";
import { categories, vendors, products } from "../constants";

const Marketplace = () => {
  const navigate = useNavigate();

  const goToCategory = useCallback(
    (slug) => navigate(`/category/${slug}`),
    [navigate]
  );
  const goToVendor = useCallback(
    (slug) => navigate(`/vendor/${slug}`),
    [navigate]
  );
  const goToProduct = useCallback(
    (id) => navigate(`/product/${id}`),
    [navigate]
  );

  const onSearch = (q) => {
    const trimmed = (q || "").trim();
    navigate(
      `/marketplace${trimmed ? `?query=${encodeURIComponent(trimmed)}` : ""}`
    );
  };

  const handleAddToCart = (product) => {
    // TODO: wire to CartContext (placeholder action)
    console.log("Add to cart:", product);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0f1a10] text-gray-900 dark:text-gray-100 font-sans">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-3">
            <Sidebar
              categories={categories}
              onCategoryClick={(slug) => goToCategory(slug)}
            />
          </aside>

          <section className="lg:col-span-9">
            <div className="space-y-12">
              {/* Categories */}
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Categories
                  </h2>
                  <SearchInput onSearch={onSearch} />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-4">
                  {categories.map((c) => (
                    <CategoryCard
                      key={c.id}
                      {...c}
                      onClick={() => goToCategory(c.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Vendors */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Featured Vendors
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {vendors.map((v) => (
                    <VendorCard
                      key={v.id}
                      {...v}
                      onClick={() => goToVendor(v.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Products */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Shop Fresh Produce
                  </h2>
                  <button
                    className="text-sm font-medium text-emerald-400 hover:underline"
                    onClick={() => navigate("/marketplace")}
                  >
                    View All
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((p) => (
                    <ProductCard
                      key={p.id}
                      {...p}
                      onView={() => goToProduct(p.id)}
                      onAdd={() => handleAddToCart(p)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Marketplace;
