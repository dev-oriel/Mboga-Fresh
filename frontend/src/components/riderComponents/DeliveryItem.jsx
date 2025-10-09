import React from 'react';

const DeliveryItem = ({ id, pickup, dropoff, earnings }) => {
  return (
    <li className="p-6 hover:bg-[#73d411]/5 dark:hover:bg-[#73d411]/10 transition-colors duration-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 size-14 bg-[#73d411]/10 dark:bg-[#73d411]/20 rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-[#73d411] text-4xl">local_shipping</span>
          </div>
          <div className="flex-1">
            <p className="text-lg font-bold text-gray-900 dark:text-white">Order #{id}</p>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold">Pickup:</span> {pickup} <br />
              <span className="font-semibold">Dropoff:</span> {dropoff}
            </p>
            <p className="mt-2 text-sm font-semibold text-[#73d411]">Est. Earnings: {earnings}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-transparent px-6 py-3 text-sm font-bold text-[#73d411] ring-2 ring-[#73d411]/50 hover:bg-[#73d411]/10 dark:hover:bg-[#73d411]/20 transition-all">
            <span className="material-symbols-outlined">map</span>
            <span>Route</span>
          </button>
          <button className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-[#73d411] px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-opacity-90 transition-all">
            <span className="material-symbols-outlined">check_circle</span>
            <span>Accept</span>
          </button>
        </div>
      </div>
    </li>
  );
};

export default DeliveryItem;
