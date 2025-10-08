import React from "react";
import CategoryCard from "./CategoryCard";

const Sidebar = ({ categories = [] }) => {
  return (
    <div className="sticky top-24 space-y-8">
      <div className="p-6 rounded-xl kenyan-basket-texture bg-white/50 dark:bg-[#152111]/50">
        <h3 className="text-lg font-bold text-[#111827] dark:text-white mb-4">
          Categories
        </h3>
        <ul className="space-y-2">
          {categories.map((c) => (
            <li key={c.name}>
              <a
                className={`flex justify-between items-center p-2 rounded-lg transition-colors ${
                  c.name === "Fruits"
                    ? "bg-[#42cf17]/10 dark:bg-[#42cf17]/20 text-[#42cf17] font-semibold"
                    : "hover:bg-[#42cf17]/10 dark:hover:bg-[#42cf17]/20 text-[#374151] dark:text-[#D1D5DB]"
                }`}
                href="#"
              >
                <span>{c.name}</span>
                <span className="material-symbols-outlined text-sm">
                  arrow_forward_ios
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-6 rounded-xl kenyan-basket-texture bg-white/50 dark:bg-[#152111]/50">
        <h3 className="text-lg font-bold text-[#111827] dark:text-white mb-4">
          Filters
        </h3>
        <div className="space-y-6">
          <div>
            <label
              className="block text-sm font-medium text-[#374151] dark:text-[#D1D5DB] mb-2"
              htmlFor="price-range"
            >
              Price Range
            </label>
            <input
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#42cf17]"
              id="price-range"
              max="100"
              min="0"
              type="range"
              defaultValue={50}
            />
            <div className="flex justify-between text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-1">
              <span>$0</span>
              <span>$100+</span>
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-medium text-[#374151] dark:text-[#D1D5DB]"
              htmlFor="location"
            >
              Location
            </label>
            <select
              className="mt-1 block w-full py-2 px-3 border border-black/10 dark:border-white/10 bg-[#f6f8f6] dark:bg-[#152111] rounded-lg shadow-sm focus:outline-none focus:ring-[#42cf17]/50 focus:border-[#42cf17]/50 text-sm"
              id="location"
            >
              <option>All Locations</option>
              <option>Nairobi</option>
              <option>Mombasa</option>
              <option>Kisumu</option>
            </select>
          </div>

          <div>
            <label
              className="block text-sm font-medium text-[#374151] dark:text-[#D1D5DB]"
              htmlFor="vendor-rating"
            >
              Vendor Rating
            </label>
            <select
              className="mt-1 block w-full py-2 px-3 border border-black/10 dark:border-white/10 bg-[#f6f8f6] dark:bg-[#152111] rounded-lg shadow-sm focus:outline-none focus:ring-[#42cf17]/50 focus:border-[#42cf17]/50 text-sm"
              id="vendor-rating"
            >
              <option>Any Rating</option>
              <option>4 Stars &amp; Up</option>
              <option>3 Stars &amp; Up</option>
              <option>2 Stars &amp; Up</option>
            </select>
          </div>

          <div>
            <label
              className="block text-sm font-medium text-[#374151] dark:text-[#D1D5DB]"
              htmlFor="availability"
            >
              Availability
            </label>
            <select
              className="mt-1 block w-full py-2 px-3 border border-black/10 dark:border-white/10 bg-[#f6f8f6] dark:bg-[#152111] rounded-lg shadow-sm focus:outline-none focus:ring-[#42cf17]/50 focus:border-[#42cf17]/50 text-sm"
              id="availability"
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
