// frontend/src/components/ProductCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const DEFAULT_PLACEHOLDER =
  "https://images.unsplash.com/photo-1518976024611-0a4e3d1c9f05?auto=format&fit=crop&w=1200&q=60";

const API_BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "");

function resolveImageSrc(img) {
  if (!img) return DEFAULT_PLACEHOLDER;
  if (typeof img !== "string") return DEFAULT_PLACEHOLDER;
  if (img.startsWith("http://") || img.startsWith("https://")) return img;
  if (img.startsWith("/")) return `${API_BASE || window.location.origin}${img}`;
  return `${API_BASE || window.location.origin}/${img}`;
}

function parsePrice(price) {
  if (price == null)
    return { currency: "KES", amount: "", unit: "", display: "" };
  const raw = String(price).trim();
  const unitMatch = raw.match(/(\/\S.*)$/);
  const unit = unitMatch ? unitMatch[0].trim() : "";
  const numMatch = raw.replace(/,/g, "").match(/(\d+(\.\d+)?)/);
  const amount = numMatch ? numMatch[0] : "";
  const currencyMatch = raw.match(/^[^\d\.\s\/]+/);
  const currency = currencyMatch
    ? currencyMatch[0].trim().replace(/\.$/, "")
    : "KES";
  const display = amount ? `${currency} ${amount}` : raw;
  return { currency, amount, unit, display };
}

const ProductCard = (props) => {
  const id = props.id || props._id;
  const title = props.title || props.name || "";
  // Prefer explicit denormalized vendorName (from backend), then vendorBusiness, then vendor (legacy), then vendorId as last fallback.
  const rawVendor =
    props.vendorName ??
    props.vendorBusiness ??
    props.vendor ??
    (props.vendorId ? String(props.vendorId) : "");

  const vendorDisplay = String(rawVendor || "").trim() || "Unknown vendor";

  const img = props.img || props.image || props.imagePath || props.imgPath;
  const priceRaw = props.priceLabel || props.price || props.priceStr || "";
  const special = !!props.special;
  const onView = props.onView;
  const onAdd = props.onAdd;

  const { currency, amount, unit, display } = parsePrice(priceRaw);
  const resolvedImg = resolveImageSrc(img);

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
        priceLabel: priceRaw || display,
        price: amount || 0,
        img: resolvedImg,
        vendor: vendorDisplay,
      },
      1
    );
  };

  const onLinkClick = (e) => {
    if (typeof onView === "function") {
      e.preventDefault();
      onView(id);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden group flex flex-col transition-transform hover:-translate-y-1">
      <div className="relative">
        <Link to={`/product/${id}`} onClick={onLinkClick}>
          <img
            loading="lazy"
            src={resolvedImg}
            alt={title}
            onError={(e) => {
              e.currentTarget.src = DEFAULT_PLACEHOLDER;
            }}
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
        <Link to={`/product/${id}`} onClick={onLinkClick}>
          <p className="font-semibold text-gray-900 dark:text-white line-clamp-2">
            {title}
          </p>
        </Link>

        <p
          className="text-sm text-gray-500 dark:text-gray-400 mt-1"
          title={vendorDisplay}
        >
          From {vendorDisplay}
        </p>

        <div className="mt-4 flex items-end justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm text-gray-500">{currency}</span>
            <span className="text-xl font-extrabold text-emerald-600">
              {amount || display || ""}
            </span>
            {unit && <span className="text-sm text-gray-500 ml-1">{unit}</span>}
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
