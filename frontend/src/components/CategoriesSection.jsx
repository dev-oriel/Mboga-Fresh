// frontend/src/components/CategoriesSection.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { categories } from "../constants";

const CategoriesSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-white">
          Shop by Category
        </h2>

        <div className="flex overflow-x-auto space-x-6 pb-4 -mx-4 px-4">
          {categories.map((cat) => (
            <button
              type="button"
              key={cat.id}
              onClick={() => navigate(`/category/${cat.id}`)}
              className="flex-shrink-0 w-40 text-center group focus:outline-none"
              aria-label={`Open ${cat.name} category`}
            >
              <div className="relative aspect-square rounded-full overflow-hidden shadow-lg transform group-hover:-translate-y-2 transition-transform duration-300">
                <img
                  alt={cat.name}
                  className="w-full h-full object-cover"
                  src={cat.img}
                />
                <div className="absolute inset-0 bg-black/20" />
              </div>
              <h3 className="mt-4 font-semibold text-lg text-gray-700 dark:text-gray-200">
                {cat.name}
              </h3>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
