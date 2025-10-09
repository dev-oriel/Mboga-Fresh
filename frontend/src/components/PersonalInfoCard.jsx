import React from "react";

const PersonalInfoCard = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6" id="personal-info">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">
          Personal Information
        </h3>
      </div>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              className="block text-sm font-medium text-gray-500"
              htmlFor="name"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              defaultValue="John Doe"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-emerald-600 focus:ring focus:ring-emerald-100 sm:text-sm"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-500"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              defaultValue="john.doe@example.com"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-emerald-600 focus:ring focus:ring-emerald-100 sm:text-sm"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-500"
              htmlFor="phone"
            >
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              defaultValue="+254 712 345 678"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-emerald-600 focus:ring focus:ring-emerald-100 sm:text-sm"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-500"
              htmlFor="address"
            >
              Primary Address
            </label>
            <input
              id="address"
              type="text"
              defaultValue="123 Ngong Road, Nairobi"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-emerald-600 focus:ring focus:ring-emerald-100 sm:text-sm"
            />
          </div>
        </div>

        <div className="flex justify-between items-center flex-wrap gap-4">
          <button
            type="button"
            className="text-sm font-medium text-rose-500 hover:underline"
          >
            Change Password
          </button>

          <button
            type="submit"
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfoCard;
