// frontend/src/components/adminComponents/AdminHeader.jsx - MODIFIED

import React, { useState } from "react";
import { Bell } from "lucide-react";
import AdminProfileSidebar from "./AdminProfileSidebar"; // <-- NEW IMPORT
import { useAuth } from "../../context/AuthContext"; // <-- NEW IMPORT
import { DEFAULT_AVATAR } from "../../constants"; // <-- NEW IMPORT

const Header = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const avatarSrc = user?.avatar || DEFAULT_AVATAR;
  const userName = user?.name || "Admin";

  return (
    <header className="flex items-center justify-between px-6 lg:px-10 py-4 border-b border-[#63cf17]/20 h-16 bg-[#f7f8f6]">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold text-[#182111]">Admin Portal</h1>{" "}
        {/* Updated Title */}
      </div>

      <div className="flex items-center gap-3">
        <button
          className="flex items-center justify-center size-10 rounded-full bg-[#f7f8f6] hover:bg-[#63cf17]/10 text-[#182111] transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-6 h-6" />
        </button>

        {/* Profile Picture and Dropdown/Sidebar Trigger */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <span className="hidden sm:inline text-sm font-semibold text-gray-800">
            {userName}
          </span>
          <div
            className="size-10 rounded-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${avatarSrc})`,
            }}
          />
        </button>
      </div>

      {/* Admin Profile Sidebar component added */}
      <AdminProfileSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </header>
  );
};

export default Header;
