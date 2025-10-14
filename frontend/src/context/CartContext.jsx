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

  useEffect(() => {
    try {
      localStorage.setItem(CART_LS_KEY, JSON.stringify(items));
    } catch (err) {
      console.warn("CartContext: failed to persist cart to localStorage", err);
    }
    console.debug("CartContext: items updated", items);
  }, [items]);

  const parsePrice = (label = "") => {
    const m = (label || "")
      .toString()
      .replace(/,/g, "")
      .match(/(\d+(\.\d+)?)/);
    if (!m) return 0;
    return parseFloat(m[0]);
  };

  const addItem = (product, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty };
        return copy;
      }
      const priceLabel = product.priceLabel ?? product.price ?? "";
      const newItem = {
        id: product.id,
        title: product.title,
        priceLabel,
        price: parsePrice(priceLabel),
        img: product.img,
        vendor: product.vendor,
        qty,
      };
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
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === id);
      if (idx === -1) return prev;
      const copy = [...prev];
      copy[idx] = { ...copy[idx], qty: copy[idx].qty + by };
      return copy;
    });
  };

  const decrease = (id, by = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === id);
      if (idx === -1) return prev;
      const copy = [...prev];
      copy[idx] = { ...copy[idx], qty: copy[idx].qty - by };
      return copy.filter((x) => x.qty > 0);
    });
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

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
