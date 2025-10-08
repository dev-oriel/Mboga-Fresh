// frontend/src/components/ProductDetails.jsx
import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import { products, vendors } from "../constants"; // <-- central constants

const RECOMMENDATIONS = [
  {
    id: "c1",
    title: "Carrots",
    price: "Ksh 120/kg",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBXCZvWtdsQmpyBWpEI5RZpad-a9VQX1MRY7Mv7-n2AoaJ2A3-2PlLT2d4kssEFw9LylQL26qM7BKnE3ugQh_XCJqgI6S69DOrkECVbb4jU0qk49AsI8pyEwMfnmw5TcrE1fD4eufVbWLBoXutUKcrmG2WdSlDlxPWZc8BtSE6myAal7ZCz2LQ4cfrpZLTLZqBPuV75HmniwT_aI5hUP3l3Wga3WqKDCn2tYptSK8Yk2qVWzzBbhkLoOYHcpvc1RSHlLIeihsGevBM",
  },
  {
    id: "c2",
    title: "Spinach",
    price: "Ksh 80/bunch",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQIR22AE8QJNGrRu1z6UliX3LFrzXCKkTvrLesBFFvmMPXStRx2C-_xKm9w9oJqr6ccZqT3FHFvo6CnDJHXWsPzqaSWWhBkpiWIa_JgLnXgm2nMWoKLG0FEK-nO_SOjaSEwNqUUGKvqstHcsU0fZCdzkWeLBzJ8qbfZnkOuuXEmZqjDc-GC0eYl-qruFvh0dv4yOy7eQYxlexNDSjRhQpcPaTZ8up3ZANm2cItVmz6L2ZiXx0D3xVVYyIf7xGNFF_VNJjhI-epYk8",
  },
  {
    id: "c3",
    title: "Potatoes",
    price: "Ksh 60/kg",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDO73HmGSXSPK6p8MeYqLkUHDQPgRTFDMSKQMYfcpSvgRv0ooEDqt5XgQSvFq5JPIO_PSV1svPidfymRRvCk42AXIUkOP-4r3o5SELv_zgtXZdbuou2d92tKEYvFSQ3WDrUGsUGBalqw-0_zy35Z-Suf0CMhxxFukdTZHwSb0QQSEh3z3tCKumL-8BZX6vOykH79l-JwStb6g-NNJ4M89bZ1bymRP1bGO4qzYf551SkOoLMlyBoO1plFFZ7g0WgoCXrzvXeEm9V47o",
  },
  {
    id: "c4",
    title: "Onions",
    price: "Ksh 50/kg",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZ7kQ1HaJ5z5Ak9PjndRarFocnJ6gARZAwK7eUQyD4NALZwWw2Nc6ac5WYcWjB_cs2oQy4jrmgqOR_wh72Khlz0nivy759bvcO4SX1Azy94XVCeO_XdnhCxkmnsudjXah8tVgVrrwS-TImhcjNY9JB7D7pJMY-NdvwJZ3GptMl4yRKyONeJYZnbl8wz-LzDKMm43BO7PxxxEWNKelrlTvvJA_Y1LSgo8Q2tgFNj8fKFjkKrwsArmrDwEoBVfszml2hV5ccX1cGeq8",
  },
  {
    id: "c5",
    title: "Tomatoes",
    price: "Ksh 100/kg",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBxzUH_puxqM6Rcs-h__RfZBty4j3HgBY1QCxGSrT4USlVH9XGLef_KWMZt-qGEDka5ds2A-IMvy3E4TFD8Xzht7ugDskLCtpgd0Butkf_kZD0PgIPBTK_cL1956P7M8HXTeUePcpHgmpPW2lU59lnQpxMGQfe4iQVMF8nMrluulUDWbsOvIhO0V4eydFyl6YvIZcm--tpzOB3z5EBz0rHH100HBnJhruUDO-PseGd_hImHdXgSObjPpYo4j0VNvihHZZxltT1-1II",
  },
];

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // example product (keeps your original example intact)
  const exampleProduct = {
    id: "prod-001",
    category: "Fresh Produce",
    title: "Fresh Tomatoes",
    description:
      "Juicy, ripe tomatoes, perfect for salads, cooking, and snacking. Sourced directly from local farmers, ensuring freshness and quality.",
    price: "Ksh 100/kg",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBxzUH_puxqM6Rcs-h__RfZBty4j3HgBY1QCxGSrT4USlVH9XGLef_KWMZt-qGEDka5ds2A-IMvy3E4TFD8Xzht7ugDskLCtpgd0Butkf_kZD0PgIPBTK_cL1956P7M8HXTeUePcpHgmpPW2lU59lnQpxMGQfe4iQVMF8nMrluulUDWbsOvIhO0V4eydFyl6YvIZcm--tpzOB3z5EBz0rHH100HBnJhruUDO-PseGd_hImHdXgSObjPpYo4j0VNvihHZZxltT1-1II",
    vendor: {
      name: "Mama Rose",
      location: "Nairobi, Kenya",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuArzvQ9NBC50by7OFXNaZRHgiDCz1XdeITatVThYGF2jVw4-HFFV79sp2z6JmjapVN_VV_bDyXguMYkEWwEZobbQuQ2RH5W6LXvawSnkO4wj6eiVSPoY_2RjnhqahT5caY7-4mAmPoa5miBvvrec_ilCuHCY1-jTTwesyj63u3puEsPJW6YbbVnNGtG9lkwCkN9CZtnoFDU455tRhgtunI2Im49UoMXasnYLYFk5kADBJV0Xhs91pVkIk8gWHVFX4l7oMISLxEp7ns",
      rating: 4.8,
      reviews: 125,
    },
    deliveryEstimate: "1-2 hours",
  };

  // Try to find product from constants; fall back to exampleProduct
  const product = products.find((p) => p.id === id) || exampleProduct;

  const handleAddToCart = () => {
    // wire this to your cart context / redux later
    navigate("/cart");
  };

  const handleChatVendor = () => {
    // Open chat or vendor page
    navigate(
      `/vendor/${product.vendor.name.replace(/\s+/g, "-").toLowerCase()}`
    );
  };

  // vendor info (from constants) if available
  const vendorInfo = vendors.find(
    (v) =>
      v.name === product.vendor ||
      v.id === product.vendorId ||
      v.name === (product.vendor && product.vendor.name)
  );

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
                {/* Stars (static SVGs same as original) */}
                <div className="flex items-center">
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

              <button
                onClick={handleChatVendor}
                className="flex-1 py-3 px-6 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold text-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">chat</span>
                Chat with Vendor
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
