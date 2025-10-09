
import { Route, Routes } from "react-router-dom";
import { CartProvider } from "./context/CartContext";

import VendorSignup from "./signup/VendorSignup";
import RiderSignup from "./signup/RiderSignup";
import FarmerSignUp from "./signup/Farmersignup";
import Vendorprofile from "./pages/vendorprofile.jsx";
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
import VendorDashboard from "./vendor/vendordashboard.jsx";
import OrderManagement from "./vendor/order_management.jsx";
import VendorProducts from "./vendor/vendor_products.jsx";

// Rider related imports
import RiderDashboard from "./rider/RiderDashboard.jsx";
import RiderDeliveryDetail from "./rider/RiderDeliveryDetail.jsx";

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

          {/*Rider routes */}
          <Route path="/riderdashboard" element={<RiderDashboard />} />
          <Route path="/rider/delivery/:orderId" element={<RiderDeliveryDetail />} />
          <Route path="/RiderDeliveryDetail" element={<RiderDeliveryDetail />} />
        </Routes>
      </div>
    </CartProvider>
  );
}

export default App;

