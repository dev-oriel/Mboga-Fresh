// frontend/src/components/Sidebar.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

/**
 * Props:
 *  - categories: array
 *  - vendors: array (optional)
 *  - selectedCategory, selectedVendor, locationFilter, maxPrice, minRating, availability
 *  - onCategoryClick(categoryId)
 *  - onFiltersChange(filters) // receives partial filters object
 */
const Sidebar = ({
  categories = [],
  vendors = [],
  selectedCategory = null,
  selectedVendor = null,
  locationFilter = "All Locations",
  maxPrice = 0,
  minRating = 0,
  availability = "any",
  onCategoryClick,
  onFiltersChange,
}) => {
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice || 0);
  const [localLocation, setLocalLocation] = useState(
    locationFilter || "All Locations"
  );
  const [localMinRating, setLocalMinRating] = useState(minRating || 0);
  const [localAvailability, setLocalAvailability] = useState(
    availability || "any"
  );
  const [localVendor, setLocalVendor] = useState(selectedVendor || "");

  useEffect(() => setLocalMaxPrice(maxPrice || 0), [maxPrice]);
  useEffect(
    () => setLocalLocation(locationFilter || "All Locations"),
    [locationFilter]
  );
  useEffect(() => setLocalMinRating(minRating || 0), [minRating]);
  useEffect(() => setLocalAvailability(availability || "any"), [availability]);
  useEffect(() => setLocalVendor(selectedVendor || ""), [selectedVendor]);

  const emit = (patch) => {
    if (onFiltersChange) onFiltersChange(patch);
  };

  const onRangeChange = (e) => {
    const val = Number(e.target.value || 0);
    setLocalMaxPrice(val);
    emit({ maxPrice: val });
  };

  const onLocationChange = (e) => {
    const val = e.target.value;
    setLocalLocation(val);
    emit({ location: val });
  };

  const onVendorRatingChange = (e) => {
    const v = e.target.value;
    let numeric = 0;
    if (v === "4+") numeric = 4;
    else if (v === "3+") numeric = 3;
    else if (v === "2+") numeric = 2;
    else numeric = 0;
    setLocalMinRating(numeric);
    emit({ minRating: numeric });
  };

  const onAvailabilityChange = (e) => {
    const v = e.target.value;
    const mapped =
      v === "In Stock" ? "in" : v === "Out of Stock" ? "out" : "any";
    setLocalAvailability(mapped);
    emit({ availability: mapped });
  };

  const onVendorSelect = (e) => {
    const v = e.target.value;
    setLocalVendor(v);
    emit({ vendor: v || null });
  };

  const handleCategoryClick = (catId) => {
    if (onCategoryClick) onCategoryClick(catId);
    emit({ category: catId });
  };

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
                  to={`/category/${c.id}`}
                  onClick={() => handleCategoryClick(c.id)}
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
              max={1000}
              onChange={onRangeChange}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />

            <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>KES 0</span>
              <div className="text-right">
                <span className="mr-2">Up to</span>
                <span className="font-semibold">
                  {localMaxPrice > 0 ? `KES ${localMaxPrice}` : "No limit"}
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
              value={localVendor || ""}
              onChange={onVendorSelect}
              className="mt-1 block w-full py-2 px-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-black rounded-lg shadow-sm focus:outline-none focus:ring-emerald-400 focus:border-emerald-400 text-sm"
            >
              <option value="">All Vendors</option>
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
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
              value={
                localMinRating === 4
                  ? "4+"
                  : localMinRating === 3
                  ? "3+"
                  : localMinRating === 2
                  ? "2+"
                  : "any"
              }
              onChange={onVendorRatingChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-black rounded-lg shadow-sm focus:outline-none focus:ring-emerald-400 focus:border-emerald-400 text-sm"
            >
              <option value="any">Any Rating</option>
              <option value="4+">4 Stars &amp; Up</option>
              <option value="3+">3 Stars &amp; Up</option>
              <option value="2+">2 Stars &amp; Up</option>
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
              value={
                localAvailability === "in"
                  ? "In Stock"
                  : localAvailability === "out"
                  ? "Out of Stock"
                  : "Any"
              }
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
