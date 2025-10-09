import React from "react";
import { useNavigate } from "react-router-dom";

const ProfileHeader = () => {
  const navigate = useNavigate?.() ?? (() => {});

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">
              <div className="text-emerald-600 w-10 h-10">
                <svg
                  className="w-10 h-10"
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

              <h1 className="text-xl font-bold text-gray-900">Mboga Fresh</h1>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <a
                className="text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors"
                href="#"
              >
                Home
              </a>
              <a
                className="text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors"
                href="#"
              >
                Marketplace
              </a>
              <a
                className="text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors"
                href="#"
              >
                Orders
              </a>
              <a
                className="text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors"
                href="#"
              >
                Help
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button
              className="text-gray-500 hover:text-emerald-600"
              aria-label="search"
            >
              <span className="material-symbols-outlined">search</span>
            </button>

            <button
              className="text-gray-500 hover:text-emerald-600"
              aria-label="cart"
            >
              <span className="material-symbols-outlined">shopping_cart</span>
            </button>

            <div
              className="w-10 h-10 rounded-full bg-cover bg-center border-2 border-emerald-600"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCGsWq5QqWwF5f66c9kSicNkfyDw_dLYwhgqbTufkto3Cv95U7ah6Lpf7dxekVzJy7qtEuTMbSEMtzCsRdn_drhMsyEEFdvv-ktwLdeIdvdhXBKQf_f92jO-owfsZtFSRN1AnfO8VdV-vB-pUk5fJVCTKuLcXTQdcoADz4hP9cno0sovnYaZCswMomwMtLaD0H1t7htob_NXd0ApLJO7HIW7NyuZEkGHFj13FeiqxpfhWJLfwkkDOoJ9NitW6lF8OQQTWL6syZp4ng')",
              }}
              role="img"
              aria-label="profile"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default ProfileHeader;
