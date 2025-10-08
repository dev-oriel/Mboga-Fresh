import React from "react";

const Login = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center text-center">
          <div>
            <div className="inline-block p-3 bg-green-600/20 rounded-xl">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
            <h1 className="mt-4 text-2xl font-bold">Mboga Fresh</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Freshness You Can Trust.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-center text-3xl font-bold tracking-tight">
              Welcome back
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              Log in to continue your journey.
            </p>
          </div>

          <form className="mt-8 space-y-6" method="POST">
            <div className="space-y-4 rounded-lg">
              {/* Role Select */}
              <select
                id="role"
                name="role"
                className="block w-full rounded-lg bg-gray-200 dark:bg-gray-700 px-3 py-4 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 text-base appearance-none"
              >
                <option>Buyer</option>
                <option>Vendor</option>
                <option>Farmer</option>
                <option>Rider</option>
              </select>

              {/* Email */}
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Email address"
                required
                className="block w-full rounded-lg bg-gray-200 dark:bg-gray-700 px-3 py-4 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 text-base"
              />

              {/* Password */}
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Password"
                required
                className="block w-full rounded-lg bg-gray-200 dark:bg-gray-700 px-3 py-4 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 text-base"
              />
            </div>

            {/* Forgot password */}
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-green-600 hover:text-green-500"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-lg bg-green-600 py-3 px-4 text-base font-bold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
              >
                Log in
              </button>
            </div>

            {/* Sign up link */}
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <a
                href="#"
                className="font-medium text-green-600 hover:text-green-500"
              >
                Sign up
              </a>
            </p>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 sm:px-6 lg:px-8 text-center">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <a
            href="#"
            className="font-medium text-green-600 hover:text-green-500"
          >
            English
          </a>
          <span className="mx-1">|</span>
          <a
            href="#"
            className="font-medium text-green-600 hover:text-green-500"
          >
            Swahili
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Login;
