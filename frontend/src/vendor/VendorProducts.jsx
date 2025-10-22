// frontend/src/vendor/VendorProductManagement.jsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Edit2, Trash2, Plus, X } from "lucide-react";
import Header from "../components/vendorComponents/Header";
import Footer from "../components/vendorComponents/Footer";
import { vendorCategories } from "../constants";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api/products";
import { useAuth } from "../context/AuthContext";

/* same constants as before */
const API_BASE = import.meta.env.VITE_API_BASE || "";
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const DEFAULT_PLACEHOLDER =
  "https://images.unsplash.com/photo-1518976024611-0a4e3d1c9f05?auto=format&fit=crop&w=1200&q=60";

export default function VendorProductManagement() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // modal/form state
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const fileInputRef = useRef(null);
  const firstInputRef = useRef(null);

  const [form, setForm] = useState({
    file: null,
    imagePreview: "",
    name: "",
    category: vendorCategories?.[0]?.label ?? "",
    priceLabel: "",
    price: 0,
    stock: "",
    status: "In Stock",
    description: "",
  });

  // load products for current user only
  const load = useCallback(
    async (opts = {}) => {
      setLoading(true);
      try {
        // if user is not logged in, show empty list (safer)
        if (!user || !(user._id || user.id)) {
          setProducts([]);
          return;
        }

        // pass vendorId so backend filters to that vendor's products
        const params = { vendorId: String(user._id || user.id), ...opts };
        const data = await fetchProducts(params);
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  useEffect(() => {
    load();
  }, [load]);

  function resetForm() {
    setForm({
      file: null,
      imagePreview: "",
      name: "",
      category: vendorCategories?.[0]?.label ?? "",
      priceLabel: "",
      price: 0,
      stock: "",
      status: "In Stock",
      description: "",
    });
    setFormErrors({});
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function openAdd() {
    resetForm();
    setEditingId(null);
    setOpen(true);
    requestAnimationFrame(() => firstInputRef.current?.focus());
  }

  function openEdit(product) {
    setForm({
      file: null,
      imagePreview: product.imagePath || product.image || "",
      name: product.name || "",
      category: product.category || vendorCategories?.[0]?.label,
      priceLabel:
        product.priceLabel || (product.price ? `KSh ${product.price}` : ""),
      price: product.price || 0,
      stock: product.stock || "",
      status: product.status || "In Stock",
      description: product.description || "",
    });
    setEditingId(product._id || product.id);
    setOpen(true);
    requestAnimationFrame(() => firstInputRef.current?.focus());
  }

  async function handleDelete(id) {
    const ok = window.confirm("Delete this product? This cannot be undone.");
    if (!ok) return;
    try {
      await deleteProduct(id);
      setProducts((p) => p.filter((x) => (x._id || x.id) !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    }
  }

  function fileToPreview(file) {
    return new Promise((resolve, reject) => {
      if (!file) return resolve("");
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_BYTES) {
      setFormErrors((s) => ({ ...s, image: "Image must be under 5MB." }));
      return;
    }
    try {
      const preview = await fileToPreview(file);
      setForm((s) => ({ ...s, file, imagePreview: preview }));
      setFormErrors((s) => ({ ...s, image: undefined }));
    } catch (err) {
      console.error(err);
      setFormErrors((s) => ({ ...s, image: "Failed to read image." }));
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer?.files?.[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_BYTES) {
      setFormErrors((s) => ({ ...s, image: "Image must be under 5MB." }));
      return;
    }
    fileToPreview(file)
      .then((preview) =>
        setForm((s) => ({ ...s, file, imagePreview: preview }))
      )
      .catch(() =>
        setFormErrors((s) => ({ ...s, image: "Failed to read dropped file." }))
      );
  }
  function preventDefault(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function handlePriceChange(val) {
    const digits = String(val).replace(/[^\d.]/g, "");
    const n = Number(digits) || 0;
    setForm((s) => ({ ...s, priceLabel: `KES ${n}`, price: n }));
  }

  function validateForm() {
    const errors = {};
    if (!form.name || String(form.name).trim().length < 2)
      errors.name = "Product name required (min 2 chars)";
    if (!form.category) errors.category = "Select a category";
    if (!form.price || Number(form.price) <= 0)
      errors.price = "Enter a valid price (> 0)";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;

    const fd = new FormData();
    fd.append("name", form.name.trim());
    fd.append("category", form.category);
    fd.append("priceLabel", form.priceLabel);
    fd.append("price", String(form.price));
    fd.append("stock", form.stock);
    fd.append("status", form.status);
    fd.append("description", form.description || "");

    if (form.file) fd.append("image", form.file);

    // also append vendorId explicitly as fallback if we have user
    if (user && (user._id || user.id)) {
      fd.append("vendorId", String(user._id || user.id));
    }

    try {
      if (editingId) {
        await updateProduct(editingId, fd);
      } else {
        await createProduct(fd);
      }
      await load();
      setOpen(false);
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Failed to save product. See console for details.");
    }
  }

  function resolveImageUrl(imagePath) {
    if (!imagePath) return DEFAULT_PLACEHOLDER;
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://"))
      return imagePath;
    if (API_BASE)
      return `${API_BASE.replace(/\/$/, "")}${
        imagePath.startsWith("/") ? imagePath : `/${imagePath}`
      }`;
    return `${window.location.origin}${
      imagePath.startsWith("/") ? imagePath : `/${imagePath}`
    }`;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header
        avatarUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuDeL7radWSj-FEteEjqLpufXII3-tc_o7GMvLvB07AaD_bYBkfAcIOnNbOXkTdMOHRgJQwLZE-Z_iw72Bd8bpHzfXP_m0pIvteSw7FKZ1qV9GD1KfgyDVG90bCO7OGe6JyYIkm9DBo2ArC60uEqSfDvnnYWeo6IqVEjWxsVX6dUoxjm9ozyVlriiMdVLc_jU9ZxS01QcxNa8hn-ePNbB6IcXSwExf2U61R-epab8nsOkbq95E7z6b-fH4zOt0j2MPt20nrqtPM1NHI"
        userName={user?.name || "Vendor"}
      />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold">My Products</h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage your products here, Upload good images and provide good
              description.
            </p>
          </div>

          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-emerald-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                  Image
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                  Product Name
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                  Category
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                  Price/Unit
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                  Stock
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} className="p-8 text-center">
                    Loading...
                  </td>
                </tr>
              )}

              {!loading && products.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center">
                    No products yet.
                  </td>
                </tr>
              )}

              {!loading &&
                products.map((product, idx) => {
                  const id = product._id || product.id;
                  return (
                    <tr
                      key={id}
                      className={
                        idx !== products.length - 1
                          ? "border-b border-gray-100"
                          : ""
                      }
                    >
                      <td className="py-4 px-6">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border">
                          <img
                            src={resolveImageUrl(
                              product.imagePath || product.image || ""
                            )}
                            alt={product.name || "product"}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = DEFAULT_PLACEHOLDER;
                            }}
                          />
                        </div>
                      </td>

                      <td className="py-4 px-6 text-sm text-gray-900">
                        {product.name}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {product.category}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-900">
                        {product.priceLabel}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-900">
                        {product.stock}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded text-xs font-medium ${
                            product.status === "In Stock"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => openEdit(product)}
                            className="text-gray-600 hover:text-gray-900"
                            aria-label={`Edit ${product.name}`}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(id)}
                            className="text-red-500 hover:text-red-700"
                            aria-label={`Delete ${product.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 md:items-center">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => {
              setOpen(false);
              resetForm();
            }}
            aria-hidden
          />

          <form
            onSubmit={handleSubmit}
            className="relative z-10 w-full max-w-3xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            {/* form content (unchanged from above) */}
            {/* ... copy the same modal content from earlier; omitted here for brevity in paste */}
            {/* but when you paste into your project use the whole modal code from above */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">
                {editingId ? "Edit Product" : "Add Product"}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    resetForm();
                  }}
                  className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium mb-2">
                  Product image
                </label>

                <div
                  onDrop={handleDrop}
                  onDragOver={preventDefault}
                  onDragEnter={preventDefault}
                  onDragLeave={preventDefault}
                  className="w-full aspect-[4/3] bg-gray-50 rounded-md overflow-hidden flex items-center justify-center mb-2 border border-dashed border-gray-200 hover:border-gray-300 cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                >
                  {form.imagePreview ? (
                    <img
                      src={form.imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center px-4">
                      <div className="text-gray-400 mb-1">
                        Drag & drop or click to browse
                      </div>
                      <div className="text-xs text-gray-500">
                        PNG, JPG, HEIC — max 5MB
                      </div>
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="sr-only"
                />
                {formErrors.image && (
                  <div className="text-sm text-red-600 mt-1">
                    {formErrors.image}
                  </div>
                )}
                {form.imagePreview && (
                  <button
                    type="button"
                    onClick={() =>
                      setForm((s) => ({ ...s, file: null, imagePreview: "" }))
                    }
                    className="text-sm text-red-600 mt-2"
                  >
                    Remove image
                  </button>
                )}
              </div>

              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Product name
                  </label>
                  <input
                    ref={firstInputRef}
                    value={form.name}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, name: e.target.value }))
                    }
                    placeholder="E.g. Ripe tomatoes (sack)"
                    className="w-full rounded-md border px-3 py-2"
                    required
                  />
                  {formErrors.name && (
                    <div className="text-sm text-red-600 mt-1">
                      {formErrors.name}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, category: e.target.value }))
                    }
                    className="w-full rounded-md border px-3 py-2"
                    required
                  >
                    {vendorCategories?.map((c) => (
                      <option key={c.label} value={c.label}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  {formErrors.category && (
                    <div className="text-sm text-red-600 mt-1">
                      {formErrors.category}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Price / Unit
                  </label>
                  <input
                    value={form.priceLabel}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    placeholder="KES 120"
                    className="w-full rounded-md border px-3 py-2"
                    required
                  />
                  {formErrors.price && (
                    <div className="text-sm text-red-600 mt-1">
                      {formErrors.price}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Stock / Unit qty
                  </label>
                  <input
                    value={form.stock}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, stock: e.target.value }))
                    }
                    placeholder="E.g. 50 kg"
                    className="w-full rounded-md border px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, status: e.target.value }))
                    }
                    className="w-full rounded-md border px-3 py-2"
                  >
                    <option>In Stock</option>
                    <option>Out of Stock</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Optional description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, description: e.target.value }))
                    }
                    className="w-full rounded-md border px-3 py-2"
                    rows={3}
                    placeholder="Short description for buyers (ripeness, packing, etc.)"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  resetForm();
                }}
                className="px-4 py-2 rounded-lg border"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white"
              >
                {editingId ? "Save Changes" : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
