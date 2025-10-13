import React from "react";
import Header from "../components/vendorComponents/Header";
import Sidebar from "../components/vendorComponents/Sidebar";
import SearchBar from "../components/vendorComponents/SearchBar";
import ProductCard from "../components/vendorComponents/ProductCard";
import { sampleProducts } from "../constants";

const Farmily = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header
        avatarUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuDeL7radWSj-FEteEjqLpufXII3-tc_o7GMvLvB07AaD_bYBkfAcIOnNbOXkTdMOHRgJQwLZE-Z_iw72Bd8bpHzfXP_m0pIvteSw7FKZ1qV9GD1KfgyDVG90bCO7OGe6JyYIkm9DBo2ArC60uEqSfDvnnYWeo6IqVEjWxsVX6dUoxjm9ozyVlriiMdVLc_jU9ZxS01QcxNa8hn-ePNbB6IcXSwExf2U61R-epab8nsOkbq95E7z6b-fH4zOt0j2MPt20nrqtPM1NHI"
        userName="Daniel Mutuku"
      />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight">
              Buy Fresh Produce Directly from Farmers
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Karibu Farm-ily! Explore a wide range of farm-fresh products
              sourced directly from local farmers.
            </p>
          </div>

          <SearchBar />

          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6">
            {sampleProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Farmily;
