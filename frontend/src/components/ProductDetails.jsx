// frontend/src/components/ProductDetails.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import { vendors, RECOMMENDATIONS, sampleProducts } from "../constants";
import { useCart } from "../context/CartContext";
import { fetchProduct } from "../api/products";

const DEFAULT_PLACEHOLDER =
  "https://images.unsplash.com/photo-1518976024611-0a4e3d1c9f05?auto=format&fit=crop&w=1200&q=60";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setProduct(null);

    fetchProduct(id)
      .then((data) => {
        if (!mounted) return;
        if (data && typeof data === "object") {
          setProduct(data);
        } else {
          // backend returned something unexpected
          console.warn("fetchProduct returned unexpected data:", data);
          setProduct(null);
        }
      })
      .catch((err) => {
        console.warn(
          "fetchProduct error - falling back to local sampleProducts:",
          err?.message || err
        );
        // Fallback: try to find product in local sampleProducts (developer convenience)
        const local = (sampleProducts || []).find(
          (p) => String(p.id) === String(id)
        );
        if (local) {
          console.info("Using local sampleProducts fallback for", id);
          setProduct(local);
        } else {
          setProduct(null);
        }
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div>Loading product...</div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We couldn't find the product you're looking for.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700"
            >
              Go Back
            </button>
            <Link
              to="/marketplace"
              className="px-4 py-2 rounded bg-emerald-400 text-white"
            >
              View Marketplace
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const vendorInfo =
    vendors.find(
      (v) =>
        v.name === product.vendor ||
        v.id === product.vendorId ||
        v.name === (product.vendor && product.vendor.name)
    ) || null;

  const vendorName = product.vendor?.name ?? product.vendor ?? "Vendor";

  // normalize image path (attempt to use imagePath or img)
  const API_BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "");
  const imageSrc =
    product.imagePath && typeof product.imagePath === "string"
      ? product.imagePath.startsWith("http")
        ? product.imagePath
        : `${API_BASE || ""}${
            product.imagePath.startsWith("/")
              ? product.imagePath
              : `/${product.imagePath}`
          }`
      : product.img || product.image || DEFAULT_PLACEHOLDER;

  const handleAddToCart = () => {
    addItem(
      {
        id: product._id || product.id,
        title: product.title || product.name,
        priceLabel: product.priceLabel || product.price || "",
        img: imageSrc,
        vendor: product.vendor || vendorName,
      },
      1
    );
  };

  const handleViewVendor = () => {
    const slug = (vendorName || "").replace(/\s+/g, "-").toLowerCase();
    navigate(`/vendor/${slug}`);
  };

  const handleAddRecommendation = (r) => {
    addItem(
      {
        id: r.id,
        title: r.title,
        price: r.price ?? "",
        img: r.img,
        vendor: r.vendor ?? "Vendor",
      },
      1
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <div className="mb-6">
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-emerald-500"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Marketplace
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700">
              <img
                src={imageSrc}
                alt={product.title || product.name}
                loading="lazy"
                className="w-full h-full object-cover"
                onError={(e) => (e.currentTarget.src = DEFAULT_PLACEHOLDER)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {product.category ?? ""}
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-1">
                {product.title || product.name}
              </h1>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                {product.description}
              </p>
            </div>

            <div className="text-3xl font-bold text-emerald-400">
              {product.priceLabel ?? product.price ?? ""}
            </div>

            <div className="border-t border-b border-gray-200 dark:border-gray-700 py-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Vendor Information
              </h3>
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-full bg-center bg-cover flex-shrink-0"
                  style={{
                    backgroundImage: vendorInfo
                      ? `url("${vendorInfo.img}")`
                      : undefined,
                  }}
                  aria-hidden
                />
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">
                    {product.vendor?.name ?? product.vendor ?? vendorName}
                  </p>
                  {vendorInfo?.location && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {vendorInfo.location}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <span className="material-symbols-outlined text-lg">
                  local_shipping
                </span>
                <span>
                  Estimated Delivery: {product.deliveryEstimate ?? "25 minutes"}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <div className="flex items-center">
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {vendorInfo?.rating ?? "4.8"}
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                  {vendorInfo?.reviews ?? "120"} reviews
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 px-6 rounded-lg bg-emerald-400 hover:bg-emerald-500 text-white font-bold text-center transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">
                  add_shopping_cart
                </span>{" "}
                Add to Cart
              </button>

              <button
                onClick={handleViewVendor}
                className="flex-1 py-3 px-6 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold text-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">storefront</span>{" "}
                View Vendor
              </button>
            </div>
          </div>
        </div>

        {/* Recommendations (unchanged) */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {RECOMMENDATIONS.map((r) => (
              <div key={r.id} className="group relative">
                <Link to={`/product/${r.id}`}>
                  <div className="aspect-square rounded-lg bg-gray-200 dark:bg-gray-700 overflow-hidden mb-3">
                    <div
                      className="w-full h-full bg-center bg-no-repeat bg-cover group-hover:scale-105 transition-transform duration-300"
                      style={{ backgroundImage: `url("${r.img}")` }}
                    />
                  </div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-emerald-400 transition-colors">
                    {r.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {r.price}
                  </p>
                </Link>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddRecommendation(r);
                  }}
                  aria-label={`Add ${r.title} to cart`}
                  className="absolute top-2 right-2 p-2 rounded-full bg-white/70 dark:bg-gray-800/70 text-gray-800 dark:text-gray-200 hover:bg-emerald-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                >
                  <span className="material-symbols-outlined">
                    add_shopping_cart
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
