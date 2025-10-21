import React from "react";

const ProductCard = ({ product = {} }) => {
  const { title, farmer, price, image } = product;

  return (
    <article className="bg-gray-50 dark:bg-gray-800/50 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 group">
      <div
        className="w-full h-48 bg-cover bg-center"
        style={{
          backgroundImage: `url("${
            image || "https://via.placeholder.com/600x400"
          }")`,
        }}
        role="img"
        aria-label={title}
      />

      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{farmer}</p>
        <p className="font-semibold text-emerald-600 mt-1">{price}</p>

        <button
          className="mt-4 w-full bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg hover:opacity-95 transition-colors flex items-center justify-center gap-2"
          aria-label={`Add ${title} to cart`}
        >
          <span className="material-symbols-outlined" aria-hidden>
            add_shopping_cart
          </span>
          <span>Add to Cart</span>
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
