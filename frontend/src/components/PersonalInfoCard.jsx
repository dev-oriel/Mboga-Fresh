// frontend/src/components/PersonalInfoCard.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const PersonalInfoCard = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name ?? user.fullName ?? "",
        email: user.email ?? "",
        phone: user.phone ?? user.phoneNumber ?? "",
        address: user.address ?? user.primaryAddress ?? "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    setIsEditing(true);
  };

  const handleSaveChanges = async (e) => {
    e?.preventDefault?.();
    // TODO: send PATCH to /api/users/:id to update. For now, just update context locally.
    setUser((prev) => ({
      ...(prev || {}),
      name: form.name,
      email: form.email,
      phone: form.phone,
      address: form.address,
    }));
    setIsEditing(false);
    alert(
      "Personal information saved (locally). Wire the API call to persist it."
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6" id="personal-info">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900">
          Personal Information
        </h3>
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
                className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-colors"
              >
                Update Password
              </button>
            ) : (
              <button
                type="submit"
                disabled={!isEditing}
                className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-colors disabled:opacity-50"
              >
                Save Changes
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfoCard;
