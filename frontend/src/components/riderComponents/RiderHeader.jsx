import React from "react";

const Header = ({ userAvatarUrl = "" }) => {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-green-200 px-6 py-4 bg-white dark:bg-gray-900">
      <div className="flex items-center gap-4 text-green-600">
        <div className="w-10 h-10">
          <svg
            className="w-full h-full"
            fill="none"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold tracking-tighter text-gray-900 dark:text-gray-100">
          Mboga Fresh
        </h2>
      </div>

      <nav className="hidden md:flex items-center gap-6 text-base font-medium text-gray-700 dark:text-gray-300">
        <a className="text-green-600" href="#">
          Dashboard
        </a>
        <a className="hover:text-green-600 transition-colors" href="#">
          Orders
        </a>
        <a className="hover:text-green-600 transition-colors" href="#">
          Earnings
        </a>
        <a className="hover:text-green-600 transition-colors" href="#">
          Help
        </a>
      </nav>

      <div className="flex items-center justify-end">
        <div
          className="w-10 h-10 rounded-full bg-center bg-cover"
          style={{
            backgroundImage: `url("${
              userAvatarUrl || "https://via.placeholder.com/150"
            }")`,
          }}
          aria-hidden="true"
        />
      </div>
    </header>
  );
};

export default Header;
