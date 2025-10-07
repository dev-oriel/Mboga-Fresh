import React from 'react';
import Header from '../components/Header.jsx';


const ProductPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8F6F5] dark:bg-[#1F2937] font-display text-gray-800 dark:text-gray-200">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <div className="mb-6">
          <a className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-[#22c55e]" href="#">
            <span className="material-symbols-outlined">arrow_back</span> Back to Marketplace
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div>
            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700">
              <div 
                className="w-full h-full bg-center bg-no-repeat bg-cover" 
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBxzUH_puxqM6Rcs-h__RfZBty4j3HgBY1QCxGSrT4USlVH9XGLef_KWMZt-qGEDka5ds2A-IMvy3E4TFD8Xzht7ugDskLCtpgd0Butkf_kZD0PgIPBTK_cL1956P7M8HXTeUePcpHgmpPW2lU59lnQpxMGQfe4iQVMF8nMrluulUDWbsOvIhO0V4eydFyl6YvIZcm--tpzOB3z5EBz0rHH100HBnJhruUDO-PseGd_hImHdXgSObjPpYo4j0VNvihHZZxltT1-1II')" }}
              ></div>
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Fresh Produce</p>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-1">Fresh Tomatoes</h1>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                Juicy, ripe tomatoes, perfect for salads, cooking, and snacking. Sourced directly from local farmers, ensuring freshness and quality.
              </p>
            </div>

            <div className="text-3xl font-bold text-[#22c55e]">Ksh 100/kg</div>

            {/* Vendor Info */}
            <div className="border-t border-b border-gray-200 dark:border-gray-700 py-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Vendor Information</h3>
              <div className="flex items-center gap-4">
                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-14 h-14" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuArzvQ9NBC50by7OFXNaZRHgiDCz1XdeITatVThYGF2jVw4-HFFV79sp2z6JmjapVN_VV_bDyXguMYkEWwEZobbQuQ2RH5W6LXvawSnkO4wj6eiVSPoY_2RjnhqahT5caY7-4mAmPoa5miBvvrec_ilCuHCY1-jTTwesyj63u3puEsPJW6YbbVnNGtG9lkwCkN9CZtnoFDU455tRhgtunI2Im49UoMXasnYLYFk5kADBJV0Xhs91pVkIk8gWHVFX4l7oMISLxEp7ns')" }}></div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">Mama Rose</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Nairobi, Kenya</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <span className="material-symbols-outlined text-lg">local_shipping</span>
                <span>Estimated Delivery: 1-2 hours</span>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <div className="flex items-center">
                  <span className="material-symbols-outlined text-yellow-500 text-lg">star</span>
                  <span className="material-symbols-outlined text-yellow-500 text-lg">star</span>
                  <span className="material-symbols-outlined text-yellow-500 text-lg">star</span>
                  <span className="material-symbols-outlined text-yellow-500 text-lg">star</span>
                  <span className="material-symbols-outlined text-yellow-500 text-lg">star_half</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">4.8 (125 reviews)</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex-1 py-3 px-6 rounded-lg bg-[#22c55e] text-white font-bold text-center hover:bg-[#16a34a] transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">add_shopping_cart</span> Add to Cart
              </button>
              <button className="flex-1 py-3 px-6 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold text-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">chat</span> Chat with Vendor
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductPage;