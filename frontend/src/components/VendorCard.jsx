import React from "react";
import { Link } from "react-router-dom";

const DEFAULT_PLACEHOLDER = "https://via.placeholder.com/150";
const API_BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "");

function resolveImageSrc(img) {
  if (!img) return DEFAULT_PLACEHOLDER;
  if (typeof img !== "string") return DEFAULT_PLACEHOLDER;
  if (img.startsWith("http://") || img.startsWith("https://")) return img;
  if (img.startsWith("data:")) return img;
  if (img.startsWith("/")) return `${API_BASE || window.location.origin}${img}`;
  return `${API_BASE || window.location.origin}/${img}`;
}

const VendorCard = ({ id, name, img }) => {
  const resolvedImg = resolveImageSrc(img);

  return (
    <Link
      to={`/marketplace?vendorId=${id}`}
      // MODIFIED:
      // 1. w-24: Sets a fixed width for the entire card.
      // 2. flex-shrink-0: Prevents the card from shrinking inside the carousel.
      className="text-center group w-24 flex-shrink-0"
    >
      <div
        // MODIFIED:
        // 1. w-full: Makes the image circle fill the w-24 of the parent.
        // 2. aspect-square: Ensures the div is perfectly round.
        className="w-full aspect-square mx-auto rounded-full bg-cover bg-center mb-2 ring-2 ring-transparent group-hover:ring-emerald-400 transition-all"
        style={{ backgroundImage: `url('${resolvedImg}')` }}
        aria-hidden
      />
      <p className="font-medium text-gray-700 dark:text-gray-300 w-full truncate">
        {name}
      </p>
    </Link>
  );
};

export default VendorCard;
