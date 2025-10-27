// frontend/src/components/FarmerComponents/FarmerPersonalInfoCard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const FarmerPersonalInfoCard = () => {
  const { user, setUser, refresh } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name ?? user.fullName ?? "",
        email: user.email ?? "",
        phone: user.phone ?? user.phoneNumber ?? "",
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

    if (!form.name || !form.email) {
      setMessage({ type: "error", text: "Name and email are required." });
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
      };

      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE || ""}/api/profile`,
        payload,
        {
          withCredentials: true,
        }
      );

      const updatedUser = res?.data && (res?.data.user ?? res?.data);
      if (
        updatedUser &&
        typeof updatedUser === "object" &&
        (updatedUser._id || updatedUser.email)
      ) {
        if (typeof setUser === "function") setUser(updatedUser);
      } else {
        if (typeof refresh === "function") await refresh();
      }

      setIsEditing(false);
      setMessage({ type: "success", text: "Personal information saved." });
    } catch (err) {
      console.error(
        "Failed to save personal info:",
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
    <div className="bg-white rounded-xl shadow-md p-6" id="personal-info">
      <div className="mb-6 flex items-start justify-between gap-4">
        <h3 className="text-xl font-bold text-gray-900">
          Personal Information
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
              htmlFor="name"
              className="block text-sm font-medium text-gray-600"
            >
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-gray-200 shadow-sm focus:border-emerald-600 focus:ring focus:ring-emerald-100 sm:text-sm p-2"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-gray-200 shadow-sm focus:border-emerald-600 focus:ring focus:ring-emerald-100 sm:text-sm p-2"
              required
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-600"
            >
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
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
                    name: user.name ?? user.fullName ?? "",
                    email: user.email ?? "",
                    phone: user.phone ?? user.phoneNumber ?? "",
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

export default FarmerPersonalInfoCard;
