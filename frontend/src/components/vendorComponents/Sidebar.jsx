import React from "react";

const Sidebar = () => {
  return (
    <aside className="w-80 flex-shrink-0 border-r border-emerald-200/70 dark:border-emerald-700/60 p-6 bg-white dark:bg-gray-900">
      <div className="flex flex-col gap-8">
        <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          Farm-ily Marketplace
        </h1>

        <nav className="flex flex-col gap-2">
          <a
            className="flex items-center gap-3 px-4 py-2 rounded-lg bg-emerald-100 dark:bg-emerald-700/20 text-emerald-600 font-bold"
            href="#"
          >
            <span className="material-symbols-outlined" aria-hidden>
              grid_view
            </span>
            <span>All Products</span>
          </a>

          <a
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-700/10 transition-colors font-medium text-gray-800 dark:text-gray-200"
            href="#"
          >
            <span className="material-symbols-outlined" aria-hidden>
              eco
            </span>
            <span>Vegetables</span>
          </a>

          <a
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-700/10 transition-colors font-medium text-gray-800 dark:text-gray-200"
            href="#"
          >
            <span className="material-symbols-outlined" aria-hidden>
              ios
            </span>
            <span>Fruits</span>
          </a>

          <a
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-700/10 transition-colors font-medium text-gray-800 dark:text-gray-200"
            href="#"
          >
            <span className="material-symbols-outlined" aria-hidden>
              grain
            </span>
            <span>Grains &amp; Cereals</span>
          </a>

          <a
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-700/10 transition-colors font-medium text-gray-800 dark:text-gray-200"
            href="#"
          >
            <span className="material-symbols-outlined" aria-hidden>
              egg
            </span>
            <span>Dairy</span>
          </a>

          <a
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-700/10 transition-colors font-medium text-gray-800 dark:text-gray-200"
            href="#"
          >
            <span className="material-symbols-outlined" aria-hidden>
              spa
            </span>
            <span>Herbs &amp; Spices</span>
          </a>
        </nav>

        <div className="border-t border-emerald-200/60 dark:border-emerald-700/40 my-4" />

        <nav className="flex flex-col gap-2">
          <a
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-700/10 transition-colors font-medium text-gray-800 dark:text-gray-200"
            href="#"
          >
            <span className="material-symbols-outlined" aria-hidden>
              shopping_cart
            </span>
            <span>My Cart</span>
          </a>

          <a
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-700/10 transition-colors font-medium text-gray-800 dark:text-gray-200"
            href="#"
          >
            <span className="material-symbols-outlined" aria-hidden>
              local_shipping
            </span>
            <span>Orders &amp; Deliveries</span>
          </a>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
