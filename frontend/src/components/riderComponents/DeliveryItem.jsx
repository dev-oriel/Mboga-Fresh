import React from 'react';
import { useNavigate } from 'react-router-dom';

const DeliveryItem = ({ id, pickup, dropoff, earnings }) => {
  const navigate = useNavigate();

  const handleAccept = () => {
    // Navigate to delivery detail page with the order ID
    navigate(`/riderdelivery/${id}`);
  };

  const handleViewRoute = () => {
    // Navigate to the delivery route page
    navigate('/riderdeliveryroute');
  };

  return (
    <li className="p-6 hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors duration-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 size-14 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-4xl">local_shipping</span>
          </div>
          <div className="flex-1">
            <p className="text-lg font-bold text-gray-900 dark:text-white">Order #{id}</p>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold">Pickup:</span> {pickup} <br />
              <span className="font-semibold">Dropoff:</span> {dropoff}
            </p>
            <p className="mt-2 text-sm font-semibold text-green-600 dark:text-green-400">Est. Earnings: {earnings}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button 
            onClick={handleViewRoute}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-transparent px-6 py-3 text-sm font-bold text-green-600 dark:text-green-400 ring-2 ring-green-600/50 dark:ring-green-400/50 hover:bg-green-600 hover:text-white dark:hover:bg-green-600 hover:ring-green-600 transition-all duration-200"
          >
            <span className="material-symbols-outlined">map</span>
            <span>Route</span>
          </button>
          <button 
            onClick={handleAccept}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-green-600 hover:bg-green-700 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all"
          >
            <span className="material-symbols-outlined">check_circle</span>
            <span>Accept</span>
          </button>
        </div>
      </div>
    </li>
  );
};

export default DeliveryItem;