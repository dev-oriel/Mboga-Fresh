// frontend/src/components/riderComponents/RiderProfileSidebar.jsx

import React, { useRef, useState, useEffect, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// Import the avatar map to ensure consistent default image rendering
import { DEFAULT_AVATAR_MAP } from "../../constants";

const RiderProfileSidebar = () => {
  const { user, logout, refresh } = useAuth();
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  // FIX 1: Centralize the determination of the canonical avatar URL using useMemo.
  // This is the source of truth, watching only 'user' and the map constants for sync.
  const canonicalAvatarUrl = useMemo(() => {
    return (
      user?.avatar ||
      DEFAULT_AVATAR_MAP[user?.role] ||
      DEFAULT_AVATAR_MAP.unknown
    );
  }, [user?.avatar, user?.role]);

  // FIX 2: profileImagePreview state is now initialized with the canonical URL
  const [profileImagePreview, setProfileImagePreview] =
    useState(canonicalAvatarUrl);

  // FIX 3: useEffect watches the canonical URL derived from useMemo to sync the UI.
  useEffect(() => {
    setProfileImagePreview(canonicalAvatarUrl);
  }, [canonicalAvatarUrl]);

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const dataUrl = reader.result;
      setProfileImagePreview(dataUrl); // Optimistic UI update
      try {
        setSaving(true);
        // Persist the new avatar (PUT /api/profile handles this for all users)
        await axios.put(
          "http://localhost:5000/api/profile",
          { avatar: dataUrl },
          { withCredentials: true }
        );
        if (typeof refresh === "function") {
          await refresh(); // Re-fetch user to update AuthContext and propagate change
        }
      } catch (err) {
        console.error(
          "Failed to upload avatar:",
          err?.response?.data || err.message || err
        );
        // Revert on failure
        // We use user.avatar here to revert to the last successfully saved image
        setProfileImagePreview(user?.avatar || canonicalAvatarUrl);
        alert("Failed to save avatar. Try again.");
      } finally {
        setSaving(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const displayName =
    user?.name ?? user?.fullName ?? user?.username ?? "Rider";
  const displayEmail = user?.email ?? "—";

  return (
    <div className="bg-white rounded-xl shadow-md p-6 sticky top-28">
      <div className="flex flex-col items-center mb-6">
        <div className="relative mb-4">
          <div
            className="w-24 h-24 rounded-full bg-cover bg-center border-4 border-emerald-600"
            style={{ backgroundImage: `url(${profileImagePreview})` }}
          />
          <button
            onClick={handleEditClick}
            disabled={saving}
            title={saving ? "Saving..." : "Edit profile picture"}
            className="absolute bottom-0 right-0 bg-emerald-600 text-white rounded-full p-1.5 hover:bg-opacity-90 disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{displayName}</h2>
        <p className="text-gray-500 break-all text-sm">{displayEmail}</p>
        <span className="mt-2 inline-block bg-emerald-50 text-emerald-600 text-xs font-semibold px-3 py-1 rounded-full">
          Rider
        </span>
      </div>

      <nav className="space-y-2">
        <a
          className="flex items-center gap-3 px-4 py-3 bg-emerald-50 text-emerald-600 font-semibold rounded-lg"
          href="#personal-info"
        >
          <span className="material-symbols-outlined">person</span>
          <span>My Profile</span>
        </a>
        <a
          className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-100 font-medium rounded-lg"
          href="#vehicle-info"
        >
          <span className="material-symbols-outlined">two_wheeler</span>
          <span>Vehicle Information</span>
        </a>
        <a
          className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-100 font-medium rounded-lg"
          href="#addresses"
        >
          <span className="material-symbols-outlined">home</span>
          <span>Saved Addresses</span>
        </a>
        <a
          className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-100 font-medium rounded-lg"
          href="#payment-methods"
        >
          <span className="material-symbols-outlined">credit_card</span>
          <span>Payment Methods</span>
        </a>

        <button
          onClick={async () => {
            await logout();
            navigate("/");
          }}
          className="w-full mt-3 flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 font-medium rounded-lg"
        >
          <span className="material-symbols-outlined">logout</span>
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default RiderProfileSidebar;
