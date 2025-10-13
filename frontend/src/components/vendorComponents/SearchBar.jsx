import React from "react";

const SearchBar = () => {
  return (
    <div className="flex items-center gap-4 mb-8 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-emerald-200/60 dark:border-emerald-700/40">
      <div className="relative flex-1">
        <span
          className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
          aria-hidden
        >
          search
        </span>
        <input
          className="w-full bg-transparent border border-emerald-200/60 dark:border-emerald-700/40 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-emerald-300 dark:focus:ring-emerald-600 focus:outline-none transition-shadow text-gray-900 dark:text-gray-100"
          placeholder="Search for products..."
          type="search"
          aria-label="Search products"
        />
      </div>

      <div className="flex items-center gap-4">
        <select className="bg-transparent border border-emerald-200/60 dark:border-emerald-700/40 rounded-lg py-2 px-4 focus:ring-2 focus:ring-emerald-300 dark:focus:ring-emerald-600 focus:outline-none transition-shadow text-gray-900 dark:text-gray-100">
          <option>All Categories</option>
          <option>Vegetables</option>
          <option>Fruits</option>
        </select>

        <select className="bg-transparent border border-emerald-200/60 dark:border-emerald-700/40 rounded-lg py-2 px-4 focus:ring-2 focus:ring-emerald-300 dark:focus:ring-emerald-600 focus:outline-none transition-shadow text-gray-900 dark:text-gray-100">
          <option>Price Range</option>
          <option>Low to High</option>
          <option>High to Low</option>
        </select>
      </div>
    </div>
  );
};

export default SearchBar;
