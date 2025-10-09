// frontend/src/components/ProductCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

/**
 * Props:
 *  - id, title, vendor, price, img
 *  - special (optional) -> shows SPECIAL badge (like Freshpicks)
 *  - onView(id) optional
 *  - onAdd() optional (if provided, this will be called instead of default add)
 */
const ProductCard = ({
  id,
  title,
  vendor,
  price = "",
  img,
  special = false,
  onView,
  onAdd,
}) => {
  const unitMatch = (price || "").match(/(\/\S.*)$/);
  const unit = unitMatch ? unitMatch[0] : "";
  const basePrice = unit ? price.replace(unit, "").trim() : price;

  const { addItem } = useCart();

  const handleAdd = (ev) => {
    ev?.stopPropagation?.();
    if (typeof onAdd === "function") {
      onAdd(id);
      return;
    }

    addItem(
      {
        id,
        title,
        price,
        img,
        vendor,
      },
      1
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden group flex flex-col transition-transform hover:-translate-y-1">
      <div className="relative">
        <Link to={`/product/${id}`} onClick={() => onView?.(id)}>
          <img
            loading="lazy"
            src={img}
            alt={title}
            className="w-full h-56 sm:h-48 md:h-56 object-cover"
          />
        </Link>

        {special && (
          <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            SPECIAL
          </div>
        )}

        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="p-2 rounded-full bg-white/90 dark:bg-black/60 text-gray-700 dark:text-gray-200 shadow-sm"
            aria-label={`favorite ${title}`}
            type="button"
          >
            <span className="material-symbols-outlined text-lg">
              favorite_border
            </span>
          </button>
          <button
            className="p-2 rounded-full bg-white/90 dark:bg-black/60 text-gray-700 dark:text-gray-200 shadow-sm"
            aria-label={`compare ${title}`}
            type="button"
          >
            <span className="material-symbols-outlined text-lg">
              compare_arrows
            </span>
          </button>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <Link to={`/product/${id}`} onClick={() => onView?.(id)}>
          <p className="font-semibold text-gray-900 dark:text-white line-clamp-2">
            {title}
          </p>
        </Link>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          From {vendor}
        </p>

        <div className="mt-4 flex items-end justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-emerald-600">
              {basePrice}
            </span>
            {unit && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {unit}
              </span>
            )}
          </div>

          <button
            onClick={handleAdd}
            aria-label={`Add ${title} to cart`}
            className="p-3 rounded-full bg-emerald-600/10 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors shadow-sm"
            type="button"
          >
            <span className="material-symbols-outlined">add_shopping_cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
