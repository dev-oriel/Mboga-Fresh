import React, { useState } from "react";

const BuyerSignup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Account created successfully!");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50 font-inter">
      {/* Logo Section */}
      <div className="flex flex-col items-center mb-8">
        <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-gray-400 text-sm">Logo</span>
        </div>
        <h1 className="text-3xl font-bold text-black mt-2">Mboga Fresh</h1>
        <p className="text-gray-500">Fresh from the farm to your table</p>
      </div>

      {/* Signup Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Create your Buyer Account
        </h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-600"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Jane Doe"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#42cf17]"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="you@example.com"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#42cf17]"
              required
            />
          </div>

          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-600"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="+254 7XX XXX XXX"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#42cf17]"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#42cf17]"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#42cf17] text-white font-semibold py-3 rounded-md hover:bg-[#36a813] transition-colors"
          >
            Sign Up
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-[#42cf17] hover:underline font-medium"
            >
              Log In
            </a>
          </p>
          <div className="mt-3 flex justify-center items-center gap-2 text-gray-500 text-sm">
            <button className="hover:underline">English</button>
            <span>|</span>
            <button className="hover:underline">Swahili</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerSignup;
