import React from "react";

const AddressesCard = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6" id="addresses">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">Saved Addresses</h3>

        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-colors text-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-base">add</span>
          Add New Address
        </button>
      </div>

      <div className="space-y-4">
        <div className="border rounded-lg p-4 flex justify-between items-start">
          <div>
            <p className="font-semibold">Home</p>
            <p className="text-gray-500">123 Ngong Road, Nairobi, Kenya</p>
            <span className="mt-1 inline-block bg-emerald-50 text-emerald-600 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              Primary
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button className="text-gray-500 hover:text-emerald-600">
              <span className="material-symbols-outlined">edit</span>
            </button>

            <button className="text-gray-500 hover:text-rose-500">
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
        </div>

        <div className="border rounded-lg p-4 flex justify-between items-start">
          <div>
            <p className="font-semibold">Work</p>
            <p className="text-gray-500">
              456 Westlands Avenue, Nairobi, Kenya
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button className="text-gray-500 hover:text-emerald-600">
              <span className="material-symbols-outlined">edit</span>
            </button>

            <button className="text-gray-500 hover:text-rose-500">
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressesCard;
