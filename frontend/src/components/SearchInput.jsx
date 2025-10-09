// src/components/SearchInput.jsx
import React, { useState } from "react";

const SearchInput = ({ onSearch }) => {
  const [q, setQ] = useState("");
  const submit = (e) => {
    if (e) e.preventDefault();
    onSearch?.(q);
  };

  return (
    <form
      onSubmit={submit}
      className="hidden md:block relative"
      role="search"
      aria-label="Marketplace search"
    >
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
        search
      </span>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search..."
        type="search"
        className="bg-gray-50 dark:bg-black border border-transparent rounded-lg pl-10 pr-4 py-2 w-48 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 text-sm transition-all"
      />
    </form>
  );
};

export default SearchInput;
