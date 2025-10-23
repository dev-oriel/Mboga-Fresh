// frontend/src/components/adminComponents/AdminProfileSidebar.jsx

import React from "react";
import { X, LogOut, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { DEFAULT_AVATAR } from "../../constants";

const AdminProfileSidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const avatarSrc = user?.avatar || DEFAULT_AVATAR;
  const userName = user?.name || "Admin";
  const userEmail = user?.email || "admin@mbogafresh.co.ke";

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleProfileClick = () => {
    // Admin profile info is simple/read-only in this context,
    // often edited via User Management. We just close the sidebar.
    onClose();
    // If a full page was required, you could navigate: navigate('/adminprofile');
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-800 shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Admin Profile
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 flex flex-col items-center space-y-4">
          <div
            className="w-24 h-24 rounded-full bg-cover bg-center border-4 border-red-500"
            style={{ backgroundImage: `url(${avatarSrc})` }}
            aria-label="Admin Avatar"
          />
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {userName}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {userEmail}
            </p>
            <span className="mt-1 inline-block bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full">
              Admin
            </span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleProfileClick}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 font-medium rounded-lg"
          >
            <User size={20} className="text-red-500" />
            <span>View Profile (Read-Only)</span>
          </button>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut size={20} />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminProfileSidebar;
