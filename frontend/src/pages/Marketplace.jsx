import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import CategoryCard from "../components/CategoryCard";
import VendorCard from "../components/VendorCard";
import ProductCard from "../components/ProductCard";
import SearchInput from "../components/SearchInput";
import Footer from "../components/FooterSection";
import { categories as hardCodedCategories } from "../constants";
import { useCart } from "../context/CartContext";
import {
  fetchProducts as apiFetchProducts,
  fetchVendorFilters,
} from "../api/products";

// --- NEW COMPONENT to fetch default products ---
const DefaultProductGrid = ({ onAddToCart, onProductClick }) => {
  const [defaultProducts, setDefaultProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetchProducts({ status: "In Stock", limit: 8 })
      .then((data) => {
        if (Array.isArray(data)) setDefaultProducts(data);
      })
      .catch((err) => console.error("Failed to load default products:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading products...</div>;
  }

  if (defaultProducts.length === 0) {
    return (
      <div className="mt-8 text-center text-gray-500">
        No products are available right now.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {defaultProducts.map((p) => (
        <ProductCard
          key={p.id ?? p._id}
          {...p}
          onView={() => onProductClick(p.id ?? p._id)}
          onAdd={() => onAddToCart(p)}
        />
      ))}
    </div>
  );
};
// --- END NEW COMPONENT ---

const Marketplace = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [filterData, setFilterData] = useState({ vendors: [], locations: [] });
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [query, setQuery] = useState(searchParams.get("q") || "");

  // MODIFIED: Wrapped in useCallback to fix dependency array warning
  const updateQuery = useCallback(
    (key, value) => {
      setSearchParams(
        (prev) => {
          const newParams = new URLSearchParams(prev);
          if (value) {
            newParams.set(key, value);
          } else {
            newParams.delete(key);
          }
          return newParams;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  useEffect(() => {
    fetchVendorFilters()
      .then(setFilterData)
      .catch((err) => console.error("Failed to fetch vendor filters:", err));
  }, []);

  useEffect(() => {
    setLoading(true);
    setFetchError(null);

    const params = {};
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }

    if (!params.status && searchParams.size > 0) {
      params.status = "In Stock";
    }

    if (params.status === "Any") {
      delete params.status;
    }
    if (params.maxPrice === "10000") {
      delete params.maxPrice;
    }

    if (searchParams.size > 0) {
      apiFetchProducts(params)
        .then((data) => {
          if (Array.isArray(data)) setProducts(data);
          else setProducts([]);
        })
        .catch((err) => {
          console.error("Failed to fetch products:", err);
          setFetchError(String(err));
          setProducts([]);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (query !== (searchParams.get("q") || "")) {
        updateQuery("q", query);
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [query, searchParams, updateQuery]);

  const goToProduct = useCallback(
    (id) => navigate(`/product/${id}`),
    [navigate]
  );

  const handleAddToCart = (product) => {
    addItem(
      {
        id: product.id || product._id,
        title: product.title || product.name || "",
        price: product.price,
        unit: product.unit,
        priceLabel: `KES ${product.price} ${product.unit || ""}`.trim(),
        img: product.img || product.image || product.imagePath,
        vendor:
          product.vendor ||
          product.vendorName ||
          product.vendorBusiness ||
          product.vendorId ||
          "",
      },
      1
    );
  };

  const onSearch = (q) => {
    setQuery(q);
    updateQuery("q", q);
  };

  const onSearchChange = (q) => {
    setQuery(q);
  };

  const onSortChange = (e) => {
    updateQuery("sortBy", e.target.value);
  };

  const isFiltering = searchParams.size > 0;
  const currentCategory = searchParams.get("category");
  const currentSort = searchParams.get("sortBy") || "relevance";

  const getPageTitle = () => {
    if (currentCategory) return currentCategory;
    if (searchParams.get("vendorId")) {
      const vendor = filterData.vendors.find(
        (v) => v.user?._id === searchParams.get("vendorId")
      );
      return vendor?.businessName || "Vendor Products";
    }
    if (searchParams.get("q")) return `Search for "${searchParams.get("q")}"`;
    return "Shop Fresh Produce";
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0f1a10] text-gray-900 dark:text-gray-100 font-sans">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-3">
            <Sidebar categories={hardCodedCategories} filterData={filterData} />
          </aside>

          <section className="lg:col-span-9">
            {isFiltering ? (
              // --- FILTERING VIEW ---
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {getPageTitle()}
                    </h2>
                    <button
                      onClick={() => {
                        setQuery("");
                        setSearchParams({}, { replace: true });
                      }}
                      className="text-sm text-emerald-600 hover:underline"
                    >
                      Clear All Filters
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {loading ? "..." : products.length} item(s) found
                    </div>
                    <div className="flex items-center gap-4">
                      <SearchInput
                        value={query}
                        onChange={onSearchChange}
                        onSearch={onSearch}
                      />
                      <select
                        value={currentSort}
                        onChange={onSortChange}
                        className="text-sm rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-2 px-3"
                        aria-label="Sort products"
                      >
                        <option value="relevance">Sort: Relevance</option>
                        <option value="price-asc">Price: Low → High</option>
                        <option value="price-desc">Price: High → Low</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6">
                    {loading ? (
                      <div className="text-center py-12">
                        Loading products...
                      </div>
                    ) : fetchError ? (
                      <div className="text-center py-12 text-red-600">
                        Failed to load products. Please try again.
                      </div>
                    ) : products.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((p) => (
                          <ProductCard
                            key={p.id ?? p._id}
                            {...p}
                            onView={() => goToProduct(p.id ?? p._id)}
                            onAdd={() => handleAddToCart(p)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="mt-8 text-center text-gray-500">
                        No products match your filters. Try clearing some
                        filters.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              // --- DEFAULT BROWSE VIEW ---
              <div className="space-y-8">
                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Categories
                    </h2>
                    <SearchInput
                      value={query}
                      onChange={onSearchChange}
                      onSearch={onSearch}
                    />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-4">
                    {hardCodedCategories.map((c) => (
                      <CategoryCard key={c.id} {...c} />
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Featured Vendors
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    {filterData.vendors.slice(0, 8).map((v) => (
                      <VendorCard
                        key={v._id}
                        id={v.user?._id} // Link to user ID
                        name={v.businessName}
                        img={v.user?.avatar} // Pass avatar
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Shop Fresh Produce
                  </h2>
                  <DefaultProductGrid
                    onAddToCart={handleAddToCart}
                    onProductClick={goToProduct}
                  />
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Marketplace;
