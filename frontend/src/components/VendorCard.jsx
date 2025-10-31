import React from "react";
import { Link } from "react-router-dom";

const DEFAULT_PLACEHOLDER = "https://via.placeholder.com/150";
const API_BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "");

function resolveImageSrc(img) {
  if (!img) return DEFAULT_PLACEHOLDER;
  if (typeof img !== "string") return DEFAULT_PLACEHOLDER;
  if (img.startsWith("http://") || img.startsWith("https://")) return img;
  if (img.startsWith("data:")) return img; // Handle data URLs
  if (img.startsWith("/")) return `${API_BASE || window.location.origin}${img}`;
  return `${API_BASE || window.location.origin}/${img}`;
}

const VendorCard = ({ id, name, img }) => {
  const resolvedImg = resolveImageSrc(img); // Use the helper

  return (
    <Link to={`/marketplace?vendorId=${id}`} className="text-center group">
      <div
        className="w-24 h-24 mx-auto rounded-full bg-cover bg-center mb-2 ring-2 ring-transparent group-hover:ring-emerald-400 transition-all"
        style={{ backgroundImage: `url('${resolvedImg}')` }} // Use the resolved URL
        aria-hidden
      />
      <p className="font-medium text-gray-700 dark:text-gray-300">{name}</p>
    </Link>
  );
};

export default VendorCard;
