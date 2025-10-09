import React from "react";

const StatsCard = ({ label, value, children }) => {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-green-200 bg-white dark:bg-gray-800 p-6 transition-all hover:bg-green-50 dark:hover:bg-green-900/40">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-300">
        {label}
      </p>
      <div className="flex items-center justify-between">
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          {value}
        </p>
        {children}
      </div>
    </div>
  );
};

export default StatsCard;
