// frontend/src/components/PersonalInfoCard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const PersonalInfoCard = () => {
  const { user, setUser, refresh } = useAuth(); // refresh is the me() refresher in your AuthContext
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: string }

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name ?? user.fullName ?? "",
        email: user.email ?? "",
        phone: user.phone ?? user.phoneNumber ?? "",
        // We store primary address in user's addresses array on backend; here keep the existing single-field fallback
        address:
          user.address ??
          (Array.isArray(user.addresses) &&
            user.addresses.find((a) => a.isPrimary)?.details) ??
          "",
      });
    }
  }, [user]);

  // clear messages automatically
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
    // Avoid accidental duplicate clicks
    if (saving) return;

    // Basic client-side validation (you can expand)
    if (!form.name || !form.email) {
      setMessage({ type: "error", text: "Name and email are required." });
      return;
    }

    try {
      setSaving(true);

      // Send update to backend. Your backend's profile route currently updates name/avatar;
      // we send a full payload (name, email, phone, address). If backend does not support
      // some fields yet, it will ignore them — but we then refresh the canonical user.
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        // keep address field for convenience - your backend uses addresses array route for saved addresses
        address: form.address,
      };

      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE || ""}/api/profile`,
        payload,
        {
          withCredentials: true,
        }
      );

      // If backend returns updated user object, adopt it. Many implementations respond with the updated doc.
      const updatedUser = res?.data && (res?.data.user ?? res?.data);
      if (
        updatedUser &&
        typeof updatedUser === "object" &&
        (updatedUser._id || updatedUser.email)
      ) {
        // setUser only if context allows it (setUser exists)
        if (typeof setUser === "function") setUser(updatedUser);
      } else {
        // otherwise call refresh() to fetch canonical /me
        if (typeof refresh === "function") await refresh();
      }

      setIsEditing(false);
      setMessage({ type: "success", text: "Personal information saved." });
    } catch (err) {
      console.error(
        "Failed to save personal info:",
        err?.response?.data ?? err?.message ?? err
      );
      // Provide a helpful error message
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

        {/* inline status */}
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

          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-600"
            >
              Primary Address
            </label>
            <input
              id="address"
              name="address"
              type="text"
              value={form.address}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-gray-200 shadow-sm focus:border-emerald-600 focus:ring focus:ring-emerald-100 sm:text-sm p-2"
            />
            <p className="text-xs text-gray-400 mt-1">
              Note: saved addresses are also stored via Saved Addresses section.
            </p>
          </div>
        </div>

        {showPasswordForm && (
          <div className="mt-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Change Password
            </h4>
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="current-password"
                  className="block text-sm font-medium text-gray-600"
                >
                  Current Password
                </label>
                <input
                  id="current-password"
                  type="password"
                  placeholder="Enter current password"
                  className="mt-1 block w-full rounded-lg border border-gray-200 shadow-sm focus:border-emerald-600 focus:ring focus:ring-emerald-100 sm:text-sm p-2"
                />
              </div>
              <div>
                <label
                  htmlFor="new-password"
                  className="block text-sm font-medium text-gray-600"
                >
                  New Password
                </label>
                <input
                  id="new-password"
                  type="password"
                  placeholder="Enter new password"
                  className="mt-1 block w-full rounded-lg border border-gray-200 shadow-sm focus:border-emerald-600 focus:ring focus:ring-emerald-100 sm:text-sm p-2"
                />
              </div>
              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium text-gray-600"
                >
                  Confirm New Password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  placeholder="Re-enter new password"
                  className="mt-1 block w-full rounded-lg border border-gray-200 shadow-sm focus:border-emerald-600 focus:ring focus:ring-emerald-100 sm:text-sm p-2"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center flex-wrap gap-3 pt-8">
          <div>
            <button
              type="button"
              onClick={() => setShowPasswordForm((s) => !s)}
              className="text-sm font-medium text-gray-500 hover:text-rose-500 transition-colors"
            >
              {showPasswordForm ? "Cancel" : "Change Password"}
            </button>
          </div>

          <div className="flex gap-3">
            {showPasswordForm ? (
              <button
                type="submit"
                disabled={saving}
                className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-colors disabled:opacity-50"
              >
                {saving ? "Updating..." : "Update Password"}
              </button>
            ) : (
              <button
                type="submit"
                disabled={!isEditing || saving}
                className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfoCard;
