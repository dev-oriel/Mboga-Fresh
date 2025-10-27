import React from "react";

const DeliveryAddressForm = ({ addressForm, handleAddressChange }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
        <span className="material-symbols-outlined text-emerald-600">
          local_shipping
        </span>{" "}
        Delivery Address
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="font-medium text-sm text-gray-600 dark:text-gray-300">
            Street Address
          </label>
          <input
            className="form-input w-full mt-1 bg-gray-100 dark:bg-gray-800 border-transparent focus:border-emerald-400 focus:ring-emerald-400 rounded-lg p-2"
            name="street"
            value={addressForm.street}
            onChange={handleAddressChange}
          />
        </div>
        <div>
          <label className="font-medium text-sm text-gray-600 dark:text-gray-300">
            City
          </label>
          <input
            className="form-input w-full mt-1 bg-gray-100 dark:bg-gray-800 border-transparent focus:border-emerald-400 focus:ring-emerald-400 rounded-lg p-2"
            name="city"
            value={addressForm.city}
            onChange={handleAddressChange}
          />
        </div>
        <div>
          <label className="font-medium text-sm text-gray-600 dark:text-gray-300">
            Postal Code
          </label>
          <input
            className="form-input w-full mt-1 bg-gray-100 dark:bg-gray-800 border-transparent focus:border-emerald-400 focus:ring-emerald-400 rounded-lg p-2"
            name="postalCode"
            value={addressForm.postalCode}
            onChange={handleAddressChange}
          />
        </div>
        <div>
          <label className="font-medium text-sm text-gray-600 dark:text-gray-300">
            Phone Number for delivery updates
          </label>
          <input
            className="form-input w-full mt-1 bg-gray-100 dark:bg-gray-800 border-transparent focus:border-emerald-400 focus:ring-emerald-400 rounded-lg p-2"
            name="phone"
            value={addressForm.phone}
            onChange={handleAddressChange}
          />
        </div>
      </div>
    </div>
  );
};

export default DeliveryAddressForm;
