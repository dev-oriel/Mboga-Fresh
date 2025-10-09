import React from "react";

const CartPreview = () => {
  return (
    <div className="fixed top-1/3 right-0 z-40 transform translate-x-0 transition-transform duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-l-xl shadow-2xl w-80">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Your Cart
            </h3>
            <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
            {/* Cart Item */}
            <div className="flex items-center gap-4">
              <img
                alt="Fresh Tomatoes"
                className="w-16 h-16 rounded-md object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8pPD7ux9zO5893VqYbvtvyJKVDOy3yMTL47u3Z9wOqLAsQ-ynMscK8gGSzc-tcvkWtfNaDdcIYK69ampAU0zW1FzzG8jTfsyk6OuqsVyNs1h9iZd8XCVZ7diBzMYSZsNoFiM-Nl1rexsMcsX-OsAO5n4Kf576SsNXKHwLRgmhG_t2Vq9I8ERuA-Prxat2Cxql2BoI86u0oP7OL3yyoxe-Qzz3EzHVyR09bdj9ZUFrUZylw9aXymEgwkY7iQ3Fl1mdlqO7h_HICBk"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-100">
                  Fresh Tomatoes
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  1kg x KES 120
                </p>
              </div>
              <span className="font-bold text-sm text-gray-900 dark:text-white">
                KES 120
              </span>
            </div>
            {/* Another Cart Item */}
            <div className="flex items-center gap-4">
              <img
                alt="Sukuma Wiki"
                className="w-16 h-16 rounded-md object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJLQOYVVy1a2Q_sJ8nEG4B7OcPbaOQVvkZWNEqVo8xF3ImyBrWn8XWYBVoixA3EbE7f9x6uLiusk9WiuT_0Xze9sSCcSyK7RPpD0lVxSi0c50fmdNvg0gL-5MnJ2iSEUGymedY_eY1RuqUrqt5YRnzP3ZYQqeBpjC67XMTCUFP5rXuHhlV2FTbIB4XSHLr3VtpldFX4w4J37GzjyGpLUMl7bf6NN6ULDd6jDR9lecCtqW-wGji05p-w3BPyLMvHftCE74gDtk6xug"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-100">
                  Sukuma Wiki (Kale)
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  2 bunches x KES 50
                </p>
              </div>
              <span className="font-bold text-sm text-gray-900 dark:text-white">
                KES 100
              </span>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-4">
            <div className="flex justify-between font-bold text-gray-900 dark:text-white">
              <span>Subtotal</span>
              <span>KES 220</span>
            </div>
            <button className="w-full mt-4 flex items-center justify-center rounded-lg h-11 px-6 bg-primary text-white text-base font-bold shadow-lg transition-transform hover:scale-105">
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPreview;
