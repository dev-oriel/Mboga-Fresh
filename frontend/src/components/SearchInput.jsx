import React from "react";

const SearchInput = ({ value = "", onChange, onSearch }) => {
  const submit = (e) => {
    if (e) e.preventDefault();
    onSearch?.(value);
  };

  return (
    <form
      onSubmit={submit}
      className="relative"
      role="search"
      aria-label="Marketplace search"
    >
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
        search
      </span>
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder="Search fresh produce, vendors, tags..."
        type="search"
        className="bg-gray-50 dark:bg-black border border-transparent rounded-lg pl-10 pr-4 py-2 w-48 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 text-sm transition-all"
      />
    </form>
  );
};

export default SearchInput;
