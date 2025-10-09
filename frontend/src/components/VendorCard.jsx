// src/components/VendorCard.jsx
import React from "react";
import { Link } from "react-router-dom";

const VendorCard = ({
  id,
  name,
  img = "https://via.placeholder.com/150",
  onClick,
}) => {
  return (
    <Link
      to={`/vendor/${id}`}
      onClick={() => onClick?.(id)}
      className="text-center group"
    >
      <div
        className="w-24 h-24 mx-auto rounded-full bg-cover bg-center mb-2 ring-2 ring-transparent group-hover:ring-emerald-400 transition-all"
        style={{ backgroundImage: `url('${img}')` }}
        aria-hidden
      />
      <p className="font-medium text-gray-700 dark:text-gray-300">{name}</p>
    </Link>
  );
};

export default VendorCard;
