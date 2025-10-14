// frontend/src/vendor/VendorProductManagement.jsx
import React, { useEffect, useRef, useState } from "react";
import { Edit2, Trash2, Plus, X } from "lucide-react";
import Header from "../components/vendorComponents/Header";
import Footer from "../components/vendorComponents/Footer"; 
import { vendorCategories } from "../constants";

/**
 * VendorProductManagement
 * - image upload (reads file, converts to base64 data URL for preview & storage)
 * - category dropdown uses vendorCategories from constants
 * - add / edit / delete persisted to localStorage (STORAGE_KEY)
 *
 * Notes:
 * - For production, replace client-side base64 storage with server upload (S3/Cloudinary) and store only URLs.
 * - Keep vendorCategories authoritative; label is used for product.category.
 */

const STORAGE_KEY = "vendor_products_v2";

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
function writeStored(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

async function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);
    const reader = new FileReader();
    reader.onerror = () => {
      reader.abort();
      reject(new Error("Problem reading file."));
    };
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

function normalizePriceInput(val = "") {
  // allow "120", "Ksh 120", "120.00", etc -> "KSh 120" (string) and numeric cents not needed
  const digits = String(val).replace(/[^\d.]/g, "");
  if (!digits) return { label: "KSh 0", number: 0 };
  const n = Number(digits);
  return { label: `KSh ${n}`, number: isFinite(n) ? n : 0 };
}

export default function VendorProductManagement() {
  const [products, setProducts] = useState(() => {
    const stored = readStored();
    if (stored && Array.isArray(stored) && stored.length) return stored;
    // reasonable initial set (images empty)
    return [
      {
        id: 1,
        image: "",
        name: "Ripe Tomatoes",
        category: "Vegetables",
        priceLabel: "KSh 120",
        price: 120,
        stock: "50 kg",
        status: "In Stock",
      },
      {
        id: 2,
        image: "",
        name: "Red Potatoes",
        category: "Vegetables",
        priceLabel: "KSh 80",
        price: 80,
        stock: "100 kg",
        status: "In Stock",
      },
      {
        id: 3,
        image: "",
        name: "Cavendish Bananas",
        category: "Fruits",
        priceLabel: "KSh 60",
        price: 60,
        stock: "200 kg",
        status: "In Stock",
      },
      {
        id: 4,
        image: "",
        name: "White Onions",
        category: "Vegetables",
        priceLabel: "KSh 90",
        price: 90,
        stock: "75 kg",
        status: "In Stock",
      },
      {
        id: 5,
        image: "",
        name: "Kent Mangoes",
        category: "Fruits",
        priceLabel: "KSh 150",
        price: 150,
        stock: "30 kg",
        status: "Out of Stock",
      },
    ];
  });

  // modal + form state
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const fileInputRef = useRef(null);
  const firstInputRef = useRef(null);

  const [form, setForm] = useState({
    imageDataUrl: "", // base64 or remote url
    name: "",
    category: vendorCategories?.[0]?.label ?? "",
    priceLabel: "",
    price: 0,
    stock: "",
    status: "In Stock",
  });

  // persist products
  useEffect(() => writeStored(products), [products]);

  // helper: reset form to defaults
  function resetForm() {
    setForm({
      imageDataUrl: "",
      name: "",
      category: vendorCategories?.[0]?.label ?? "",
      priceLabel: "",
      price: 0,
      stock: "",
      status: "In Stock",
    });
    setFormErrors({});
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // open add modal
  function handleAddOpen() {
    resetForm();
    setOpen(true);
    requestAnimationFrame(() => firstInputRef.current?.focus());
  }

  // open edit modal (prefill)
  function handleEditOpen(product) {
    setForm({
      imageDataUrl: product.image || "",
      name: product.name || "",
      category: product.category || (vendorCategories?.[0]?.label ?? ""),
      priceLabel:
        product.priceLabel || product.price ? `KSh ${product.price}` : "",
      price: product.price ?? 0,
      stock: product.stock || "",
      status: product.status || "In Stock",
    });
    setEditingId(product.id);
    setOpen(true);
    requestAnimationFrame(() => firstInputRef.current?.focus());
  }

  // delete product
  function handleDelete(id) {
    const ok = window.confirm("Delete this product? This cannot be undone.");
    if (!ok) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  // handle file select -> convert to data URL
  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    // basic size check (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFormErrors((s) => ({ ...s, image: "Image must be under 5MB." }));
      return;
    }
    try {
      const dataUrl = await fileToDataUrl(file);
      setForm((s) => ({ ...s, imageDataUrl: dataUrl }));
      setFormErrors((s) => ({ ...s, image: undefined }));
    } catch {
      setFormErrors((s) => ({ ...s, image: "Failed to read image." }));
    }
  }

  // remove selected image
  function handleRemoveImage() {
    setForm((s) => ({ ...s, imageDataUrl: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // price input change
  function handlePriceChange(val) {
    const { label, number } = normalizePriceInput(val);
    setForm((s) => ({ ...s, priceLabel: label, price: number }));
  }

  // basic validation
  function validateForm() {
    const errors = {};
    if (!form.name || String(form.name).trim().length < 2)
      errors.name = "Product name is required (min 2 characters).";
    if (!form.category) errors.category = "Please choose a category.";
    if (!form.price || Number(form.price) <= 0)
      errors.price = "Enter a valid price.";
    // optional: stock non-empty
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  // submit add/edit
  function handleSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;

    const cleaned = {
      image: form.imageDataUrl || "",
      name: form.name.trim(),
      category: form.category,
      priceLabel: form.priceLabel || `KSh ${form.price}`,
      price: Number(form.price) || 0,
      stock: form.stock || "0",
      status: form.status || "In Stock",
    };

    if (editingId) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingId ? { ...p, ...cleaned } : p))
      );
    } else {
      // robust id generation
      const id = Date.now() + Math.floor(Math.random() * 1000);
      setProducts((prev) => [{ id, ...cleaned }, ...prev]);
    }

    setOpen(false);
    resetForm();
  }

  // keyboard: close modal on Esc
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape" && open) {
        setOpen(false);
        resetForm();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header
        avatarUrl="https://via.placeholder.com/150"
        userName="Daniel Mutuku"
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold">My Products</h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage the items you sell. Upload real images and categorize
              products.
            </p>
          </div>

          <button
            onClick={handleAddOpen}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow"
            aria-label="Add product"
            title="Add product"
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
              {products.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    No products found. Click "Add Product" to create your first
                    product.
                  </td>
                </tr>
              )}

              {products.map((product, index) => (
                <tr
                  key={product.id}
                  className={
                    index !== products.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }
                >
                  <td className="py-4 px-6">
                    <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-2xl">
                          {/* fallback emoji or placeholder */}📦
                        </div>
                      )}
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
                        onClick={() => handleEditOpen(product)}
                        className="text-gray-600 hover:text-gray-900"
                        aria-label={`Edit ${product.name}`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-500 hover:text-red-700"
                        aria-label={`Delete ${product.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <Footer /> {/* 👈 The reusable Footer component is now used here */}
    </div>
  );
}