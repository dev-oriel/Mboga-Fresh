import React from "react";

const WeeklyBundle = () => {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="relative bg-gradient-to-r from-[#28A745] to-[#7ED957] rounded-2xl shadow-xl overflow-hidden p-12 text-white flex items-center">
        <div className="z-10 w-2/3">
          <h2 className="text-4xl font-bold mb-2">Weekly Stew Bundle!</h2>
          <p className="text-lg mb-6">
            Get all you need for a delicious stew - tomatoes, onions, carrots,
            and dhania, for only{" "}
            <span className="font-extrabold text-2xl">KES 250!</span>
          </p>
          <button className="bg-white text-[#28A745] font-bold py-3 px-6 rounded-lg text-lg hover:bg-gray-200 transition-colors">
            Add to Cart
          </button>
        </div>
        <img
          alt="Produce bundle"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPMwWtusjfFFbt3NbyfIkkXFn_YOJpTbBz98KDTFc4jfw3n5jYzFvOssJrHya7sGGO7Z7TyOLmoyhhcl4cu6oQTcZcFlLYlrQFRp_G7-q0sVi9AGMyYu2jeoK2cRmM-ubEiasMgPGrhZxpBgoTQI6MO6IXrowdKjdyqyzFWtoYB8-MJMavtVkCpt79Mg7aXnFZkNrojZ1JOMEQ7Qqq1zMGkfYFU3AyQ1v8Op4Y0RvqK1Aa0O2U90JrzIV1ISEVlAMKpL9jC6SDFeo"
          className="absolute right-0 bottom-0 w-1/2 h-full object-cover opacity-80"
        />
      </div>
    </section>
  );
};

export default WeeklyBundle;
