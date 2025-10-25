import React, { useState, useEffect } from "react";

const SearchBar = ({
  onSearch,
  onCategoryChange,
  onPriceChange,
  initialQuery = "",
  activeCategory = "All Categories",
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(activeCategory);
  const [priceSort, setPriceSort] = useState("Price Range");

  // ✅ Debounce search
  useEffect(() => {
    const delay = setTimeout(() => onSearch(query), 300);
    return () => clearTimeout(delay);
  }, [query, onSearch]);

  // ✅ Update category + price filters immediately
  useEffect(() => onCategoryChange(category), [category, onCategoryChange]);
  useEffect(() => onPriceChange(priceSort), [priceSort, onPriceChange]);

  return (
    <div className="flex items-center gap-4 mb-8 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-emerald-200/60 dark:border-emerald-700/40">
      <div className="relative flex-1">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          search
        </span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border border-emerald-200/60 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-emerald-300"
          placeholder="Search for products..."
        />
      </div>

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border border-emerald-200/60 rounded-lg py-2 px-4"
      >
        <option>All Categories</option>
        <option>Vegetables</option>
        <option>Fruits</option>
        <option>Grains & Cereals</option>
        <option>Dairy</option>
        <option>Herbs & Spices</option>
      </select>

      <select
        value={priceSort}
        onChange={(e) => setPriceSort(e.target.value)}
        className="border border-emerald-200/60 rounded-lg py-2 px-4"
      >
        <option>Price Range</option>
        <option>Low to High</option>
        <option>High to Low</option>
      </select>
    </div>
  );
};

export default SearchBar;
