import React from "react";
import { useNavigate } from "react-router-dom";
import { vendors } from "../constants";

function slugify(str = "") {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const VendorsSection = () => {
  const navigate = useNavigate();

  // only take vendors explicitly marked as featured
  const featuredVendors = Array.isArray(vendors)
    ? vendors.filter((v) => !!v.featured)
    : [];

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
            // prefer explicit id, else compute from name
            const vendorId = vendor.id || slugify(vendor.name || "vendor");
            const key = vendorId || vendor.name;

            return (
              <button
                type="button"
                key={key}
                onClick={() => navigate(`/vendor/${vendorId}`)}
                className="text-left bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow transform hover:-translate-y-1 hover:scale-105 focus:outline-none"
                aria-label={`Open ${vendor.name} profile`}
              >
                <img
                  src={vendor.img}
                  alt={vendor.name}
                  className="w-full h-56 object-cover transition-transform duration-500 hover:scale-110"
                  loading="lazy"
                />
                <div className="p-6 flex flex-col justify-between h-40">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                      {vendor.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {vendor.location}
                    </p>
                  </div>
                  <p className="mt-4 text-emerald-600 font-semibold">
                    {vendor.rating}
                  </p>
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
