import React from "react";
// Combining imports from both branches
import { Route, Routes } from "react-router-dom";
import { CartProvider } from "./context/CartContext";

import VendorSignup from "./signup/VendorSignup";
import RiderSignup from "./signup/RiderSignup";
import FarmerSignUp from "./signup/Farmersignup";
import Vendorprofile from "./vendor/VendorProfile.jsx";
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
// Buyer related imports
// Vendor related imports
import VendorDashboard from "./vendor/VendorDashboard.jsx";
import OrderManagement from "./vendor/order_management.jsx";
import VendorProducts from "./vendor/VendorProducts.jsx";
import Farmily from "./vendor/Farmily.jsx";
import VendorWallet from "./vendor/vendorwalletandpayments.jsx";

// Rider related imports
import RiderDashboard from "./rider/RiderDashboard.jsx";
// Keeping both Rider components
import RiderDeliveryDetail from "./rider/RiderDeliveryDetail.jsx";
import RiderEarningsAndHistory from "./rider/RiderEarningsAndHistory";

function App() {
  return (
    <CartProvider>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup/vendor" element={<VendorSignup />} />
          <Route path="/signup/farmer" element={<FarmerSignUp />} />
          <Route path="/signup/rider" element={<RiderSignup />} />
          <Route path="/signup/buyer" element={<BuyerSignup />} />

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
          <Route path="/vendorprofile" element={<Vendorprofile />} />

          {/*Vendor routes */}
          <Route path="/vendordashboard" element={<VendorDashboard />} />
          <Route path="/ordermanagement" element={<OrderManagement />} />
          <Route path="/vendorproducts" element={<VendorProducts />} />
          <Route path="/farmily" element={<Farmily />} />
          <Route path="/vendorwallet" element={<VendorWallet />} />

          {/*Rider routes - Keeping all routes from both branches */}
          <Route path="/riderdashboard" element={<RiderDashboard />} />

          <Route
            path="/rider/delivery/:orderId"
            element={<RiderDeliveryDetail />}
          />
          <Route
            path="/RiderDeliveryDetail"
            element={<RiderDeliveryDetail />}
          />

          <Route path="/riderearnings" element={<RiderEarningsAndHistory />} />
        </Routes>
      </div>
    </CartProvider>
  );
}

export default App;
