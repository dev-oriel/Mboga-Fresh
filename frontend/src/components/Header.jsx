import React from "react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-24 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <a className="flex items-center gap-2" href="#">
              <svg
                className="h-10 w-10 text-[#28A745]"
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"
                  fill="currentColor"
                ></path>
              </svg>
              <span className="text-3xl font-bold text-gray-900 dark:text-white tracking-tighter">
                Mboga Fresh
              </span>
            </a>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {["Home", "Marketplace", "Orders", "Help"].map((link) => (
                <a
                  key={link}
                  className="text-base font-medium text-gray-700 dark:text-gray-300 hover:text-[#1e7e34] transition-colors"
                  href="#"
                >
                  {link}
                </a>
              ))}
            </nav>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Search Input */}
            <div className="relative hidden md:block">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                />
              </svg>
              <input
                className="w-full max-w-xs rounded-full border-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 py-2.5 pl-10 pr-6 text-sm focus:ring-2 focus:ring-[#28A745] focus:border-[#28A745] transition-all"
                placeholder="Search produce, vendors..."
                type="text"
              />
            </div>

            {/* Shopping Cart */}
            <button className="relative">
              <svg
                className="h-8 w-8 text-gray-600 dark:text-gray-300 hover:text-[#1e7e34] transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 7M7 13l-2 5m5-5v5m4-5v5m4-5l2 5"
                />
              </svg>
              <span className="absolute -top-1 -right-2 bg-[#28A745] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                2
              </span>
            </button>

            {/* Profile Avatar */}
            <button className="hidden lg:block group">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-12 h-12 ring-2 ring-transparent group-hover:ring-[#28A745] transition-all"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAB35B0nM01tsCg3RQQzb9IK4Jh5S9LGwTTb2Elhcgy-pA2WumlaYRWAIGgs19MqEsmJ-12xjic8zKHqDUKoaH_Rn6A-DjR_iVjElhd8uLj41ceFu_2vDbOslm4u09Yb_iGsTvM1o9MgW3y3m1kNUt8m6sM92Np8O2DKqjLhleFkV9uV4D41ik7qOfG-CvJlQTtub69mjibOEgyi2ecZTKXh6fGPdSk85s4U5TPMt4dq6V-yMdRRfJYzF8dBntP2D0F_PXxWBKS-QU')",
                }}
              ></div>
            </button>

            {/* Mobile menu */}
            <button className="lg:hidden text-gray-600 dark:text-gray-300">
              <span className="material-symbols-outlined text-3xl">menu</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;


<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="#28A745">
  <path d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"/>
</svg>
