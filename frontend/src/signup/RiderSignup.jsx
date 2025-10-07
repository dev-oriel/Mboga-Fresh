import React from "react";

const RiderSignup = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-200">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-green-600/10 dark:bg-green-600/20 rounded-full mb-4 animate-pulse">
            <svg
              className="w-16 h-16 text-green-600"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M19.88 13.31A1.003 1.003 0 0 0 19 13H5.79l-1.1-2H19a1 1 0 0 0 .95-.68l1-3a1 1 0 0 0-.15-1.09A1 1 0 0 0 20 6H5.43l-.68-1.36A1 1 0 0 0 3.86 4H3a1 1 0 0 0 0 2h.42l3.43 6.84-1.5 2.62a1 1 0 0 0-.15.84A1 1 0 0 0 6 17h12a1 1 0 0 0 0-2H7.22l.81-1.42h9.85a1 1 0 0 0 .94-.69l1.06-2.58zM6.5 19a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"></path>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Mboga Fresh
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Freshness You Can Trust.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
            Become a Rider
          </h2>
          <form className="space-y-4">
            <input
              id="full-name"
              type="text"
              placeholder="Full Name"
              className="w-full bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            <input
              id="phone-number"
              type="tel"
              placeholder="Phone Number"
              className="w-full bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            <input
              id="id-number"
              type="text"
              placeholder="ID Number"
              className="w-full bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            <select
              id="vehicle-type"
              defaultValue=""
              className="w-full bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg p-3 appearance-none focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-gray-500 dark:text-gray-400"
            >
              <option disabled value="">
                Vehicle Type
              </option>
              <option
                className="text-gray-900 dark:text-white"
                value="motorbike"
              >
                Motorbike
              </option>
              <option className="text-gray-900 dark:text-white" value="bicycle">
                Bicycle
              </option>
              <option className="text-gray-900 dark:text-white" value="truck">
                Truck
              </option>
              <option className="text-gray-900 dark:text-white" value="van">
                Van
              </option>
            </select>
            <input
              id="password"
              type="password"
              placeholder="Password"
              className="w-full bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
            >
              Sign Up
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
            Already have an account?{" "}
            <a className="font-bold text-green-600 hover:underline" href="#">
              Sign In
            </a>
          </p>
        </div>

        {/* Language Links */}
        <div className="text-center mt-6">
          <a
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-600"
            href="#"
          >
            English
          </a>
          <span className="text-gray-400 dark:text-gray-600 mx-1">|</span>
          <a
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-600"
            href="#"
          >
            Swahili
          </a>
        </div>
      </div>
    </div>
  );
};

export default RiderSignup;
