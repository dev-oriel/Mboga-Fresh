import React from "react";
import { Route, Routes } from "react-router-dom";
import { CartProvider } from "./context/CartContext";

import VendorSignup from "./signup/VendorSignup";
import RiderSignup from "./signup/RiderSignup";
import FarmerSignUp from "./signup/Farmersignup";
import BuyerSignup from "./signup/BuyerSignup";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Marketplace from "./pages/Marketplace.jsx";
import Orders from "./pages/Orders.jsx";
import Help from "./pages/Help.jsx";
import ProductDetails from "./components/ProductDetails.jsx";
import ShoppingCart from "./pages/ShoppingCart";
import Checkout from "./pages/Checkout";
import OrderPlaced from "./pages/OrderPlaced";
import CategoryPage from "./pages/CategoryPage";
import VendorPage from "./pages/VendorPage";
import BuyerProfile from "./pages/BuyerProfile.jsx";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup/vendor" element={<VendorSignup />} />
        <Route path="/signup/farmer" element={<FarmerSignUp />} />
        <Route path="/signup/rider" element={<RiderSignup />} />
        <Route path="/signup/farmer" element={<FarmerSignUp />} />
        <Route path="/signup/buyer" element={<BuyerSignup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/help" element={<Help />} />

        <Route path="/product/:id" element={<ProductDetails />} />
      </Routes>
    </div>
    <CartProvider>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup/vendor" element={<VendorSignup />} />
          <Route path="/signup/farmer" element={<FarmerSignUp />} />
          <Route path="/signup/rider" element={<RiderSignup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/help" element={<Help />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<ShoppingCart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<BuyerProfile />} />
          <Route path="/order-placed" element={<OrderPlaced />} />
          <Route path="/category/:id" element={<CategoryPage />} />
          <Route path="/vendor/:id" element={<VendorPage />} />
        </Routes>
      </div>
    </CartProvider>
  );
}

export default App;
