// frontend/src/admin/ProductManagement.jsx - FINAL DYNAMIC VERSION (IMPORTS FIXED)

import React, { useState, useEffect, useCallback } from "react"; // <-- useMemo REMOVED
import AdminHeader from "../components/adminComponents/AdminHeader";
import AdminSidebar from "../components/adminComponents/AdminSidebar";
import axios from "axios";
import {
  Eye,
  MessageSquare,
  Ban,
  AlertTriangle,
  Store,
  Leaf,
  Bike,
  Users,
  Star,
  X,
  Loader2,
  User,
  CheckCircle,
  Trash2,
  Edit2,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

/**
 * Maps DB role keys (singular) to professional display names.
 */
const ROLE_DISPLAY_MAP = {
  buyer: "Buyer",
  vendor: "Vendor (Mama Mboga)",
  farmer: "Farmer (Supplier)",
  rider: "Rider",
  admin: "Admin",
  unknown: "Unknown Role",
};

/* --- Helper Components --- */

const StatusBadge = ({ status }) => {
  let classes =
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-wide ";
  const lowerStatus = (status || "").toLowerCase();

  if (
    lowerStatus === "active" ||
    lowerStatus === "online" ||
    lowerStatus === "in stock"
  ) {
    classes += "bg-emerald-100 text-emerald-700 font-semibold";
  } else if (
    lowerStatus === "suspended" ||
    lowerStatus === "out of stock" ||
    lowerStatus === "offline"
  ) {
    classes += "bg-red-100 text-red-700 font-semibold";
  } else if (lowerStatus === "pending") {
    classes += "bg-amber-100 text-amber-800 font-semibold";
  } else {
    classes += "bg-stone-100 text-stone-600";
  }
  return <span className={classes}>{status}</span>;
};

const ToggleSwitch = ({ checked, onChange }) => (
  <label className="relative inline-block w-10 h-6">
    <input
      type="checkbox"
      className="opacity-0 w-0 h-0 peer"
      checked={!!checked}
      onChange={(e) => onChange(e.target.checked)}
    />
    <span
      className="absolute cursor-pointer inset-0 bg-stone-300 rounded-full transition-colors duration-200 
                 peer-checked:bg-emerald-600 after:absolute after:content-[''] after:h-5 after:w-5 after:left-[2px] 
                 after:bottom-[2px] after:bg-white after:rounded-full after:transition-transform after:duration-200 
                 peer-checked:after:translate-x-4"
      aria-hidden="true"
    ></span>
  </label>
);

const typeIconMap = {
  Retail: Store,
  Bulk: Leaf,
};

// --- Product Fetch API Function (Declaration here for local use only) ---
// NOTE: These internal fetch functions replace the need for separate api/admin.js calls
// which were causing the initial import confusion and dependency issue.
const fetchAdminProductsInternal = async (type = "all", q = "") => {
  const response = await axios.get(`${API_BASE}/api/admin/products`, {
    params: { type, q },
    withCredentials: true,
  });
  return response.data;
};

const updateProductStatusInternal = async (id, type, isSuspended) => {
  const urlType = type.toLowerCase();
  const response = await axios.patch(
    `${API_BASE}/api/admin/products/${urlType}/${id}/status`,
    {
      isSuspended,
    },
    {
      withCredentials: true,
    }
  );
  return response.data;
};

const deleteProductInternal = async (id, type) => {
  const urlType =
    type.toLowerCase() === "retail"
      ? `${API_BASE}/api/products/${id}`
      : `${API_BASE}/api/bulk-products/${id}`;

  await axios.delete(urlType, { withCredentials: true });
  return true;
};

/* --- Main Product Table --- */
function ProductTable({ products, loading, onEdit, onDelete, onStatusToggle }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-0 overflow-hidden border border-stone-200">
      <table className="min-w-full divide-y divide-stone-100">
        <thead className="bg-emerald-50/50">
          <tr>
            <th className="px-4 py-4 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">
              Product
            </th>
            <th className="px-4 py-4 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">
              Category
            </th>
            <th className="px-4 py-4 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">
              Type
            </th>
            <th className="px-4 py-4 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">
              Owner
            </th>
            <th className="px-4 py-4 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">
              Price/Stock
            </th>
            <th className="px-4 py-4 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-4 text-right text-xs font-semibold text-stone-700 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="7" className="py-12 text-center text-stone-500">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-500" />
                Fetching inventory...
              </td>
            </tr>
          ) : products.length === 0 ? (
            <tr>
              <td colSpan="7" className="py-12 text-center text-stone-500">
                No products found matching criteria.
              </td>
            </tr>
          ) : (
            products.map((p) => {
              const TypeIcon = typeIconMap[p.type] || Package;
              // Check for suspended status based on the status string
              const isSuspended =
                p.status && p.status.toLowerCase() === "suspended";

              return (
                <tr
                  key={p.id}
                  className="border-t border-stone-100 hover:bg-emerald-50/50 cursor-pointer transition duration-150"
                >
                  <td className="px-4 py-3 text-sm font-medium text-stone-900">
                    {p.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-stone-600">
                    {p.category}
                  </td>
                  <td className="px-4 py-3 text-sm text-stone-600 flex items-center gap-2">
                    <TypeIcon
                      size={16}
                      className={
                        p.type === "Retail" ? "text-blue-500" : "text-green-600"
                      }
                    />
                    {p.type}
                  </td>
                  <td className="px-4 py-3 text-sm text-stone-600">
                    <span className="font-medium text-stone-900">
                      {p.ownerName}
                    </span>
                    <div className="text-xs text-stone-500 capitalize">
                      {p.ownerRole}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-stone-600">
                    <span className="font-semibold text-emerald-700">
                      {p.priceLabel}
                    </span>
                    <div className="text-xs">{p.stock} in stock</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-stone-600">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center space-x-3">
                      {/* SUSPEND / ACTIVATE BUTTON */}
                      <button
                        title={
                          isSuspended ? "Activate Product" : "Suspend Product"
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          onStatusToggle(p.id, p.type, isSuspended);
                        }}
                        className={`p-1 rounded-md transition ${
                          isSuspended
                            ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                            : "bg-red-50 text-red-600 hover:bg-red-100"
                        }`}
                      >
                        {isSuspended ? (
                          <CheckCircle size={16} />
                        ) : (
                          <Ban size={16} />
                        )}
                      </button>

                      {/* EDIT BUTTON */}
                      <button
                        title="Edit Details"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(p);
                        }}
                        className="text-blue-600 hover:text-blue-800 p-1 bg-blue-50 rounded-md transition"
                      >
                        <Edit2 size={16} />
                      </button>

                      {/* DELETE BUTTON */}
                      <button
                        title="Delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(p.id, p.type);
                        }}
                        className="text-red-600 hover:text-red-800 p-1 bg-red-50 rounded-md transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

/* --- Main Page Component --- */
export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters
  const [productTypeFilter, setProductTypeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // 1. Fetching Logic
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Use the internal fetch function
      const response = await fetchAdminProductsInternal(
        productTypeFilter,
        searchQuery
      );

      setProducts(response);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError("Failed to load product inventory.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [productTypeFilter, searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleStatusToggle = useCallback(
    async (id, type, currentIsSuspended) => {
      const action = currentIsSuspended ? "Activate" : "Suspend";
      if (
        !window.confirm(
          `Are you sure you want to ${action} this ${type} product?`
        )
      ) {
        return;
      }

      setLoading(true);
      try {
        // Use the internal update function
        await updateProductStatusInternal(id, type, !currentIsSuspended);

        // Re-fetch data to reflect the new status
        await fetchProducts();
      } catch (err) {
        console.error("Status Update Failed:", err);
        setError(
          `Failed to ${action} product: ${
            err?.response?.data?.message || err.message
          }`
        );
      } finally {
        setLoading(false);
      }
    },
    [fetchProducts]
  );

  const handleEdit = (product) => {
    alert(
      `Editing product: ${product.name} (ID: ${product.id}). This would open an Edit Modal.`
    );
  };

  const handleDelete = async (id, type) => {
    if (
      !window.confirm(
        `Are you sure you want to permanently delete this ${type} product?`
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      // Use the internal delete function
      await deleteProductInternal(id, type);

      await fetchProducts(); // Refresh list on success
    } catch (err) {
      console.error("Delete Failed:", err);
      setError(
        `Failed to delete product: ${
          err?.response?.data?.message || err.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="flex min-h-screen">
        <div className="hidden md:block">
          <AdminSidebar />
        </div>

        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-30 bg-white border-b border-stone-200">
            <AdminHeader />
          </header>

          <main className="flex-1 p-8 bg-stone-50">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-stone-900">
                  Inventory Management
                </h1>
                {error && (
                  <div className="text-red-600 text-sm bg-red-100 p-2 rounded-lg border border-red-200">
                    {error}
                  </div>
                )}
              </div>

              {/* Controls row: Filter and Search */}
              <div className="flex items-center justify-between gap-4 mb-6 p-4 bg-white rounded-xl shadow-sm border border-stone-200">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-stone-700">
                    Filter by Type
                  </label>
                  <select
                    value={productTypeFilter}
                    onChange={(e) => setProductTypeFilter(e.target.value)}
                    className="rounded-lg border border-stone-300 px-3 py-2 bg-white text-sm focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="all">All Inventory</option>
                    <option value="retail">Retail (Vendor) Listings</option>
                    <option value="bulk">Bulk (Farmer) Listings</option>
                  </select>
                </div>

                {/* Search Input */}
                <div className="relative">
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, category, or owner"
                    className="w-64 rounded-full border border-stone-300 px-4 py-2 bg-white text-sm shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 pl-10"
                  />
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-lg">
                    search
                  </span>
                </div>
              </div>

              {/* Product Table */}
              <ProductTable
                products={products}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusToggle={handleStatusToggle}
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
