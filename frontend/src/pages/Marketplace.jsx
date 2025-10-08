// frontend/src/pages/Marketplace.jsx
import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import CategoryCard from "../components/CategoryCard";
import VendorCard from "../components/VendorCard";
import ProductCard from "../components/ProductCard";
import SearchInput from "../components/SearchInput";
import Footer from "../components/FooterSection";
import { categories, vendors, products } from "../constants";
import { useCart } from "../context/CartContext";

/**
 * Small helper to parse numeric price out of labels like "KES 150.00/kg"
 */
function parsePriceLabel(label = "") {
  if (!label) return 0;
  // remove commas and find first number
  const m = label.replace(/,/g, "").match(/(\d+(\.\d+)?)/);
  return m ? parseFloat(m[0]) : 0;
}

/**
 * Create a vendor map at module scope — vendors is a static module import so
 * computing this once avoids unnecessary hooks and silences ESLint warnings.
 */
const VENDOR_MAP = (() => {
  const m = new Map();
  vendors.forEach((v) => m.set(v.id, v));
  return m;
})();

const Marketplace = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addItem } = useCart();

  // filters state
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null); // categoryId
  const [selectedVendor, setSelectedVendor] = useState(null); // vendorId
  const [locationFilter, setLocationFilter] = useState("All Locations");
  const [maxPrice, setMaxPrice] = useState(0); // 0 means no cap
  const [minRating, setMinRating] = useState(0); // 0 = any
  const [availability, setAvailability] = useState("any"); // "any", "in", "out"
  const [sortBy, setSortBy] = useState("relevance"); // or price-asc, price-desc

  // navigation to product
  const goToProduct = useCallback(
    (id) => navigate(`/product/${id}`),
    [navigate]
  );

  // initial search from URL query param ?query=...
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("query") ?? "";
    setQuery(q);
  }, [location.search]);

  const onSearch = (q) => {
    const trimmed = (q || "").trim();
    setQuery(trimmed);
    // update url so user can share the search
    navigate(
      `/marketplace${trimmed ? `?query=${encodeURIComponent(trimmed)}` : ""}`
    );
  };

  const handleAddToCart = (product) => {
    addItem(
      {
        id: product.id,
        title: product.title,
        price: product.price ?? product.priceLabel ?? "",
        img: product.img,
        vendor: product.vendor,
      },
      1
    );
  };

  // Filtering pipeline
  // NOTE: products is a static import and won't change at runtime, so we omit it from the deps.
  const filteredProducts = useMemo(() => {
    // work on a copy
    let list = products.slice();

    // search query (title, description, vendor)
    if (query && query.trim().length > 0) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          (p.title && p.title.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.vendor && p.vendor.toLowerCase().includes(q)) ||
          (Array.isArray(p.tags) && p.tags.join(" ").toLowerCase().includes(q))
      );
    }

    // category filter
    if (selectedCategory) {
      list = list.filter(
        (p) =>
          p.categoryId === selectedCategory ||
          p.category === selectedCategory ||
          (Array.isArray(p.tags) && p.tags.includes(selectedCategory))
      );
    }

    // vendor filter
    if (selectedVendor) {
      list = list.filter(
        (p) => p.vendorId === selectedVendor || p.vendor === selectedVendor
      );
    }

    // location filter (vendor.location)
    if (locationFilter && locationFilter !== "All Locations") {
      list = list.filter((p) => {
        const v = VENDOR_MAP.get(p.vendorId);
        if (!v) return false;
        return (v.location || "")
          .toLowerCase()
          .includes(locationFilter.toLowerCase());
      });
    }

    // price filter
    if (maxPrice && maxPrice > 0) {
      list = list.filter((p) => {
        const price = parsePriceLabel(p.price ?? p.priceLabel ?? "");
        return price > 0 ? price <= maxPrice : true;
      });
    }

    // rating filter (vendor rating is often a string like "4.8 (120+ reviews)")
    if (minRating && minRating > 0) {
      list = list.filter((p) => {
        const v = VENDOR_MAP.get(p.vendorId);
        if (!v) return false;
        const r = (v.rating || "").toString().match(/(\d+(\.\d+)?)/);
        const rv = r ? parseFloat(r[0]) : 0;
        return rv >= minRating;
      });
    }

    // availability filter - for demo we interpret presence of `inStock: false` or `stock` field
    if (availability === "in") {
      list = list.filter((p) => p.inStock !== false); // treat missing as in-stock
    } else if (availability === "out") {
      list = list.filter((p) => p.inStock === false);
    }

    // sorting
    if (sortBy === "price-asc") {
      list.sort(
        (a, b) =>
          parsePriceLabel(a.price ?? a.priceLabel ?? "") -
          parsePriceLabel(b.price ?? b.priceLabel ?? "")
      );
    } else if (sortBy === "price-desc") {
      list.sort(
        (a, b) =>
          parsePriceLabel(b.price ?? b.priceLabel ?? "") -
          parsePriceLabel(a.price ?? a.priceLabel ?? "")
      );
    } else {
      // relevance / default — keep original order
    }

    return list;
    // omit `products` from deps because it's a static import and not expected to change at runtime
  }, [
    query,
    selectedCategory,
    selectedVendor,
    locationFilter,
    maxPrice,
    minRating,
    availability,
    sortBy,
  ]);

  // Handler passed to Sidebar to update filters
  const onFiltersChange = (filters) => {
    if ("category" in filters) setSelectedCategory(filters.category);
    if ("vendor" in filters) setSelectedVendor(filters.vendor);
    if ("location" in filters) setLocationFilter(filters.location);
    if ("maxPrice" in filters) setMaxPrice(filters.maxPrice ?? 0);
    if ("minRating" in filters) setMinRating(filters.minRating ?? 0);
    if ("availability" in filters)
      setAvailability(filters.availability ?? "any");
    if ("sortBy" in filters) setSortBy(filters.sortBy ?? "relevance");
    if ("query" in filters) setQuery(filters.query ?? "");
  };

  // when user clicks a vendor card in the featured vendors list, we filter to that vendor
  const handleVendorClick = (vendorId) => {
    setSelectedVendor(vendorId);
    // navigate to vendor page as well (optional)
    navigate(`/vendor/${vendorId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0f1a10] text-gray-900 dark:text-gray-100 font-sans">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-3">
            <Sidebar
              categories={categories}
              vendors={vendors}
              selectedCategory={selectedCategory}
              selectedVendor={selectedVendor}
              locationFilter={locationFilter}
              maxPrice={maxPrice}
              minRating={minRating}
              availability={availability}
              sortBy={sortBy}
              onCategoryClick={(slug) => setSelectedCategory(slug)}
              onVendorClick={(vid) => setSelectedVendor(vid)}
              onFiltersChange={onFiltersChange}
            />
          </aside>

          <section className="lg:col-span-9">
            <div className="space-y-8">
              {/* Categories + Search */}
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Categories
                  </h2>
                  <div className="flex items-center gap-4">
                    <SearchInput
                      value={query}
                      onChange={(q) => setQuery(q)}
                      onSearch={onSearch}
                    />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="text-sm rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-2 px-3"
                      aria-label="Sort products"
                    >
                      <option value="relevance">Sort: Relevance</option>
                      <option value="price-asc">Price: Low → High</option>
                      <option value="price-desc">Price: High → Low</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-4">
                  {categories.map((c) => (
                    <CategoryCard
                      key={c.id}
                      {...c}
                      onClick={() => {
                        setSelectedCategory(c.id);
                        navigate(`/category/${c.id}`);
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Vendors */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Featured Vendors
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {vendors.map((v) => (
                    <VendorCard
                      key={v.id}
                      {...v}
                      onClick={() => handleVendorClick(v.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Products */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Shop Fresh Produce
                  </h2>

                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {filteredProducts.length} item(s) found
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((p) => (
                    <ProductCard
                      key={p.id}
                      {...p}
                      onView={() => goToProduct(p.id)}
                      onAdd={() => handleAddToCart(p)}
                    />
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="mt-8 text-center text-gray-500">
                    No products match your filters. Try clearing some filters.
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Marketplace;
