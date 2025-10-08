// src/components/Sidebar.jsx
import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ categories = [], onCategoryClick }) => {
  return (
    <div className="sticky top-24 space-y-8">
      <div className="p-6 rounded-xl kenyan-basket-texture bg-white/50 dark:bg-[#0f1a10]/50">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Categories
        </h3>
        <ul className="space-y-2">
          {categories.map((c) => (
            <li key={c.id}>
              {/* Use Link for semantic navigation; also accept onCategoryClick */}
              <Link
                to={`/category/${c.id}`}
                onClick={() => onCategoryClick?.(c.id)}
                className={`flex justify-between items-center p-2 rounded-lg transition-colors ${
                  c.id === "fruits"
                    ? "bg-emerald-100 dark:bg-emerald-800/30 text-emerald-500 font-semibold"
                    : "hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-gray-700 dark:text-gray-300"
                }`}
              >
                <span>{c.name}</span>
                <span className="material-symbols-outlined text-sm">
                  arrow_forward_ios
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-6 rounded-xl kenyan-basket-texture bg-white/50 dark:bg-[#0f1a10]/50">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Filters
        </h3>
        <div className="space-y-6">
          <div>
            <label
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              htmlFor="price-range"
            >
              Price Range
            </label>
            <input
              id="price-range"
              type="range"
              defaultValue={50}
              min={0}
              max={100}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>KES 0</span>
              <span>KES 100+</span>
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              htmlFor="location"
            >
              Location
            </label>
            <select
              id="location"
              className="mt-1 block w-full py-2 px-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-black rounded-lg shadow-sm focus:outline-none focus:ring-emerald-400 focus:border-emerald-400 text-sm"
            >
              <option>All Locations</option>
              <option>Nairobi</option>
              <option>Mombasa</option>
              <option>Kisumu</option>
            </select>
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              htmlFor="vendor-rating"
            >
              Vendor Rating
            </label>
            <select
              id="vendor-rating"
              className="mt-1 block w-full py-2 px-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-black rounded-lg shadow-sm focus:outline-none focus:ring-emerald-400 focus:border-emerald-400 text-sm"
            >
              <option>Any Rating</option>
              <option>4 Stars &amp; Up</option>
              <option>3 Stars &amp; Up</option>
              <option>2 Stars &amp; Up</option>
            </select>
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              htmlFor="availability"
            >
              Availability
            </label>
            <select
              id="availability"
              className="mt-1 block w-full py-2 px-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-black rounded-lg shadow-sm focus:outline-none focus:ring-emerald-400 focus:border-emerald-400 text-sm"
            >
              <option>In Stock</option>
              <option>Out of Stock</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
