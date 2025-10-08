// frontend/src/components/CartTable.jsx
import React from "react";
import { useCart } from "../context/CartContext";

const formatCurrency = (value) =>
  `KSh ${Number(value).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })}`;

const CartTable = () => {
  const { items, increase, decrease, removeItem } = useCart();

  if (!items || items.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
        Your cart is empty.
      </div>
    );
  }

  return (
    <table className="w-full text-left">
      <thead className="border-b border-gray-200 dark:border-gray-700">
        <tr>
          <th className="p-4 text-sm font-semibold" colSpan={2}>
            Product
          </th>
          <th className="p-4 text-sm font-semibold text-center">Quantity</th>
          <th className="p-4 text-sm font-semibold text-right">Total</th>
          <th className="p-4" />
        </tr>
      </thead>

      <tbody>
        {items.map((it) => (
          <tr
            key={it.id}
            className="border-b border-gray-100 dark:border-gray-700"
          >
            <td className="p-4 w-24">
              <div
                className="bg-center bg-no-repeat bg-cover rounded-lg w-16 h-16"
                style={{ backgroundImage: `url("${it.img}")` }}
              />
            </td>

            <td className="p-4 align-top">
              <p className="font-semibold">{it.title}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {it.priceLabel || formatCurrency(it.price)}
              </p>
            </td>

            <td className="p-4 text-center align-top">
              <div className="flex items-center justify-center">
                <button
                  onClick={() => decrease(it.id, 1)}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label={`Decrease ${it.title}`}
                >
                  <span className="material-symbols-outlined text-base">
                    remove
                  </span>
                </button>

                <span className="w-10 text-center font-medium">{it.qty}</span>

                <button
                  onClick={() => increase(it.id, 1)}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label={`Increase ${it.title}`}
                >
                  <span className="material-symbols-outlined text-base">
                    add
                  </span>
                </button>
              </div>
            </td>

            <td className="p-4 text-right align-top font-semibold">
              {formatCurrency((Number(it.price) || 0) * it.qty)}
            </td>

            <td className="p-4 text-right align-top">
              <button
                onClick={() => removeItem(it.id)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                aria-label={`Remove ${it.title}`}
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
  );
};

export default CartTable;
