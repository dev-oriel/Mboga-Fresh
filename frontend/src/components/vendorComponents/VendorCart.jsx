import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * VendorCart
 *
 * Lightweight vendor-side cart/quotes manager.
 * Uses localStorage key "vendorCart" so it doesn't interfere with buyer's CartContext.
 *
 * Item shape:
 * { id, title, qty, price, img, notes? }
 */

const STORAGE_KEY = "vendorCart";

function readCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to read vendorCart", e);
    return [];
  }
}

function writeCart(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error("Failed to write vendorCart", e);
  }
}

const VendorCart = () => {
  const [items, setItems] = useState(() => readCart());
  const navigate = useNavigate();

  useEffect(() => writeCart(items), [items]);

  const subtotal = useMemo(
    () => items.reduce((s, it) => s + Number(it.price || 0) * (it.qty || 1), 0),
    [items]
  );

  const increase = (id) =>
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, qty: (it.qty || 1) + 1 } : it))
    );

  const decrease = (id) =>
    setItems((prev) =>
      prev
        .map((it) =>
          it.id === id ? { ...it, qty: Math.max(1, (it.qty || 1) - 1) } : it
        )
        .filter(Boolean)
    );

  const removeItem = (id) =>
    setItems((prev) => prev.filter((it) => it.id !== id));

  const handleCreateOrder = () => {
    // This is vendor-side: create a vendor order (quote/dispatch). Replace with API call.
    // For now navigate to vendordashboard and pass a quick flag.
    navigate("/vendordashboard", { state: { from: "vendorCart", subtotal } });
  };

  return (
    <div className="min-h-[300px]">
      <h2 className="text-2xl font-bold mb-4">Vendor Cart & Quotes</h2>

      {items.length === 0 ? (
        <div className="py-10 text-center text-gray-600 dark:text-gray-400">
          No items in vendor cart. Use the product editor or click "Add to cart"
          on products to start a quote.
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="p-4 text-sm font-semibold" colSpan="2">
                    Product
                  </th>
                  <th className="p-4 text-sm font-semibold text-center">Qty</th>
                  <th className="p-4 text-sm font-semibold text-right">
                    Total
                  </th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
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
                        {it.farmer ?? "You"}
                      </p>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
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
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-col md:flex-row md:justify-between items-stretch md:items-center p-4 gap-4">
            <div className="flex items-center gap-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 p-3 rounded-lg text-sm">
              <span className="material-symbols-outlined">local_shipping</span>
              <p className="font-medium">
                Vendor order draft — action required to convert to sales order
              </p>
            </div>

            <div className="w-full md:w-auto flex items-center gap-4">
              <div className="text-right mr-2">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Subtotal
                </div>
                <div className="text-lg font-bold">
                  KSh {Number(subtotal).toLocaleString()}
                </div>
              </div>
              <button
                onClick={handleCreateOrder}
                className="bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg hover:opacity-95 transition"
              >
                Create Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorCart;
