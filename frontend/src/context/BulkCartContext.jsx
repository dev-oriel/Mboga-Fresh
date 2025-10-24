// frontend/src/context/BulkCartContext.jsx

import React, {
  createContext,
  useContext,
  useMemo,
  useEffect,
  useState,
  useCallback,
} from "react";

const BulkCartContext = createContext();

const CART_LS_KEY = "mboga_bulk_cart_v1";

export const BulkCartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(CART_LS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.warn(
        "BulkCartContext: error reading localStorage, resetting cart",
        err
      );
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_LS_KEY, JSON.stringify(items));
    } catch (err) {
      console.warn(
        "BulkCartContext: failed to persist cart to localStorage",
        err
      );
    }
  }, [items]);

  const addItem = useCallback((product, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty };
        return copy;
      }
      const newItem = {
        id: product.id,
        title: product.title,
        price: product.price,
        farmer: product.farmer,
        image: product.image,
        qty,
      };
      return [...prev, newItem];
    });
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, it) =>
          sum + Number(it.price.match(/(\d+(\.\d+)?)/)?.[0] || 0) * it.qty,
        0
      ),
    [items]
  );

  const count = useMemo(() => items.reduce((s, it) => s + it.qty, 0), [items]);

  const value = {
    items,
    addItem,
    removeItem,
    clearCart,
    subtotal,
    count,
  };

  return (
    <BulkCartContext.Provider value={value}>
      {children}
    </BulkCartContext.Provider>
  );
};

export const useBulkCart = () => {
  const ctx = useContext(BulkCartContext);
  if (!ctx) throw new Error("useBulkCart must be used within BulkCartProvider");
  return ctx;
};
