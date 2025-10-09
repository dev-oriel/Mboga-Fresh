import React, { useState } from "react";

const PersonalInfoCard = () => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    if (!isEditing) setIsEditing(true);
  };

  const handleSaveChanges = () => {
    setIsEditing(false);
    alert("Personal information saved successfully!");
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6" id="personal-info">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
      </div>

      {/* Personal Info Form */}
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
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
              type="text"
              defaultValue="John Doe"
              onChange={handleEdit}
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
              type="email"
              defaultValue="john.doe@example.com"
              onChange={handleEdit}
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
              type="tel"
              defaultValue="+254 712 345 678"
              onChange={handleEdit}
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
              type="text"
              defaultValue="123 Ngong Road, Nairobi"
              onChange={handleEdit}
              className="mt-1 block w-full rounded-lg border border-gray-200 shadow-sm focus:border-emerald-600 focus:ring focus:ring-emerald-100 sm:text-sm p-2"
            />
          </div>
        </div>

        {/* Password Change Section */}
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

        {/* Action Buttons */}
        <div className="flex justify-between items-center flex-wrap gap-3 pt-8">
          {/* Left - Cancel or Change Password */}
          <div>
            <button
              type="button"
              onClick={() => {
                if (showPasswordForm) setShowPasswordForm(false);
                else setShowPasswordForm(true);
              }}
              className="text-sm font-medium text-gray-500 hover:text-rose-500 transition-colors"
            >
              {showPasswordForm ? "Cancel" : "Change Password"}
            </button>
          </div>

          {/* Right - Conditional Buttons */}
          <div className="flex gap-3">
            {showPasswordForm ? (
              <button
                type="submit"
                className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-colors"
              >
                Update Password
              </button>
            ) : (
              isEditing && (
                <button
                  type="button"
                  onClick={handleSaveChanges}
                  className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-colors"
                >
                  Save Changes
                </button>
              )
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfoCard;