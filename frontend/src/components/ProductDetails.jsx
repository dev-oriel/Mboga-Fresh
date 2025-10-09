// frontend/src/components/ProductDetails.jsx
import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import { products, vendors, RECOMMENDATIONS } from "../constants";
import { useCart } from "../context/CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  // Try to find product from constants; fall back to undefined
  const product = products.find((p) => p.id === id);

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

  const vendorInfo = vendors.find(
    (v) =>
      v.name === product.vendor ||
      v.id === product.vendorId ||
      v.name === (product.vendor && product.vendor.name)
  );

  const vendorName = product.vendor?.name ?? product.vendor ?? "vendor";

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        title: product.title,
        price: product.price ?? "",
        img: product.img,
        vendor: product.vendor ?? vendorName,
      },
      1
    );
    // Header opens preview automatically on cart count increase.
  };

  // Replaced "Chat with Vendor" with simple navigation to vendor page
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
          {/* Left: Product image */}
          <div>
            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700">
              <img
                src={product.img}
                alt={product.title}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right: Product content */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {product.category ?? ""}
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-1">
                {product.title}
              </h1>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                {product.description}
              </p>
            </div>

            <div className="text-3xl font-bold text-emerald-400">
              {product.price}
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
                      : product.vendor?.avatar
                      ? `url("${product.vendor.avatar}")`
                      : undefined,
                  }}
                  aria-hidden
                />
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">
                    {product.vendor?.name ?? product.vendor}
                  </p>
                  {product.vendor?.location && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {product.vendor.location}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <span className="material-symbols-outlined text-lg">
                  local_shipping
                </span>
                <span>Estimated Delivery: {product.deliveryEstimate}</span>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <div className="flex items-center">
                  {/* rating icons (static) */}
                  <svg
                    className="w-5 h-5 text-yellow-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.31 4.036a1 1 0 00.95.69h4.243c.969 0 1.371 1.24.588 1.81l-3.432 2.49a1 1 0 00-.364 1.118l1.31 4.036c.3.921-.755 1.688-1.54 1.118l-3.432-2.49a1 1 0 00-1.175 0l-3.432 2.49c-.785.57-1.84-.197-1.54-1.118l1.31-4.036a1 1 0 00-.364-1.118L2.918 9.463c-.783-.57-.38-1.81.588-1.81h4.243a1 1 0 00.95-.69L9.05 2.927z" />
                  </svg>
                  <svg
                    className="w-5 h-5 text-yellow-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.31 4.036a1 1 0 00.95.69h4.243c.969 0 1.371 1.24.588 1.81l-3.432 2.49a1 1 0 00-.364 1.118l1.31 4.036c.3.921-.755 1.688-1.54 1.118l-3.432-2.49a1 1 0 00-1.175 0l-3.432 2.49c-.785.57-1.84-.197-1.54-1.118l1.31-4.036a1 1 0 00-.364-1.118L2.918 9.463c-.783-.57-.38-1.81.588-1.81h4.243a1 1 0 00.95-.69L9.05 2.927z" />
                  </svg>
                  <svg
                    className="w-5 h-5 text-yellow-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.31 4.036a1 1 0 00.95.69h4.243c.969 0 1.371 1.24.588 1.81l-3.432 2.49a1 1 0 00-.364 1.118l1.31 4.036c.3.921-.755 1.688-1.54 1.118l-3.432-2.49a1 1 0 00-1.175 0l-3.432 2.49c-.785.57-1.84-.197-1.54-1.118l1.31-4.036a1 1 0 00-.364-1.118L2.918 9.463c-.783-.57-.38-1.81.588-1.81h4.243a1 1 0 00.95-.69L9.05 2.927z" />
                  </svg>
                  <svg
                    className="w-5 h-5 text-yellow-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.31 4.036a1 1 0 00.95.69h4.243c.969 0 1.371 1.24.588 1.81l-3.432 2.49a1 1 0 00-.364 1.118l1.31 4.036c.3.921-.755 1.688-1.54 1.118l-3.432-2.49a1 1 0 00-1.175 0l-3.432 2.49c-.785.57-1.84-.197-1.54-1.118l1.31-4.036a1 1 0 00-.364-1.118L2.918 9.463c-.783-.57-.38-1.81.588-1.81h4.243a1 1 0 00.95-.69L9.05 2.927z" />
                  </svg>
                  <svg
                    className="w-5 h-5 text-yellow-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M10.879 13.5c-.3.18-.66.18-.96 0l-2.39-1.57a1 1 0 01-.36-1.12l.91-2.79a1 1 0 00-.29-1.02L4.09 4.94C3.6 4.47 4.02 3.5 4.66 3.5h3.26a1 1 0 00.95-.69L10.88 0" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {product.vendor?.rating ?? vendorInfo?.rating ?? "4.8"} (
                  {product.vendor?.reviews ?? vendorInfo?.reviews ?? "125"}{" "}
                  reviews)
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
                </span>
                Add to Cart
              </button>

              {/* Replaced chat button with "View Vendor" */}
              <button
                onClick={handleViewVendor}
                className="flex-1 py-3 px-6 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold text-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">storefront</span>
                View Vendor
              </button>
            </div>
          </div>
        </div>

        {/* Recommendations */}
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
};

export default ProductDetails;
