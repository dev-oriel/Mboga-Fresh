// frontend/src/vendor/VendorProductManagement.jsx
import React, { useEffect, useState } from "react";
import { Edit2, Trash2, Plus, X } from "lucide-react";
import Header from "../components/vendorComponents/Header";

const STORAGE_KEY = "vendor_products_v1";

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

export default function VendorProductManagement() {
  const [products, setProducts] = useState(() => {
    const stored = readStored();
    if (stored && Array.isArray(stored) && stored.length) return stored;
    // initial defaults
    return [
      { id: 1, image: "🍅", name: "Ripe Tomatoes", category: "Vegetables", price: "Ksh 120", stock: "50 kg", status: "In Stock" },
      { id: 2, image: "🥔", name: "Red Potatoes", category: "Vegetables", price: "Ksh 80", stock: "100 kg", status: "In Stock" },
      { id: 3, image: "🍌", name: "Cavendish Bananas", category: "Fruits", price: "Ksh 60", stock: "200 kg", status: "In Stock" },
      { id: 4, image: "🧅", name: "White Onions", category: "Vegetables", price: "Ksh 90", stock: "75 kg", status: "In Stock" },
      { id: 5, image: "🥭", name: "Kent Mangoes", category: "Fruits", price: "Ksh 150", stock: "30 kg", status: "Out of Stock" },
    ];
  });

  // modal state
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null); // product id or null
  const [form, setForm] = useState({
    image: "",
    name: "",
    category: "",
    price: "",
    stock: "",
    status: "In Stock",
  });

  // keep localStorage in sync
  useEffect(() => writeStored(products), [products]);

  // utility to reset form
  const resetForm = () =>
    setForm({ image: "", name: "", category: "", price: "", stock: "", status: "In Stock" });

  // open add modal
  const handleAddOpen = () => {
    resetForm();
    setEditing(null);
    setOpen(true);
    // focus handled by autofocus attribute on first input
  };

  // open edit modal and fill
  const handleEditOpen = (product) => {
    setForm({
      image: product.image || "",
      name: product.name || "",
      category: product.category || "",
      price: product.price || "",
      stock: product.stock || "",
      status: product.status || "In Stock",
    });
    setEditing(product.id);
    setOpen(true);
  };

  // delete with confirmation
  const handleDelete = (id) => {
    const ok = window.confirm("Delete this product? This action cannot be undone.");
    if (!ok) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // submit add/edit
  const handleSubmit = (e) => {
    e.preventDefault();
    const cleaned = {
      image: form.image || "📦",
      name: form.name.trim() || "Untitled product",
      category: form.category.trim() || "Uncategorized",
      price: form.price.trim() || "Ksh 0",
      stock: form.stock.trim() || "0",
      status: form.status || "In Stock",
    };

    if (editing) {
      setProducts((prev) => prev.map((p) => (p.id === editing ? { ...p, ...cleaned } : p)));
    } else {
      // create new id safely
      const maxId = products.reduce((m, p) => Math.max(m, p.id || 0), 0);
      const newItem = { id: maxId + 1, ...cleaned };
      setProducts((prev) => [newItem, ...prev]);
    }

    setOpen(false);
    setEditing(null);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header avatarUrl="https://via.placeholder.com/150" userName="Daniel Mutuku" />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">My Products</h2>
          <button
            onClick={handleAddOpen}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg flex items-center space-x-2 font-medium"
            aria-label="Add product"
          >
            <PlusIcon /> <span>Add Product</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-emerald-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Image</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Product Name</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Category</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Price/Unit</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Stock</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product, index) => (
                <tr key={product.id} className={index !== products.length - 1 ? "border-b border-gray-100" : ""}>
                  <td className="py-4 px-6">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                      {product.image}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">{product.name}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">{product.category}</td>
                  <td className="py-4 px-6 text-sm text-gray-900">{product.price}</td>
                  <td className="py-4 px-6 text-sm text-gray-900">{product.stock}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded text-xs font-medium ${product.status === "In Stock" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <button onClick={() => handleEditOpen(product)} className="text-gray-600 hover:text-gray-900" aria-label={`Edit ${product.name}`}>
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-700" aria-label={`Delete ${product.name}`}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    No products found. Click "Add Product" to create your first product.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto px-6 py-6 mt-12">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>© {new Date().getFullYear()} Mboga Fresh. All rights reserved.</div>
          <div className="flex items-center space-x-6">
            <a href="#" className="hover:text-gray-900">About</a>
            <a href="#" className="hover:text-gray-900">Contact</a>
            <a href="#" className="hover:text-gray-900">Terms of Service</a>
            <a href="#" className="hover:text-gray-900">Privacy Policy</a>
          </div>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40" onClick={() => { setOpen(false); setEditing(null); }} aria-hidden />
          <form onSubmit={handleSubmit} className="relative z-10 w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{editing ? "Edit Product" : "Add Product"}</h3>
              <button type="button" onClick={() => { setOpen(false); setEditing(null); }} className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                <X />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Emoji / Image</label>
                <input autoFocus value={form.image} onChange={(e) => setForm((s) => ({ ...s, image: e.target.value }))} placeholder="e.g. 🍅 or image URL" className="w-full rounded-md border px-3 py-2 bg-white dark:bg-gray-900" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Product Name</label>
                <input value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} placeholder="e.g. Ripe Tomatoes" className="w-full rounded-md border px-3 py-2 bg-white dark:bg-gray-900" required />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <input value={form.category} onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))} placeholder="e.g. Vegetables" className="w-full rounded-md border px-3 py-2 bg-white dark:bg-gray-900" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Price / Unit</label>
                <input value={form.price} onChange={(e) => setForm((s) => ({ ...s, price: e.target.value }))} placeholder="e.g. Ksh 120" className="w-full rounded-md border px-3 py-2 bg-white dark:bg-gray-900" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Stock</label>
                <input value={form.stock} onChange={(e) => setForm((s) => ({ ...s, stock: e.target.value }))} placeholder="e.g. 50 kg" className="w-full rounded-md border px-3 py-2 bg-white dark:bg-gray-900" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select value={form.status} onChange={(e) => setForm((s) => ({ ...s, status: e.target.value }))} className="w-full rounded-md border px-3 py-2 bg-white dark:bg-gray-900">
                  <option>In Stock</option>
                  <option>Out of Stock</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button type="button" onClick={() => { setOpen(false); setEditing(null); }} className="px-4 py-2 rounded-lg border">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded-lg bg-emerald-600 text-white">{editing ? "Save Changes" : "Add Product"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

/* Small inline icons to avoid additional imports for one-liners */
function PlusIcon() {
  return <span className="inline-flex items-center justify-center w-5 h-5"><Plus className="w-4 h-4" /></span>;
}
