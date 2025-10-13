import React, { useState } from "react";
import RiderHeader from "../components/riderComponents/RiderHeader"; // ✅ custom header

export default function ProfileSettings() {
  const [isEditing, setIsEditing] = useState(false);
  const [riderInfo, setRiderInfo] = useState({
    fullName: "Kiprono",
    phoneNumber: "+254 712 345 678",
    email: "kiprono.rider@mbogafresh.co.ke",
    location: "Nairobi, Kenya",
    vehicleType: "Motorbike",
  });

  const handleInputChange = (field, value) => {
    setRiderInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log("Saved rider info:", riderInfo);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ Replace inline Header with custom RiderHeader */}
      <RiderHeader />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-12">
          Profile & Settings
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Rider Information */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Rider Information
              </h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-gray-600 hover:text-gray-700 font-medium text-sm border border-gray-300 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium text-sm rounded-lg"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={riderInfo.fullName}
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                  />
                ) : (
                  <div className="bg-gray-50 px-4 py-3 rounded-md text-gray-900">
                    {riderInfo.fullName}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={riderInfo.phoneNumber}
                    onChange={(e) =>
                      handleInputChange("phoneNumber", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                  />
                ) : (
                  <div className="bg-gray-50 px-4 py-3 rounded-md text-gray-900">
                    {riderInfo.phoneNumber}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={riderInfo.email}
                    onChange={(e) =>
                      handleInputChange("email", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                  />
                ) : (
                  <div className="bg-gray-50 px-4 py-3 rounded-md text-gray-900">
                    {riderInfo.email}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={riderInfo.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                  />
                ) : (
                  <div className="bg-gray-50 px-4 py-3 rounded-md text-gray-900">
                    {riderInfo.location}
                  </div>
                )}
              </div>
            </div>

            {/* Vehicle Details */}
            <h3 className="text-2xl font-bold text-gray-900 mb-6 mt-10">
              Vehicle Details
            </h3>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Type
                </label>
                {isEditing ? (
                  <select
                    value={riderInfo.vehicleType}
                    onChange={(e) =>
                      handleInputChange("vehicleType", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                  >
                    <option value="Motorbike">Motorbike</option>
                    <option value="Bicycle">Bicycle</option>
                    <option value="Car">Car</option>
                    <option value="Van">Van</option>
                  </select>
                ) : (
                  <div className="bg-gray-50 px-4 py-3 rounded-md text-gray-900">
                    {riderInfo.vehicleType}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Right Column - Performance Metrics */}
          <section>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Performance Metrics
            </h3>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-sm text-gray-600 mb-2">Orders Completed</div>
                <div className="text-4xl font-bold text-green-600">250</div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-sm text-gray-600 mb-2">Average Rating</div>
                <div className="text-4xl font-bold text-green-600 flex items-center gap-2">
                  4.8
                  <svg
                    className="w-8 h-8 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 .587l3.668 7.431L24 9.753l-6 5.853L19.335 24 12 19.897 4.665 24 6 15.606 0 9.753l8.332-1.735z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="text-sm text-gray-600 mb-2">Total Earnings</div>
              <div className="text-4xl font-bold text-green-600">Ksh 15,000</div>
            </div>

            {/* Grow with Mboga Fresh Card */}
            <div className="bg-gray-600 rounded-lg p-8 text-center">
              <h4 className="text-2xl font-bold text-white mb-4">
                Grow with Mboga Fresh
              </h4>
              <p className="text-gray-200 mb-6">
                Access training resources and tips to improve your earnings and
                ratings.
              </p>
              <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
                Explore Resources
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
