// frontend/src/components/ProductGrid.jsx
import React from "react";
import ProductCard from "./ProductCard";

/**
 * ProductGrid
 * - products: array of product objects
 * - onView(id)
 * - onAdd(product)
 */
const ProductGrid = ({ products = [], onView, onAdd }) => {
  if (!products || products.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500 dark:text-gray-400">
        No products found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((p) => (
        <ProductCard
          key={p.id}
          {...p}
          onView={() => onView?.(p.id)}
          onAdd={() => onAdd?.(p)}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
