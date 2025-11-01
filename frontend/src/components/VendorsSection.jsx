import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchVendorFilters } from "../api/products"; // MODIFIED: Import API

// Helper function to resolve image paths
const DEFAULT_PLACEHOLDER = "https://via.placeholder.com/150";
const API_BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "");

function resolveImageSrc(img) {
  if (!img) return DEFAULT_PLACEHOLDER;
  if (typeof img !== "string") return DEFAULT_PLACEHOLDER;
  if (img.startsWith("http://") || img.startsWith("https://")) return img;
  if (img.startsWith("data:")) return img;
  if (img.startsWith("/")) return `${API_BASE || window.location.origin}${img}`;
  return `${API_BASE || window.location.origin}/${img}`;
}

const VendorsSection = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  // MODIFIED: Fetch real vendors on component mount
  useEffect(() => {
    fetchVendorFilters()
      .then((data) => {
        if (data && Array.isArray(data.vendors)) {
          setVendors(data.vendors);
        }
      })
      .catch((err) => console.error("Failed to load vendors:", err))
      .finally(() => setLoading(false));
  }, []);

  // Show only the first 3 as "featured"
  const featuredVendors = vendors.slice(0, 3);

  if (loading) {
    return (
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold mb-6 text-gray-800 dark:text-white text-center">
            Featured Vendors
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300">
            Loading vendors...
          </p>
        </div>
      </section>
    );
  }

  if (featuredVendors.length === 0) {
    return (
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold mb-6 text-gray-800 dark:text-white text-center">
            Featured Vendors
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300">
            No featured vendors right now.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-extrabold mb-12 text-gray-800 dark:text-white text-center">
          Featured Vendors
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {featuredVendors.map((vendor) => {
            // MODIFIED: Use real data structure
            const vendorId = vendor.user?._id || vendor._id;
            const key = vendor._id;
            const vendorImg = vendor.user?.avatar;
            const vendorName = vendor.businessName;
            const vendorLocation = vendor.location;

            return (
              <button
                type="button"
                key={key}
                // MODIFIED: Navigate to the correct marketplace filter URL
                onClick={() => navigate(`/marketplace?vendorId=${vendorId}`)}
                className="text-left bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow transform hover:-translate-y-1 hover:scale-105 focus:outline-none"
                aria-label={`Open ${vendorName} profile`}
              >
                <img
                  src={resolveImageSrc(vendorImg)}
                  alt={vendorName}
                  className="w-full h-56 object-cover transition-transform duration-500 hover:scale-110"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_PLACEHOLDER;
                  }}
                />
                <div className="p-6 flex flex-col justify-between h-40">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                      {vendorName}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {vendorLocation}
                    </p>
                  </div>
                  {/* We don't have rating data from this API, so it's removed */}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default VendorsSection;
