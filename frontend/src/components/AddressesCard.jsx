import React, { useState } from "react";

const AddressesCard = () => {
  const [addresses, setAddresses] = useState([
    {
      label: "Home",
      details: "123 Ngong Road, Nairobi, Kenya",
      isPrimary: true,
    },
    {
      label: "Work",
      details: "456 Westlands Avenue, Nairobi, Kenya",
      isPrimary: false,
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: "",
    details: "",
    isPrimary: false,
  });

  const handleAddAddress = () => {
    if (newAddress.label && newAddress.details) {
      setAddresses([newAddress, ...addresses]);
      setNewAddress({ label: "", details: "", isPrimary: false });
      setShowForm(false);
    } else {
      alert("Please fill in all address fields.");
    }
  };

  const handleDelete = (index) => {
    const updated = addresses.filter((_, i) => i !== index);
    setAddresses(updated);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6" id="addresses">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">Saved Addresses</h3>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-colors text-sm flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">add</span>
            Add New Address
          </button>
        )}
      </div>

      {/* New Address Form */}
      {showForm && (
        <div className="border border-gray-200 rounded-lg p-4 mb-6 space-y-4">
          <h4 className="font-semibold text-gray-900">Add a New Address</h4>

          <div>
            <label
              htmlFor="label"
              className="block text-sm font-medium text-gray-600"
            >
              Address Label (e.g., Home, Work)
            </label>
            <input
              id="label"
              type="text"
              value={newAddress.label}
              onChange={(e) =>
                setNewAddress({ ...newAddress, label: e.target.value })
              }
              placeholder="Enter label"
              className="mt-1 block w-full rounded-lg border border-gray-200 shadow-sm focus:border-emerald-600 focus:ring focus:ring-emerald-100 sm:text-sm p-2"
            />
          </div>

          <div>
            <label
              htmlFor="details"
              className="block text-sm font-medium text-gray-600"
            >
              Address Details
            </label>
            <textarea
              id="details"
              rows="2"
              value={newAddress.details}
              onChange={(e) =>
                setNewAddress({ ...newAddress, details: e.target.value })
              }
              placeholder="Enter full address"
              className="mt-1 block w-full rounded-lg border border-gray-200 shadow-sm focus:border-emerald-600 focus:ring focus:ring-emerald-100 sm:text-sm p-2"
            />
          </div>

          {/* Buttons Row */}
          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setShowForm(false)}
              className="text-sm font-medium text-rose-500 hover:underline"
            >
              Cancel
            </button>

            <button
              onClick={handleAddAddress}
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-colors text-sm"
            >
              Save Address
            </button>
          </div>
        </div>
      )}

      {/* Saved Addresses */}
      <div className="space-y-4">
        {addresses.map((address, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 flex justify-between items-start hover:bg-gray-50 transition-colors"
          >
            <div>
              <p className="font-semibold text-gray-900">{address.label}</p>
              <p className="text-gray-500">{address.details}</p>
              {address.isPrimary && (
                <span className="mt-1 inline-block bg-emerald-50 text-emerald-600 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  Primary
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button className="text-gray-500 hover:text-emerald-600">
                <span className="material-symbols-outlined">edit</span>
              </button>

              <button
                onClick={() => handleDelete(index)}
                className="text-gray-500 hover:text-rose-500"
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressesCard;