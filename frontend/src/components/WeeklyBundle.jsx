import React from "react";
import { useCart } from "../context/CartContext";

const WeeklyBundle = () => {
  const { addItem } = useCart();

  const bundle = {
    id: "bundle-weekly-stew",
    title: "Weekly Stew Bundle",
    price: "KES 250",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAPMwWtusjfFFbt3NbyfIkkXFn_YOJpTbBz98KDTFc4jfw3n5jYzFvOssJrHya7sGGO7Z7TyOLmoyhhcl4cu6oQTcZcFlLYlrQFRp_G7-q0sVi9AGMyYu2jeoK2cRmM-ubEiasMgPGrhZxpBgoTQI6MO6IXrowdKjdyqyzFWtoYB8-MJMavtVkCpt79Mg7aXnFZkNrojZ1JOMEQ7Qqq1zMGkfYFU3AyQ1v8Op4Y0RvqK1Aa0O2U90JrzIV1ISEVlAMKpL9jC6SDFeo",
    vendor: "Mboga Fresh",
  };

  const handleAdd = () => {
    addItem(
      {
        id: bundle.id,
        title: bundle.title,
        price: bundle.price,
        img: bundle.img,
        vendor: bundle.vendor,
      },
      1
    );
  };

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="relative bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-2xl shadow-xl overflow-hidden p-8 text-white flex items-center">
        <div className="z-10 w-full md:w-2/3">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Weekly Stew Bundle!
          </h2>
          <p className="text-lg mb-6">
            Get all you need for a delicious stew - tomatoes, onions, carrots,
            and dhania, for only{" "}
            <span className="font-extrabold text-2xl">KES 250</span>
          </p>
          <button
            onClick={handleAdd}
            className="bg-white text-emerald-700 font-bold py-3 px-6 rounded-lg text-lg hover:bg-gray-100 transition-colors"
          >
            Add to Cart
          </button>
        </div>

        <img
          alt="Produce bundle"
          src={bundle.img}
          className="absolute right-0 bottom-0 w-1/2 h-full object-cover opacity-80 pointer-events-none"
        />
      </div>
    </section>
  );
};

export default WeeklyBundle;
