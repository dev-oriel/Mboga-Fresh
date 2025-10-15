import { Link } from "react-router-dom";
import React from "react";

const Footer = () => {
  return (
    <footer className=" dark:border-gray-200" style={{}}>
      <div
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-12"
        style={{
          backgroundColor: undefined,
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <a className="flex items-center gap-2 mb-4" href="#">
              <svg
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
                style={{ color: "#17cf60" }} /* icon color */
              >
                <path
                  d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"
                  fill="currentColor"
                ></path>
              </svg>

              <span className="text-2xl font-bold" style={{ color: "#333333" }}>
                Mboga Fresh
              </span>
            </a>

            <p className="text-sm" style={{ color: "#586F54" }}>
              Your trusted digital marketplace for fresh, local produce.
            </p>

            <p className="mt-4 text-sm" style={{ color: "#586F54" }}>
              <br /> 🇰🇪 Proudly Kenyan.
            </p>
          </div>

          <div>
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: "#333333" }}
            >
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  className="text-sm hover:underline"
                  href="#"
                  style={{ color: "#586F54" }}
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  className="text-sm hover:underline"
                  href="#"
                  style={{ color: "#586F54" }}
                >
                  Marketplace
                </a>
              </li>
              <li>
                <a
                  className="text-sm hover:underline"
                  href="#orders"
                  style={{ color: "#586F54" }}
                >
                  My Orders
                </a>
              </li>
              <li>
                <a
                  className="text-sm hover:underline"
                  href="#"
                  style={{ color: "#586F54" }}
                >
                  My Profile
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: "#333333" }}
            >
              Help &amp; Support
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  className="text-sm hover:underline"
                  href="#"
                  style={{ color: "#586F54" }}
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  className="text-sm hover:underline"
                  href="#"
                  style={{ color: "#586F54" }}
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  className="text-sm hover:underline"
                  href="#"
                  style={{ color: "#586F54" }}
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  className="text-sm hover:underline"
                  href="#"
                  style={{ color: "#586F54" }}
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: "#333333" }}
            >
              Follow Us
            </h3>

            <div className="flex space-x-4">
              {/* Facebook */}
              <a
                className="hover:opacity-90"
                href="#"
                aria-label="Facebook"
                style={{ color: "#586F54" }}
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    clipRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    fillRule="evenodd"
                  />
                </svg>
              </a>

              {/* Twitter */}
              <a
                className="hover:opacity-90"
                href="#"
                aria-label="Twitter"
                style={{ color: "#586F54" }}
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                className="hover:opacity-90"
                href="#"
                aria-label="Instagram"
                style={{ color: "#586F54" }}
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    clipRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.345 2.525c.636-.247 1.363-.416 2.427-.465C9.793 2.013 10.147 2 12.315 2zm0 1.62c-2.403 0-2.71.01-3.66.058-1.14.053-1.62.248-2.028.42s-.844.51-1.188 1.188c-.172.408-.367.888-.42 2.028-.048.95-.058 1.257-.058 3.66s.01 2.71.058 3.66c.053 1.14.248 1.62.42 2.028.344.678.71 1.016 1.188 1.188.408.172.888.367 2.028.42.95.048 1.257.058 3.66.058s2.71-.01 3.66-.058c1.14-.053 1.62-.248 2.028-.42.678-.344 1.016-.71 1.188-1.188.172-.408.367-.888.42-2.028.048-.95.058-1.257.058-3.66s-.01-2.71-.058-3.66c-.053-1.14-.248-1.62-.42-2.028-.344-.678-.71-1.016-1.188-1.188-.408-.172-.888-.367-2.028-.42-.95-.048-1.257-.058-3.66-.058zM12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5zM12 14a2 2 0 110-4 2 2 0 010 4zm6.406-7.188a.938.938 0 100-1.875.938.938 0 000 1.875z"
                    fillRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* copyright strip */}
        <div
          className="mt-12 border-t pt-6 text-center text-sm"
          style={{ color: "#9EB89A", borderColor: "rgba(222,184,135,0.3)" }}
        >
          &copy; {new Date().getFullYear()} Karibu Mboga Fresh. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
