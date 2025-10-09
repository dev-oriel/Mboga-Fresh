import React from "react";

const ProfileSidebar = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 sticky top-28">
      <div className="flex flex-col items-center mb-6">
        <div className="relative mb-4">
          <div
            className="w-24 h-24 rounded-full bg-cover bg-center border-4 border-emerald-600"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCGsWq5QqWwF5f66c9kSicNkfyDw_dLYwhgqbTufkto3Cv95U7ah6Lpf7dxekVzJy7qtEuTMbSEMtzCsRdn_drhMsyEEFdvv-ktwLdeIdvdhXBKQf_f92jO-owfsZtFSRN1AnfO8VdV-vB-pUk5fJVCTKuLcXTQdcoADz4hP9cno0sovnYaZCswMomwMtLaD0H1t7htob_NXd0ApLJO7HIW7NyuZEkGHFj13FeiqxpfhWJLfwkkDOoJ9NitW6lF8OQQTWL6syZp4ng')",
            }}
          />
          <button className="absolute bottom-0 right-0 bg-emerald-600 text-white rounded-full p-1.5 hover:bg-opacity-90">
            <span className="material-symbols-outlined text-sm">edit</span>
          </button>
        </div>

        <h2 className="text-2xl font-bold text-gray-900">John Doe</h2>
        <p className="text-gray-500">john.doe@example.com</p>
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
          href="#favorites"
        >
          <span className="material-symbols-outlined">favorite</span>
          <span>My Favorites</span>
        </a>

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

        <a
          className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-100 font-medium rounded-lg"
          href="#"
        >
          <span className="material-symbols-outlined">logout</span>
          <span>Logout</span>
        </a>
      </nav>
    </div>
  );
};

export default ProfileSidebar;
