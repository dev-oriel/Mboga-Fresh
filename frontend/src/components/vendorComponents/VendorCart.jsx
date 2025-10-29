import React from "react";
import { useNavigate } from "react-router-dom";
import { useBulkCart } from "../../context/BulkCartContext"; // Use the B2B cart

const formatCurrency = (value) => {
  return `KES ${Number(value).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })}`;
};

const VendorCart = ({ onClose }) => {
  const { items, addItem, removeItem, subtotal, clearCart } = useBulkCart();
  const navigate = useNavigate();

  // Custom logic to handle removal for simplicity, since BulkCartContext doesn't expose increase/decrease
  const decreaseItem = (id) => {
    // Note: Since the bulk cart logic is minimal, we only implement removal here.
    removeItem(id);
  };

  const handleProceedToCheckout = () => {
    // Navigate to vendor checkout page for payment
    onClose();
    navigate("/vendor-checkout");
  };

  return (
    <div className="fixed top-1/4 right-0 z-40 transform translate-x-0 transition-transform duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-l-xl shadow-2xl w-80 max-h-[80vh] overflow-hidden">
        <div className="p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Your Cart (Bulk)
            </h3>
            <button
              onClick={() => onClose?.()}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              aria-label="Close cart preview"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {items.length === 0 ? (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400">
              Your bulk cart is empty
            </div>
          ) : (
            <>
              <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                {items.map((it) => {
                  const priceValue = Number(
                    it.price.match(/(\d+(\.\d+)?)/)?.[0] || 0
                  );
                  const totalItemPrice = priceValue * it.qty;

                  return (
                    <div key={it.id} className="flex items-center gap-3">
                      <img
                        alt={it.title}
                        className="w-14 h-14 rounded-md object-cover flex-shrink-0"
                        src={it.image}
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-100">
                          {it.title}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {it.qty} × {it.price}
                        </p>

                        <div className="mt-2 flex items-center gap-2">
                          <button
                            onClick={() => decreaseItem(it.id)}
                            className="ml-2 text-xs text-red-600 dark:text-red-400"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      <div className="font-bold text-sm text-gray-900 dark:text-white">
                        {formatCurrency(totalItemPrice)}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
                <div className="flex justify-between font-bold text-gray-900 dark:text-white">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => {
                      onClose();
                      navigate("/vendor-cart");
                    }}
                    className="flex-1 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    View Cart
                  </button>

                  <button
                    onClick={handleProceedToCheckout}
                    className="flex-1 py-2 rounded-lg bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition"
                  >
                    Checkout
                  </button>
                </div>

                <button
                  onClick={clearCart}
                  className="mt-3 w-full text-xs text-gray-500 dark:text-gray-400"
                >
                  Clear Cart
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorCart;
