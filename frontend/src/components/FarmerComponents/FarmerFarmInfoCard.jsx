// frontend/src/components/FarmerComponents/FarmerFarmInfoCard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const FarmerFarmInfoCard = () => {
  const { user, refresh } = useAuth();
  const [form, setForm] = useState({
    farmName: "",
    farmLocation: "",
    farmSize: "",
    productsGrown: "",
    certifications: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (user) {
      setForm({
        farmName: user.farmName ?? user.businessName ?? "",
        farmLocation: user.farmLocation ?? user.location ?? "",
        farmSize: user.farmSize ?? "",
        productsGrown: user.productsGrown ?? user.crops ?? "",
        certifications: user.certifications ?? "",
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

    if (!form.farmName) {
      setMessage({
        type: "error",
        text: "Farm name is required.",
      });
      return;
    }

    try {
      setSaving(true);

      const payload = {
        farmName: form.farmName,
        farmLocation: form.farmLocation,
        farmSize: form.farmSize,
        productsGrown: form.productsGrown,
        certifications: form.certifications,
      };

      await axios.put(
        `${import.meta.env.VITE_API_BASE || ""}/api/profile/farm`,
        payload,
        {
          withCredentials: true,
        }
      );

      if (typeof refresh === "function") await refresh();

      setIsEditing(false);
      setMessage({ type: "success", text: "Farm information saved." });
    } catch (err) {
      console.error(
        "Failed to save farm info:",
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

  return (
    <div className="bg-white rounded-xl shadow-md p-6" id="farm-info">
      <div className="mb-6 flex items-start justify-between gap-4">
        <h3 className="text-xl font-bold text-gray-900">Farm Information</h3>

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
              htmlFor="farmName"
              className="block text-sm font-medium text-gray-600"
            >
              Farm Name
            </label>
            <input
              id="farmName"
              name="farmName"
              type="text"
              value={form.farmName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-gray-200 shadow-sm focus:border-emerald-600 focus:ring focus:ring-emerald-100 sm:text-sm p-2"
              required
            />
          </div>

          <div>
            <label
              htmlFor="farmLocation"
              className="block text-sm font-medium text-gray-600"
            >
              Farm Location
            </label>
            <input
              id="farmLocation"
              name="farmLocation"
              type="text"
              value={form.farmLocation}
              onChange={handleChange}
              placeholder="e.g., Kiambu County, Kenya"
              className="mt-1 block w-full rounded-lg border border-gray-200 shadow-sm focus:border-emerald-600 focus:ring focus:ring-emerald-100 sm:text-sm p-2"
            />
          </div>

          <div>
            <label
              htmlFor="farmSize"
              className="block text-sm font-medium text-gray-600"
            >
              Farm Size (acres)
            </label>
            <input
              id="farmSize"
              name="farmSize"
              type="text"
              value={form.farmSize}
              onChange={handleChange}
              placeholder="e.g., 5 acres"
              className="mt-1 block w-full rounded-lg border border-gray-200 shadow-sm focus:border-emerald-600 focus:ring focus:ring-emerald-100 sm:text-sm p-2"
            />
          </div>

          <div>
            <label
              htmlFor="productsGrown"
              className="block text-sm font-medium text-gray-600"
            >
              Products/Crops Grown
            </label>
            <input
              id="productsGrown"
              name="productsGrown"
              type="text"
              value={form.productsGrown}
              onChange={handleChange}
              placeholder="e.g., Tomatoes, Kale, Spinach"
              className="mt-1 block w-full rounded-lg border border-gray-200 shadow-sm focus:border-emerald-600 focus:ring focus:ring-emerald-100 sm:text-sm p-2"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="certifications"
              className="block text-sm font-medium text-gray-600"
            >
              Certifications (Optional)
            </label>
            <textarea
              id="certifications"
              name="certifications"
              value={form.certifications}
              onChange={handleChange}
              placeholder="e.g., Organic certification, GlobalGAP, etc."
              rows={3}
              className="mt-1 block w-full rounded-lg border border-gray-200 shadow-sm focus:border-emerald-600 focus:ring focus:ring-emerald-100 sm:text-sm p-2"
            />
          </div>
        </div>

        {isEditing && (
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                if (user) {
                  setForm({
                    farmName: user.farmName ?? user.businessName ?? "",
                    farmLocation: user.farmLocation ?? user.location ?? "",
                    farmSize: user.farmSize ?? "",
                    productsGrown: user.productsGrown ?? user.crops ?? "",
                    certifications: user.certifications ?? "",
                  });
                }
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default FarmerFarmInfoCard;
