import React from "react";
import { useCart } from "../context/CartContext";

const products = [
  {
    name: "Ripe Avocadoes (Hass)",
    vendor: "Mama Njeri's",
    price: "KES 40",
    unit: "/pc",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAPMwWtusjfFFbt3NbyfIkkXFn_YOJpTbBz98KDTFc4jfw3n5jYzFvOssJrHya7sGGO7Z7TyOLmoyhhcl4cu6oQTcZcFlLYlrQFRp_G7-q0sVi9AGMyYu2jeoK2cRmM-ubEiasMgPGrhZxpBgoTQI6MO6IXrowdKjdyqyzFWtoYB8-MJMavtVkCpt79Mg7aXnFZkNrojZ1JOMEQ7Qqq1zMGkfYFU3AyQ1v8Op4Y0RvqK1Aa0O2U90JrzIV1ISEVlAMKpL9jC6SDFeo",
    special: true,
  },
  {
    name: "Sweet Mangoes (Ngowe)",
    vendor: "Akinyi's Fruits",
    price: "KES 150",
    unit: "/kg",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBV8gBbKDa7cnMo9Dd_h-fyu4f1jiSE04nHoEkLNmImaNTqW_itR65qLuIFDIy4loHjhJGzzmb0dRdiodmUR4SR4tObd-gXkt64n3DsrJoy1DjfS74qMY9Tfg0xfB_d8-9Nq8CQqOVLD7FqjVurOP6UI1rZCj-Qe6GCrmx87UmvQdPA6VXx_Zmhn2zxzE_Nhi0FgYDA-CnO7ZXYrbubdEE72AIpZh9pqmyWoPqkUeFvjSsWV3Sp5NDBK2wLd_VXxHmMemnOdC3EKcU",
    special: false,
  },
  {
    name: "Red Onions",
    vendor: "Kimani's",
    price: "KES 120",
    unit: "/kg",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuATQit1JrF5Jnyt4wkvgo4gg9AE35WZUHYu4bkP8Ug9C24i6Hq1pNoyB6sLrOU8lTrlw08oS_T1yAyCSoFN6GBDhXyWuTyePSown1zYI1IdMrIa_s7q3R85HYOD-V4TQtSPgpFWQ4LJFw-8rwhCMVpOnTZuUJWySzBEnWCg6X2TJG7zO-c5S8NdyRVip8br5YvWYZb3AkCpH2K7OdAX80AZ36gBsL552hxuZRtmFY-68iwn-ESSyvtSyqLf1RcvFa55S4lzOUzCDRM",
    special: false,
  },
];

function slugifyName(name = "") {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const Freshpicks = () => {
  const { addItem } = useCart();

  const handleAdd = (product) => {
    const id = slugifyName(product.name);
    addItem(
      {
        id,
        title: product.name,
        price: `${product.price}${product.unit ? product.unit : ""}`,
        img: product.img,
        vendor: product.vendor,
      },
      1
    );
  };

  return (
    <section className="py-8 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white text-center">
          Today's Fresh Picks
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => {
            const id = slugifyName(product.name);
            return (
              <div
                key={id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden group flex flex-col"
              >
                <div className="relative">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full h-56 object-cover"
                  />
                  {product.special && (
                    <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      SPECIAL
                    </div>
                  )}
                </div>

                <div className="p-4 flex-grow flex flex-col">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex-grow">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    From {product.vendor}
                  </p>

                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xl font-extrabold text-green-600">
                      {product.price}{" "}
                      <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                        {product.unit}
                      </span>
                    </span>

                    <button
                      aria-label={`Add ${product.name} to cart`}
                      onClick={() => handleAdd(product)}
                      className="bg-green-600/10 text-green-600 p-2 rounded-full hover:bg-green-600 hover:text-white transition-colors"
                    >
                      <span className="material-symbols-outlined">
                        add_shopping_cart
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Freshpicks;
