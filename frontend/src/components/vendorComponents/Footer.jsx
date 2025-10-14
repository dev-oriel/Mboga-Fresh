import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white py-6 mt-12 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-600">
          <div>© 2025 Mboga Fresh. All rights reserved.</div>
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-gray-900 transition-colors duration-200">
              About
            </a>
            <a href="#" className="hover:text-gray-900 transition-colors duration-200">
              Contact
            </a>
            <a href="#" className="hover:text-gray-900 transition-colors duration-200">
              Terms of Service
            </a>
            <a href="#" className="hover:text-gray-900 transition-colors duration-200">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}