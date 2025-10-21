// frontend/src/components/vendorComponents/VendorStoreInfoCard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const VendorStoreInfoCard = () => {
  const { user, refresh } = useAuth();
  const [form, setForm] = useState({
    shopName: "",
    location: "",
    contact: "",
    description: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (user) {
      setForm({
        shopName: user.shopName ?? user.storeName ?? "",
        location: user.location ?? user.storeLocation ?? "",
        contact: user.contact ?? user.phone ?? "",
        description: user.description ?? user.storeDescription ?? "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), 4000);
    return () => clearTimeout(t);
  }, [message]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    setIsEditing(true);
  };

  const handleSaveChanges = async (e) => {
    e?.preventDefault?.();
    if (saving) return;

    if (!form.shopName || !form.contact) {
      setMessage({ type: "error", text: "Shop name and contact are required." });
      return;
    }

    try {
      setSaving(true);

      const payload = {
        shopName: form.shopName,
        location: form.location,
        contact: form.contact,
        description: form.description,
      };

      await axios.put(
        `${import.meta.env.VITE_API_BASE || ""}/api/profile/store`,
        payload,
        {
          withCredentials: true,
        }
      );

      if (typeof refresh === "function") await refresh();

      setIsEditing(false);
      setMessage({ type: "success", text: "Store information saved." });
    } catch (err) {
      console.error(
        "Failed to save store info:",
        err?.response?.data ?? err?.message ?? err
      );
      const errText =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to save changes. Try again.";
      setMessage({ type: "error", text: errText });
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setMessage({ type: "success", text: "Copied to clipboard" });
    } catch (e) {
      setMessage({ type: "error", text: "Could not copy" });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6" id="store-info">
      <div className="mb-6 flex items-start justify-between gap-4">
        <h3 className="text-xl font-bold text-gray-900">
          Store Information
        </h3>

        {message && (
          <div
            className={`text-sm px-3 py-1 rounded-md font-medium ${
              message.type === "success"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            {message.text}
          </div>
        )}
      </div>

      <form className="space-y-6" onSubmit={handleSaveChanges}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="shopName"
              className="block text-sm font-medium text-gray-600"
            >
              Shop Name
            </label>
            <input
              id="shopName"
              name="shopName"
              type="text"
              value={form.shopName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-gray-200 shadow-sm focus:border-emerald-600 focus:ring focus:ring-emerald-100 sm:text-sm p-2"
              required
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-600"
            >
              Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              value={form.location}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-gray-200 shadow-sm focus:border-emerald-600 focus:ring focus:ring-emerald-100 sm:text-sm p-2"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="contact"
              className="block text-sm font-medium text-gray-600"
            >
              Contact Number
            </label>
            <div className="mt-1 flex gap-2">
              <input
                id="contact"
                name="contact"
                type="tel"
                value={form.contact}
                onChange={handleChange}
                className="flex-1 rounded-lg border border-gray-200 shadow-sm focus:border-emerald-600 focus:ring focus:ring-emerald-100 sm:text-sm p-2"
                required
              />
              <button
                type="button"
                onClick={() => copyToClipboard(form.contact)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:opacity-90 transition-colors"
              >
                Copy
              </button>
            </div>
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-600"
            >
              Store Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              placeholder="Tell customers about your store..."
              className="mt-1 block w-full rounded-lg border border-gray-200 shadow-sm focus:border-emerald-600 focus:ring focus:ring-emerald-100 sm:text-sm p-2"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={!isEditing || saving}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VendorStoreInfoCard;