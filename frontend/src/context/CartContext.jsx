// frontend/src/context/CartContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

const CART_LS_KEY = "mboga_cart_v1";

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(CART_LS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      // if parsing fails, clear the stored value and start fresh
      console.warn(
        "CartContext: error reading localStorage, resetting cart",
        err
      );
      try {
        localStorage.removeItem(CART_LS_KEY);
      } catch {}
      return [];
    }
  });

  // persist and log changes (helpful while debugging)
  useEffect(() => {
    try {
      localStorage.setItem(CART_LS_KEY, JSON.stringify(items));
    } catch (err) {
      console.warn("CartContext: failed to persist cart to localStorage", err);
    }
    // debug: show items in console whenever changed
    // remove or silence this in production
    console.debug("CartContext: items updated", items);
  }, [items]);

  const findIndex = (id) => items.findIndex((i) => i.id === id);

  const addItem = (product, qty = 1) => {
    console.debug("CartContext.addItem called", { product, qty });
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty };
        console.debug("CartContext.addItem -> increased qty", copy[idx]);
        return copy;
      }
      const newItem = {
        id: product.id,
        title: product.title,
        priceLabel: product.price ?? "",
        price: parsePrice(product.price),
        img: product.img,
        vendor: product.vendor,
        qty,
      };
      console.debug("CartContext.addItem -> new item", newItem);
      return [...prev, newItem];
    });
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  const setQty = (id, qty) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === id);
      if (idx === -1) return prev;
      const copy = [...prev];
      copy[idx] = { ...copy[idx], qty: Math.max(0, qty) };
      return copy.filter((x) => x.qty > 0);
    });
  };

  const increase = (id, by = 1) => {
    const idx = findIndex(id);
    if (idx > -1) setQty(id, items[idx].qty + by);
  };

  const decrease = (id, by = 1) => {
    const idx = findIndex(id);
    if (idx > -1) setQty(id, items[idx].qty - by);
  };

  const clearCart = () => setItems([]);

  const subtotal = items.reduce(
    (sum, it) => sum + (Number(it.price) || 0) * it.qty,
    0
  );

  const count = items.reduce((s, it) => s + it.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        increase,
        decrease,
        setQty,
        clearCart,
        subtotal,
        count,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// helper to extract numeric price from labels like "Ksh 120/kg" or "$5.00/kg"
function parsePrice(label = "") {
  const m = (label || "").replace(",", "").match(/(\d+(\.\d+)?)/);
  if (!m) return 0;
  return parseFloat(m[0]);
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
