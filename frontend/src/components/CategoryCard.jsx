import React from "react";
import { Link } from "react-router-dom";

const CategoryCard = ({ id, name, img }) => {
  return (
    <Link
      to={`/marketplace?category=${encodeURIComponent(id)}`}
      className="group text-center"
    >
      <div
        className="aspect-square bg-cover bg-center rounded-xl mb-2"
        style={{ backgroundImage: `url('${img}')` }}
      />
      <p className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-emerald-400 transition">
        {name}
      </p>
    </Link>
  );
};

export default CategoryCard;
