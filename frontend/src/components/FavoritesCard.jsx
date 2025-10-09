import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FavoriteItem = ({ img, title, subtitle, onRemove, link }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(link);
  };

  return (
    <div className="min-w-[220px] bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col items-center p-4 relative hover:shadow-md transition-all">
      {/* Image Section */}
      <div
        onClick={handleNavigate}
        className="cursor-pointer w-full flex flex-col items-center"
      >
        <img
          src={img}
          alt={title}
          className="w-28 h-28 rounded-lg object-cover mb-3"
        />
        <p className="font-semibold text-gray-900 text-center">{title}</p>
        <p className="text-sm text-gray-500 text-center">{subtitle}</p>
      </div>

      {/* Red Heart (Remove) */}
      <button
        className="absolute top-3 right-3 text-red-600 hover:text-red-700 transition"
        aria-label="remove favorite"
        onClick={onRemove}
      >
        <span
          className="material-symbols-outlined text-2xl"
          style={{ color: "#dc2626" }}
        >
          favorite
        </span>
      </button>
    </div>
  );
};

const FavoritesCard = () => {
  const [favorites, setFavorites] = useState([
    {
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAN_38EI-S0rVTmNtVHf96Chl9yt8J1TNyy4BsxlbuM1-bqVLqWwTb2vKd79FO0HyBblsXhK9JSOavmPoG7XU_uWHNe8O9mOy_E-6XbRefy0T9QVkYyKHrFe27Cb_fR-gvIbv8VsUuhmvHg7uAw0f0eBKWHBTG-SrSHbg9Y8DEwxT3nHof4bXPL60uH9pOeNUPyXfM3l0LMuv_A2wnk2To7nq88H7xCe8NIHYgddykojpiQHCrnd6_a3-67volmuyWpXXKyqTSvYog",
      title: "Mama Oti's Greens",
      subtitle: "Fresh Vegetables & Fruits",
      link: "/vendor/mama-oti",
    },
    {
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuApM_M0bW3NcVc1aGCc4k8MOEI9X3fGnnf6bb5SdhIiiRh6794L_5ZfcpObEA7DaaUU0kOrxTqpWhNgJSEFtzIkpj7qLpVvlyE5yLFpMLbU9yxMqgPXeie9d0akJZNrzmd_PPHoMh_MrbXiKvdIiQGJxICR3tKkvSCPhlfdxgyL9uF08EhxrD5y03xbIonlBdcSdvbeWhevVnV6m8dU50x2zEEwro8-QGqWTUjiZ8EIVN9wSoKlMVonH3LvcVVl07RkD6gsbMsUbP0",
      title: "Ripe Mangoes",
      subtitle: "Ksh 250 / kg",
      link: "/product/ripe-mangoes",
    },
    {
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-odj5lVuqnFyIwyQxEH3c9WN6UK0dQ3ltWwUf6GofULiVElfRwAR1KAR2-vQTANLn4V2EWAKYiCJzTZ5erg_Mk4n6tXXxfokDdAXJb4B7kQ4mNcP90AFOby3_kLrCrzT_5o_5CkQu_YGADyjW9N2vwFs2T0_MfSYhEyGuf-8Dg4_BUFj3afQ7ntzJzT2WdJvAKaks8sl6mya_6CgEj6PhB18Gh0qbPc5jCx0nyZJcijx3CtLJbhta-RZLPGgj5dF-HwpOfsWso1c",
      title: "Organic Spinach (Sukuma)",
      subtitle: "Ksh 50 / bunch",
      link: "/product/organic-spinach",
    },
    {
      img: "https://images.unsplash.com/photo-1604328698692-2f7f7e9dcad3",
      title: "Fresh Avocados",
      subtitle: "Ksh 180 / kg",
      link: "/product/avocados",
    },
  ]);

  const handleRemoveFavorite = (index) => {
    const updated = favorites.filter((_, i) => i !== index);
    setFavorites(updated);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6" id="favorites">
      <h3 className="text-xl font-bold text-gray-900 mb-4">My Favorites</h3>

      {favorites.length > 0 ? (
        <div className="flex overflow-x-auto space-x-4 pb-3 hide-scrollbar">
          {favorites.map((fav, index) => (
            <FavoriteItem
              key={index}
              img={fav.img}
              title={fav.title}
              subtitle={fav.subtitle}
              link={fav.link}
              onRemove={() => handleRemoveFavorite(index)}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm text-center py-6">
          You haven’t added any favorites yet. When you favorite a product or vendor while shopping, it will appear here.
        </p>
      )}
    </div>
  );
};

export default FavoritesCard;