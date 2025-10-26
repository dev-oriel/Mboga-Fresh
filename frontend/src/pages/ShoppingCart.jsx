// frontend/src/pages/ShoppingCart.jsx
import React from "react";
import Header from "../components/Header";
import CheckoutProgress from "../components/CheckoutProgress";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";

const ShoppingCart = () => {
  const { items, increase, decrease, removeItem, subtotal } = useCart();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <CheckoutProgress step={1} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-8">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold mb-6">Your Cart</h2>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="p-4 text-sm font-semibold" colSpan="2">
                        Product
                      </th>
                      <th className="p-4 text-sm font-semibold text-center">
                        Quantity
                      </th>
                      <th className="p-4 text-sm font-semibold text-right">
                        Total
                      </th>
                      <th className="p-4"></th>
                    </tr>
                  </thead>

                  <tbody>
                    {items.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="p-8 text-center text-gray-500 dark:text-gray-400"
                        >
                          Your cart is empty —{" "}
                          <Link
                            to="/marketplace"
                            className="text-emerald-600 font-semibold"
                          >
                            browse produce
                          </Link>
                        </td>
                      </tr>
                    ) : (
                      items.map((it) => (
                        <tr
                          key={it.id}
                          className="border-b border-gray-100 dark:border-gray-700"
                        >
                          <td className="p-4 w-24">
                            <img
                              src={it.img}
                              alt={it.title}
                              className="w-16 h-16 object-cover rounded-md"
                            />
                          </td>
                          <td className="p-4">
                            <p className="font-semibold">{it.title}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {it.priceLabel ?? `KSh ${it.price}`}
                            </p>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center">
                              <button
                                onClick={() => decrease(it.id)}
                                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <span className="material-symbols-outlined text-base">
                                  remove
                                </span>
                              </button>
                              <span className="w-10 text-center font-medium">
                                {it.qty}
                              </span>
                              <button
                                onClick={() => increase(it.id)}
                                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <span className="material-symbols-outlined text-base">
                                  add
                                </span>
                              </button>
                            </div>
                          </td>
                          <td className="p-4 text-right font-semibold">
                            KSh {(Number(it.price) * it.qty).toLocaleString()}
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => removeItem(it.id)}
                              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                            >
                              <span className="material-symbols-outlined text-xl">
                                delete
                              </span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex justify-between items-center p-4">
                <button
                  onClick={() => navigate("/marketplace")}
                  className="flex items-center gap-2 font-semibold text-sm rounded-lg px-4 py-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                  Continue Shopping
                </button>

                <div className="flex items-center gap-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 p-3 rounded-lg text-sm">
                  <span className="material-symbols-outlined">
                    local_shipping
                  </span>
                  <p className="font-medium">
                    Free delivery on orders above KSh 1000
                  </p>
                </div>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-800 dark:text-gray-200">
                  <span>Subtotal</span>
                  <span>KSh {Number(subtotal).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-800 dark:text-gray-200">
                  <span>Delivery Fee</span>
                  <span>KSh 50</span>
                </div>
                <div className="border-t border-gray-100 dark:border-gray-700 my-4"></div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>KSh {(Number(subtotal) + 50).toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => navigate("/checkout")}
                  disabled={items.length === 0}
                  className="w-full mt-4 bg-emerald-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default ShoppingCart;
