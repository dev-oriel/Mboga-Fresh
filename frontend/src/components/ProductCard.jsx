import React from "react";

const ProductCard = ({ title, vendor, price, img }) => {
  return (
    <div className="bg-white/50 dark:bg-[#152111]/50 rounded-xl overflow-hidden group transition-all transform hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-[#42cf17]/10">
      <div className="relative">
        <img
          loading="lazy"
          src={img}
          alt={title}
          className="aspect-square w-full object-cover"
        />
        <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="p-2 rounded-full bg-[#f6f8f6]/80 dark:bg-[#152111]/80 hover:bg-[#42cf17]/20 dark:hover:bg-[#42cf17]/30 text-[#4B5563] dark:text-[#D1D5DB]"
            aria-label={`favorite ${title}`}
          >
            <span className="material-symbols-outlined text-lg">
              favorite_border
            </span>
          </button>
          <button
            className="p-2 rounded-full bg-[#f6f8f6]/80 dark:bg-[#152111]/80 hover:bg-[#42cf17]/20 dark:hover:bg-[#42cf17]/30 text-[#4B5563] dark:text-[#D1D5DB]"
            aria-label={`compare ${title}`}
          >
            <span className="material-symbols-outlined text-lg">
              compare_arrows
            </span>
          </button>
        </div>
      </div>

      <div className="p-4">
        <p className="font-semibold text-[#111827] dark:text-white">{title}</p>
        <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-2">
          {vendor}
        </p>
        <div className="flex justify-between items-center">
          <p className="font-bold text-[#42cf17]">{price}</p>
          <button className="bg-[#42cf17]/20 dark:bg-[#42cf17]/30 text-[#42cf17] font-bold py-1 px-3 rounded-lg hover:bg-[#42cf17] hover:text-white transition-all">
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
