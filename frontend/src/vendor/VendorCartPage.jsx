import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/vendorComponents/Header";
import Sidebar from "../components/vendorComponents/Sidebar";
import CheckoutProgress from "../components/CheckoutProgress";
import { useBulkCart } from "../context/BulkCartContext";
import { useAuth } from "../context/AuthContext";
import { Trash2, Plus, Minus } from "lucide-react";

const formatCurrency = (value) => {
  return `KES ${Number(value).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })}`;
};

const VendorCartPage = () => {
  const { items, removeItem, clearCart, subtotal, addItem } = useBulkCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleProceedToCheckout = () => {
    navigate("/vendor-checkout");
  };

  const handleIncreaseQty = (item) => {
    addItem(item, 1);
  };

  const handleDecreaseQty = (item) => {
    if (item.qty > 1) {
      // Create a new item with reduced quantity
      const updatedItem = { ...item, qty: -1 };
      addItem(updatedItem, -1);
    } else {
      removeItem(item.id);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Header avatarUrl={user?.avatar} userName={user?.name || "Vendor"} />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8">
            <div className="max-w-4xl mx-auto text-center py-16">
              <div className="mb-6">
                <span className="material-symbols-outlined text-gray-400" style={{ fontSize: "80px" }}>
                  shopping_cart
                </span>
              </div>
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                Your Cart is Empty
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Browse the Farmily Marketplace to find great bulk products from local farmers.
              </p>
              <button
                onClick={() => navigate("/farmily")}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold"
              >
                Browse Products
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header avatarUrl={user?.avatar} userName={user?.name || "Vendor"} />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <CheckoutProgress step={1} />
          
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Shopping Cart
              </h1>
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-2 text-sm font-medium"
              >
                <Trash2 className="w-4 h-4" />
                Clear Cart
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {items.map((item) => {
                    const priceValue = Number(
                      item.price.match(/(\d+(\.\d+)?)/)?.[0] || 0
                    );
                    const totalItemPrice = priceValue * item.qty;

                    return (
                      <div
                        key={item.id}
                        className="p-6 flex flex-col sm:flex-row gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                      >
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-32 h-32 object-cover rounded-lg"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                              {item.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {item.farmer}
                            </p>
                            <p className="text-emerald-600 dark:text-emerald-400 font-semibold">
                              {item.price}
                            </p>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                              <button
                                onClick={() => handleDecreaseQty(item)}
                                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                              </button>
                              <span className="px-4 font-semibold text-gray-900 dark:text-white min-w-[2rem] text-center">
                                {item.qty}
                              </span>
                              <button
                                onClick={() => handleIncreaseQty(item)}
                                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                              </button>
                            </div>

                            <div className="text-right">
                              <p className="text-lg font-bold text-gray-900 dark:text-white">
                                {formatCurrency(totalItemPrice)}
                              </p>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 mt-1"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>Subtotal ({items.reduce((sum, it) => sum + it.qty, 0)} items)</span>
                    <span className="font-semibold">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>Delivery Fee</span>
                    <span className="font-semibold">KES 1</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                      <span>Total</span>
                      <span>{formatCurrency(subtotal + 1)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleProceedToCheckout}
                  className="w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold mb-3"
                >
                  Proceed to Checkout
                </button>

                <button
                  onClick={() => navigate("/farmily")}
                  className="w-full py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium"
                >
                  Continue Shopping
                </button>

                <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                  <p className="text-sm text-emerald-800 dark:text-emerald-300">
                    <span className="font-semibold">Free delivery</span> on orders over KES 5,000
                  </p>
                </div>
              </div>
            </div>
          </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default VendorCartPage;
