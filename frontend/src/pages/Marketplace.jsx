import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import CategoryCard from "../components/CategoryCard";
import VendorCard from "../components/VendorCard";
import ProductCard from "../components/ProductCard";
import SearchInput from "../components/SearchInput";
import Footer from "../components/FooterSection";
import Pagination from "../components/Pagination"; // <-- This is now used correctly
import { categories as hardCodedCategories } from "../constants";
import { useCart } from "../context/CartContext";
import {
  fetchProducts as apiFetchProducts,
  fetchVendorFilters,
} from "../api/products";

// REMOVED DefaultProductGrid component

const Marketplace = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();

  const [productData, setProductData] = useState({
    products: [],
    totalPages: 1,
    currentPage: 1,
    totalProducts: 0,
  });
  const [filterData, setFilterData] = useState({ vendors: [], locations: [] });
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [query, setQuery] = useState(searchParams.get("q") || "");

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
          if (key !== "page") {
            newParams.delete("page");
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

  // This effect now runs ALWAYS to fetch products
  useEffect(() => {
    setLoading(true);
    setFetchError(null);

    const params = {};
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }

    if (!params.page) {
      params.page = "1";
    }
    if (!params.status) {
      params.status = "In Stock";
    }
    if (params.status === "Any") {
      delete params.status;
    }
    if (params.maxPrice === "10000") {
      delete params.maxPrice;
    }

    // Always fetch products
    apiFetchProducts(params)
      .then((data) => {
        if (data && Array.isArray(data.products)) {
          setProductData(data);
        } else {
          setProductData({
            products: [],
            totalPages: 1,
            currentPage: 1,
            totalProducts: 0,
          });
        }
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setFetchError(String(err));
        setProductData({
          products: [],
          totalPages: 1,
          currentPage: 1,
          totalProducts: 0,
        });
      })
      .finally(() => {
        setLoading(false);
      });
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

  const onPageChange = (newPage) => {
    updateQuery("page", newPage);
  };

  // This logic is now correct: isFiltering is true if any param *other than page* exists.
  const isFiltering =
    searchParams.size > 0 &&
    (searchParams.has("page") ? searchParams.size > 1 : true);

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

  const { products, totalPages, currentPage, totalProducts } = productData;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0f1a10] text-gray-900 dark:text-gray-100 font-sans">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-3">
            <Sidebar categories={hardCodedCategories} filterData={filterData} />
          </aside>

          <section className="lg:col-span-9">
            {/* This is the key change. We use isFiltering to show/hide these sections */}
            {!isFiltering ? (
              // --- DEFAULT BROWSE VIEW (Top Half) ---
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
                  <div className="flex overflow-x-auto gap-6 pb-4">
                    {filterData.vendors.map((v) => (
                      <VendorCard
                        key={v._id}
                        id={v.user?._id}
                        name={v.businessName}
                        img={v.user?.avatar}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              // --- FILTERING VIEW (Top Half) ---
              // This empty div ensures the "Shop Fresh Produce" grid aligns correctly
              <div></div>
            )}

            {/* --- MAIN PRODUCT GRID (always shows) --- */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {getPageTitle()}
                </h2>
                <div className="flex items-center gap-4">
                  {/* Show Clear button only if filters are active */}
                  {isFiltering && (
                    <button
                      onClick={() => {
                        setQuery("");
                        setSearchParams({}, { replace: true });
                      }}
                      className="text-sm text-emerald-600 hover:underline"
                    >
                      Clear All Filters
                    </button>
                  )}
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
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                {loading ? "..." : totalProducts} item(s) found
              </div>

              <div className="mt-6">
                {loading ? (
                  <div className="text-center py-12">Loading products...</div>
                ) : fetchError ? (
                  <div className="text-center py-12 text-red-600">
                    Failed to load products. Please try again.
                  </div>
                ) : products.length > 0 ? (
                  <>
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
                    {/* Pagination component is now always here */}
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={onPageChange}
                    />
                  </>
                ) : (
                  <div className="mt-8 text-center text-gray-500">
                    No products match your filters.
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
