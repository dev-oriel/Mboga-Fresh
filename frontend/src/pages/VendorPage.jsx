// frontend/src/pages/VendorPage.jsx
import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/FooterSection";
import ProductGrid from "../components/ProductGrid";
import { vendors, categories, sampleProducts } from "../constants";
import { useCart } from "../context/CartContext";

const VendorPage = () => {
  const { id: vendorId } = useParams(); // expected like "farmer-john"
  const navigate = useNavigate();
  const { addItem } = useCart();

  const vendor = vendors.find(
    (v) =>
      v.id === vendorId ||
      (v.name && v.name.replace(/\s+/g, "-").toLowerCase() === vendorId)
  );

  const filtered = useMemo(() => {
    return sampleProducts.filter((p) => {
      if (!p) return false;
      if (p.vendorId && p.vendorId === vendorId) return true;
      // some products store vendor as string name
      if (
        p.vendor &&
        typeof p.vendor === "string" &&
        p.vendor.toLowerCase().replace(/\s+/g, "-") === vendorId
      )
        return true;
      // fallback: vendor name includes
      if (
        vendor &&
        p.vendor &&
        typeof p.vendor === "string" &&
        p.vendor === vendor.name
      )
        return true;
      return false;
    });
  }, [vendorId, vendor]);

  const handleAdd = (sampleProducts) => {
    addItem(
      {
        id: sampleProducts.id,
        title: sampleProducts.title,
        price: sampleProducts.price ?? sampleProducts.priceLabel ?? "",
        img: sampleProducts.img,
        vendor: sampleProducts.vendor,
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
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {vendor ? vendor.name : `Vendor: ${vendorId}`}
                </h1>
                {vendor?.location && (
                  <p className="text-sm text-gray-500">{vendor.location}</p>
                )}
              </div>
              <button
                className="text-sm text-emerald-500"
                onClick={() => navigate("/marketplace")}
              >
                View All
              </button>
            </div>

            <productsGrid
              productss={filtered}
              onView={(id) => navigate(`/product/${id}`)}
              onAdd={handleAdd}
            />

            {filtered.length === 0 && (
              <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
                No products found for this vendor.
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VendorPage;
