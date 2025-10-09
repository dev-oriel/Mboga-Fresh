// frontend/src/components/DeliveryForm.jsx
import React, { useState } from "react";

const DeliveryForm = () => {
  const [form, setForm] = useState({
    address: "Mama Ngina Street",
    apt: "",
    city: "Nairobi",
    phone: "0712 345 678",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label
          htmlFor="address"
          className="font-medium text-sm text-gray-600 dark:text-gray-300"
        >
          Street Address
        </label>
        <input
          id="address"
          name="address"
          value={form.address}
          onChange={handleChange}
          className="form-input w-full mt-1 bg-gray-100 dark:bg-gray-800 border-transparent focus:ring-emerald-400 focus:border-emerald-400 rounded-lg"
          type="text"
        />
      </div>

      <div>
        <label
          htmlFor="apt"
          className="font-medium text-sm text-gray-600 dark:text-gray-300"
        >
          Apartment, suite, etc. (optional)
        </label>
        <input
          id="apt"
          name="apt"
          value={form.apt}
          onChange={handleChange}
          className="form-input w-full mt-1 bg-gray-100 dark:bg-gray-800 border-transparent focus:ring-emerald-400 focus:border-emerald-400 rounded-lg"
          type="text"
        />
      </div>

      <div>
        <label
          htmlFor="city"
          className="font-medium text-sm text-gray-600 dark:text-gray-300"
        >
          City
        </label>
        <input
          id="city"
          name="city"
          value={form.city}
          onChange={handleChange}
          className="form-input w-full mt-1 bg-gray-100 dark:bg-gray-800 border-transparent focus:ring-emerald-400 focus:border-emerald-400 rounded-lg"
          type="text"
        />
      </div>

      <div>
        <label
          htmlFor="phone"
          className="font-medium text-sm text-gray-600 dark:text-gray-300"
        >
          Phone Number for delivery updates
        </label>
        <input
          id="phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="form-input w-full mt-1 bg-gray-100 dark:bg-gray-800 border-transparent focus:ring-emerald-400 focus:border-emerald-400 rounded-lg"
          type="tel"
        />
      </div>
    </div>
  );
};

export default DeliveryForm;
