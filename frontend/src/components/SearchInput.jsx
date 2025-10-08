import React from "react";

const SearchInput = () => {
  return (
    <div className="hidden md:block relative">
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280] dark:text-[#9CA3AF]">
        search
      </span>
      <input
        className="bg-[#f6f8f6] dark:bg-[#152111] border border-black/10 dark:border-white/10 rounded-lg pl-10 pr-4 py-2 w-48 focus:ring-2 focus:ring-[#42cf17]/50 focus:border-[#42cf17]/50 outline-none transition-all"
        placeholder="Search..."
        type="text"
      />
    </div>
  );
};

export default SearchInput;
