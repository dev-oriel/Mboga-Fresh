import React, { useRef, useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { DEFAULT_AVATAR } from "../../constants";

const VendorProfileSidebar = () => {
  const { user, logout, refresh } = useAuth();
  const profileImageDefault =
    (typeof DEFAULT_AVATAR === "string" && DEFAULT_AVATAR) ||
    "https://api.dicebear.com/6.x/identicon/png?seed=MbogaFresh&size=512";

  const [profileImagePreview, setProfileImagePreview] = useState(
    user?.avatar || profileImageDefault
  );
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setProfileImagePreview(user?.avatar || profileImageDefault);
  }, [user?.avatar, profileImageDefault]);

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const dataUrl = reader.result;
      setProfileImagePreview(dataUrl);
      try {
        setSaving(true);
        await axios.put(
          "http://localhost:5000/api/profile",
          { avatar: dataUrl },
          { withCredentials: true }
        );
        if (typeof refresh === "function") {
          await refresh();
        }
      } catch (err) {
        console.error(
          "Failed to upload avatar:",
          err?.response?.data || err.message || err
        );
        setProfileImagePreview(user?.avatar || profileImageDefault);
        alert("Failed to save avatar. Try again.");
      } finally {
        setSaving(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const displayName =
    user?.name ?? user?.fullName ?? user?.username ?? "Vendor";
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
          Vendor
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
          href="#store-info"
        >
          <span className="material-symbols-outlined">storefront</span>
          <span>Store Information</span>
        </a>
        {/* <a
          className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-100 font-medium rounded-lg"
          href="#ratings"
        >
          <span className="material-symbols-outlined">star</span>
          <span>Ratings & Reviews</span>
        </a> */}
        <a
          className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-100 font-medium rounded-lg"
          href="#order-history"
        >
          <span className="material-symbols-outlined">receipt_long</span>
          <span>Order History</span>
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

export default VendorProfileSidebar;