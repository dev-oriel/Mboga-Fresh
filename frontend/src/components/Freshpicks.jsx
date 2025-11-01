import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { fetchProducts } from "../api/products"; // MODIFIED: Import API

// Helper function to resolve image paths
const DEFAULT_PLACEHOLDER =
  "https://images.unsplash.com/photo-1518976024611-0a4e3d1c9f05?auto=format&fit=crop&w=1200&q=60";
const API_BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "");

function resolveImageSrc(img) {
  if (!img) return DEFAULT_PLACEHOLDER;
  if (typeof img !== "string") return DEFAULT_PLACEHOLDER;
  if (img.startsWith("http://") || img.startsWith("https://")) return img;
  if (img.startsWith("data:")) return img;
  if (img.startsWith("/")) return `${API_BASE || window.location.origin}${img}`;
  return `${API_BASE || window.location.origin}/${img}`;
}

const Freshpicks = () => {
  const { addItem } = useCart();
  const [products, setProducts] = useState([]);

  // MODIFIED: Fetch real products on component mount
  useEffect(() => {
    // Fetch 3 newest "In Stock" products
    fetchProducts({ status: "In Stock", limit: 3, sortBy: "relevance" })
      .then((data) => {
        if (data && Array.isArray(data.products)) {
          setProducts(data.products);
        }
      })
      .catch((err) => console.error("Failed to load fresh picks:", err));
  }, []);

  const handleAdd = (e, product) => {
    e.preventDefault(); // Stop the Link navigation
    e.stopPropagation(); // Stop event bubbling

    addItem(
      {
        id: product._id,
        title: product.name,
        price: product.price, // Already a number
        unit: product.unit,
        priceLabel: `KES ${product.price} ${product.unit || ""}`.trim(),
        img: resolveImageSrc(product.imagePath),
        vendor: product.vendorName,
      },
      1
    );
  };

  return (
    <section className="py-8 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white text-center">
          Today's Fresh Picks
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => {
            const id = product._id;
            const resolvedImg = resolveImageSrc(product.imagePath);

            return (
              // MODIFIED: Card is now a Link
              <Link
                key={id}
                to={`/product/${id}`}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden group flex flex-col"
              >
                <div className="relative">
                  <img
                    src={resolvedImg}
                    alt={product.name}
                    className="w-full h-56 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_PLACEHOLDER;
                    }}
                  />
                  {/* 'special' prop doesn't exist on product, can be re-added if needed */}
                </div>

                <div className="p-4 flex-grow flex flex-col">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex-grow">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    From {product.vendorName || "Mboga Fresh"}
                  </p>

                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xl font-extrabold text-green-600">
                      KES {product.price}{" "}
                      <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                        {product.unit}
                      </span>
                    </span>

                    <button
                      aria-label={`Add ${product.name} to cart`}
                      onClick={(e) => handleAdd(e, product)}
                      className="bg-green-600/10 text-green-600 p-2 rounded-full hover:bg-green-600 hover:text-white transition-colors"
                    >
                      <span className="material-symbols-outlined">
                        add_shopping_cart
                      </span>
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Freshpicks;
