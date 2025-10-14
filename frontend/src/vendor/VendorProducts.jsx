import React, { useState } from "react";
import { Edit2, Trash2, Plus } from "lucide-react";
import Header from "../components/vendorComponents/Header";
import Footer from "../components/vendorComponents/Footer"; 

export default function VendorProductManagement() {
  const [products, setProducts] = useState([
    {
      id: 1,
      image: "🍅",
      name: "Ripe Tomatoes",
      category: "Vegetables",
      price: "Ksh 120",
      stock: "50 kg",
      status: "In Stock",
    },
    {
      id: 2,
      image: "🥔",
      name: "Red Potatoes",
      category: "Vegetables",
      price: "Ksh 80",
      stock: "100 kg",
      status: "In Stock",
    },
    {
      id: 3,
      image: "🍌",
      name: "Cavendish Bananas",
      category: "Fruits",
      price: "Ksh 60",
      stock: "200 kg",
      status: "In Stock",
    },
    {
      id: 4,
      image: "🧅",
      name: "White Onions",
      category: "Vegetables",
      price: "Ksh 90",
      stock: "75 kg",
      status: "In Stock",
    },
    {
      id: 5,
      image: "🥭",
      name: "Kent Mangoes",
      category: "Fruits",
      price: "Ksh 150",
      stock: "30 kg",
      status: "Out of Stock",
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header
        avatarUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuDeL7radWSj-FEteEjqLpufXII3-tc_o7GMvLvB07AaD_bYBkfAcIOnNbOXkTdMOHRgJQwLZE-Z_iw72Bd8bpHzfXP_m0pIvteSw7FKZ1qV9GD1KfgyDVG90bCO7OGe6JyYIkm9DBo2ArC60uEqSfDvnnYWeo6IqVEjWxsVX6dUoxjm9ozyVlriiMdVLc_jU9ZxS01QcxNa8hn-ePNbB6IcXSwExf2U61R-epab8nsOkbq95E7z6b-fH4zOt0j2MPt20nrqtPM1NHI"
        userName="Daniel Mutuku"
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header with Add Button */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">My Products</h2>
          <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-lg flex items-center space-x-2 font-medium">
            <Plus className="w-5 h-5" />
            <span>Add Product</span>
          </button>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-green-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                  Image
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                  Product Name
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                  Category
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                  Price/Unit
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                  Stock
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr
                  key={product.id}
                  className={
                    index !== products.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }
                >
                  <td className="py-4 px-6">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                      {product.image}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">
                    {product.name}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {product.category}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">
                    {product.price}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">
                    {product.stock}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded text-xs font-medium ${
                        product.status === "In Stock"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <button className="text-gray-600 hover:text-gray-900">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <Footer /> {/* 👈 The reusable Footer component is now used here */}
    </div>
  );
}