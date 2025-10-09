import React from "react";
import { useNavigate } from "react-router-dom";

const vendors = [
  {
    name: "Mama Njeri's Greens",
    location: "Westlands, Nairobi",
    rating: "4.8 (120+ reviews)",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDueNPuikXZ-v_tKsbjnJ2NYPV4bDprvT6Km8GqY1l0GLhaiKttqoqBaLdzdVf-opzFB6xozG9m8qAQ1CAgRm5_FMBNFa0tDaFg5RyGBDSg8tEkirRlEVFs22whlkHQOoBNaQyWs1RWxsKSdKOkBYKQCQmrcbx91pC3boCuWlERPcufHVeWuFw_V_5qJo-j_4tRwIMxN5VXbH7ABF5txpyDZnLW4tLFm2tEZiSkGzyBDYKXCYGa6aDITIwIjgczVNTjljcP3fb8sco",
  },
  {
    name: "Kimani's Fresh Produce",
    location: "Kileleshwa Market",
    rating: "4.9 (98 reviews)",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJ9G4v7aFIzsBkbXJTtM6A8vg4oIJ6EBpep4dW9m-IeWwok01_nVspuhUMqMpe0Jk9y1D1mY3DmKFkgB-r-sVbpX4Nj65gHmwdZlZGsfS-zZLbJfw0Yw8peD2Lmb2I1fGOvuxw7z-DWW5NQa0vBJK3j-Wf7mrFd__dZXRDPRLcmfhEeh6w9gN5DS2EN1C1W1y_Laq8x4VJi4-lEvs1ca8Ruj4LytcIWENONwnsBYMG_nj7H2ggBHk9WsA7t47MjLQoIgCHNutFG28",
  },
  {
    name: "Fresh & Green Hub",
    location: "Karen, Nairobi",
    rating: "4.7 (75 reviews)",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDyQ-kfMGOz1EmZeChAc6loFUG8JIq6r_9WUe_CRC4US50k7R1zJlddn_nX3BRGGoOrL1GqEoP7dpr-XhQY-iztEnHVZ0UhjhRizz0PmZYcvEHJAN95NKBzUCYqSkgBMlWzssFDrKFKprMvqPFg2sMC7FfCLyduoXGYWApHDziB5LSMWn7FHaxs96XMphuuER0ixn4tFMYlMkoiczu69GcfvXxD6PJ2jvOCXu5WmZi9J-oQWqS74ERfBUhUOdrdRFk0U5TJIHNoFjE",
  },
];

function slugify(str = "") {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const VendorsSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-extrabold mb-12 text-gray-800 dark:text-white text-center">
          Featured Vendors
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {vendors.map((vendor) => {
            const id = slugify(vendor.name);
            return (
              <button
                type="button"
                key={vendor.name}
                onClick={() => navigate(`/vendor/${id}`)}
                className="text-left bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow transform hover:-translate-y-1 hover:scale-105 focus:outline-none"
              >
                <img
                  src={vendor.img}
                  alt={vendor.name}
                  className="w-full h-56 object-cover transition-transform duration-500 hover:scale-110"
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
