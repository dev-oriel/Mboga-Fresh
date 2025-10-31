import React from "react";
import { Link, useSearchParams } from "react-router-dom";

const Sidebar = ({
  categories = [],
  filterData = { vendors: [], locations: [] },
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Helper function to update a single search parameter
  const updateQuery = (key, value) => {
    setSearchParams(
      (prev) => {
        const newParams = new URLSearchParams(prev);
        if (value) {
          newParams.set(key, value);
        } else {
          newParams.delete(key); // Remove if value is empty
        }
        return newParams;
      },
      { replace: true } // Use replace to avoid polluting browser history
    );
  };

  // --- Read values directly from URL ---
  const selectedCategory = searchParams.get("category") || "";
  // MODIFIED: Default to 10000 (max) instead of 0
  const localMaxPrice = searchParams.get("maxPrice") || "10000";
  const localVendor = searchParams.get("vendorId") || "";
  const localLocation = searchParams.get("location") || "All Locations";
  const localMinRating = searchParams.get("minRating") || "0";
  const localAvailability = searchParams.get("status") || "Any";

  // --- Event Handlers ---
  const onRangeChange = (e) => {
    const val = e.target.value;
    // MODIFIED: Send "" (no limit) if slider is at max
    updateQuery("maxPrice", val === "10000" ? "" : val);
  };

  const onLocationChange = (e) => {
    const val = e.target.value;
    updateQuery("location", val === "All Locations" ? "" : val);
  };

  const onVendorSelect = (e) => {
    updateQuery("vendorId", e.target.value);
  };

  const onAvailabilityChange = (e) => {
    const val = e.target.value;
    updateQuery("status", val === "Any" ? "" : val);
  };

  // Note: Vendor Rating is not implemented in your backend, I've left the handler out for now.

  return (
    <div className="sticky top-24 space-y-8">
      <div className="p-6 rounded-xl kenyan-basket-texture bg-white/50 dark:bg-[#0f1a10]/50">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Categories
        </h3>
        <ul className="space-y-2">
          {categories.map((c) => {
            const isActive = selectedCategory === c.id;
            return (
              <li key={c.id}>
                <Link
                  to={`/marketplace?category=${encodeURIComponent(c.id)}`}
                  className={`flex justify-between items-center p-2 rounded-lg transition-colors ${
                    isActive
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
            );
          })}
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
              value={localMaxPrice}
              min={0}
              max={10000} // Increased max to 10,000
              step={100}
              onChange={onRangeChange}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
            <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>KES 0</span>
              <div className="text-right">
                <span className="mr-2">Up to</span>
                <span className="font-semibold">
                  {/* MODIFIED: Check against 10000 for "No limit" */}
                  {localMaxPrice === "10000"
                    ? "No limit"
                    : `KES ${localMaxPrice}`}
                </span>
              </div>
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              htmlFor="vendor-select"
            >
              Vendor
            </label>
            <select
              id="vendor-select"
              value={localVendor}
              onChange={onVendorSelect}
              className="mt-1 block w-full py-2 px-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-black rounded-lg shadow-sm focus:outline-none focus:ring-emerald-400 focus:border-emerald-400 text-sm"
            >
              <option value="">All Vendors</option>
              {filterData.vendors.map((v) => (
                // MODIFIED: Value is now v.user._id, which matches the product's vendorId
                <option key={v._id} value={v.user._id}>
                  {v.businessName}
                </option>
              ))}
            </select>
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
              value={localLocation}
              onChange={onLocationChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-black rounded-lg shadow-sm focus:outline-none focus:ring-emerald-400 focus:border-emerald-400 text-sm"
            >
              <option>All Locations</option>
              {filterData.locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
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
              value={localAvailability}
              onChange={onAvailabilityChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-black rounded-lg shadow-sm focus:outline-none focus:ring-emerald-400 focus:border-emerald-400 text-sm"
            >
              <option>Any</option>
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
