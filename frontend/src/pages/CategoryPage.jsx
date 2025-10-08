// frontend/src/pages/CategoryPage.jsx
import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/FooterSection";
import ProductGrid from "../components/ProductGrid";
import { categories, products } from "../constants";
import { useCart } from "../context/CartContext";

const CategoryPage = () => {
  const { id: categoryId } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  // find category for title (if available)
  const category = categories.find((c) => c.id === categoryId);

  // filtering strategy:
  // 1. product.category === categoryId
  // 2. product.categoryId === categoryId
  // 3. product.tags includes categoryId
  // if none match, we show a friendly message
  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (!p) return false;
      if (p.category === categoryId) return true;
      if (p.categoryId === categoryId) return true;
      if (Array.isArray(p.tags) && p.tags.includes(categoryId)) return true;
      // fallback: if product title includes category name (weak)
      if (
        category &&
        typeof p.title === "string" &&
        p.title.toLowerCase().includes(category.name.toLowerCase())
      )
        return true;
      return false;
    });
  }, [categoryId, category]);

  const handleAdd = (product) => {
    addItem(
      {
        id: product.id,
        title: product.title,
        price: product.price ?? product.priceLabel ?? "",
        img: product.img,
        vendor: product.vendor,
      },
      1
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0f1a10] text-gray-900 dark:text-gray-100">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-3">
            <Sidebar
              categories={categories}
              onCategoryClick={(slug) => navigate(`/category/${slug}`)}
            />
          </aside>

          <section className="lg:col-span-9">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {category ? category.name : `Category: ${categoryId}`}
              </h1>
              <button
                className="text-sm text-emerald-500"
                onClick={() => navigate("/marketplace")}
              >
                View All
              </button>
            </div>

            <ProductGrid
              products={filtered}
              onView={(id) => navigate(`/product/${id}`)}
              onAdd={handleAdd}
            />

            {filtered.length === 0 && (
              <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
                We couldn't find products for this category. Consider adding a
                `category` field to your products in{" "}
                <code>constants/index.js</code> or check other categories.
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
