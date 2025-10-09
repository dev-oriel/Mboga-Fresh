import React from "react";

const FavoriteRow = ({ img, title, subtitle }) => (
  <div className="flex items-center justify-between p-4 border rounded-lg">
    <div className="flex items-center gap-4">
      <img
        alt={title}
        className="w-12 h-12 rounded-lg object-cover"
        src={img}
      />
      <div>
        <p className="font-semibold text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>

    <button
      className="text-rose-500 hover:text-rose-700"
      aria-label="toggle favorite"
    >
      <span className="material-symbols-outlined">favorite</span>
    </button>
  </div>
);

const FavoritesCard = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6" id="favorites">
      <h3 className="text-xl font-bold text-gray-900 mb-6">My Favorites</h3>

      <div className="space-y-4">
        <FavoriteRow
          img="https://lh3.googleusercontent.com/aida-public/AB6AXuAN_38EI-S0rVTmNtVHf96Chl9yt8J1TNyy4BsxlbuM1-bqVLqWwTb2vKd79FO0HyBblsXhK9JSOavmPoG7XU_uWHNe8O9mOy_E-6XbRefy0T9QVkYyKHrFe27Cb_fR-gvIbv8VsUuhmvHg7uAw0f0eBKWHBTG-SrSHbg9Y8DEwxT3nHof4bXPL60uH9pOeNUPyXfM3l0LMuv_A2wnk2To7nq88H7xCe8NIHYgddykojpiQHCrnd6_a3-67volmuyWpXXKyqTSvYog"
          title="Mama Oti's Greens"
          subtitle="Fresh Vegetables & Fruits"
        />

        <FavoriteRow
          img="https://lh3.googleusercontent.com/aida-public/AB6AXuApM_M0bW3NcVc1aGCc4k8MOEI9X3fGnnf6bb5SdhIiiRh6794L_5ZfcpObEA7DaaUU0kOrxTqpWhNgJSEFtzIkpj7qLpVvlyE5yLFpMLbU9yxMqgPXeie9d0akJZNrzmd_PPHoMh_MrbXiKvdIiQGJxICR3tKkvSCPhlfdxgyL9uF08EhxrD5y03xbIonlBdcSdvbeWhevVnV6m8dU50x2zEEwro8-QGqWTUjiZ8EIVN9wSoKlMVonH3LvcVVl07RkD6gsbMsUbP0"
          title="Ripe Mangoes"
          subtitle="Ksh 250 / kg"
        />

        <FavoriteRow
          img="https://lh3.googleusercontent.com/aida-public/AB6AXuC-odj5lVuqnFyIwyQxEH3c9WN6UK0dQ3ltWwUf6GofULiVElfRwAR1KAR2-vQTANLn4V2EWAKYiCJzTZ5erg_Mk4n6tXXxfokDdAXJb4B7kQ4mNcP90AFOby3_kLrCrzT_5o_5CkQu_YGADyjW9N2vwFs2T0_MfSYhEyGuf-8Dg4_BUFj3afQ7ntzJzT2WdJvAKaks8sl6mya_6CgEj6PhB18Gh0qbPc5jCx0nyZJcijx3CtLJbhta-RZLPGgj5dF-HwpOfsWso1c"
          title="Organic Spinach (Sukuma)"
          subtitle="Ksh 50 / bunch"
        />
      </div>
    </div>
  );
};

export default FavoritesCard;
