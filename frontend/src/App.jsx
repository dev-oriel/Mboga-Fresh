import React from "react";
import { Route, Routes } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { VendorDataProvider } from "./context/VendorDataContext";

// Signup pages
import VendorSignup from "./signup/VendorSignup";
import RiderSignup from "./signup/RiderSignup";
import FarmerSignUp from "./signup/Farmersignup";
import BuyerSignup from "./signup/BuyerSignup";

// Common pages
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

// footer
import Contact from "./pages/Contact.jsx";
import Faq from "./pages/Faq.jsx";
import Terms from "./pages/Terms.jsx";
import Privacy from "./pages/Privacy.jsx";

// Vendor pages
import Vendorprofile from "./vendor/vendorprofile.jsx";
import VendorDashboard from "./vendor/VendoDashboard.jsx";
import OrderManagement from "./vendor/OrderManagement.jsx";
import VendorProducts from "./vendor/VendorProducts.jsx";
import Farmily from "./vendor/Farmily.jsx";
import VendorWallet from "./vendor/VendorWallet.jsx";

// Rider pages
import RiderDashboard from "./rider/RiderDashboard.jsx";
import RiderDeliveryQueue from "./rider/RiderDeliveryQueue.jsx";
import RiderHelpPage from "./rider/RiderHelpPage.jsx";
import RiderProfile from "./rider/RiderProfileSettings.jsx";
import RiderEarningsAndHistory from "./rider/RiderEarningsAndHistory.jsx";
import RiderDeliveryDetail from "./rider/RiderDeliveryDetail.jsx";

// Farmer pages
import SupplierDashboard from "./farmer/SupplierDashboard.jsx";
import Products from "./farmer/Products.jsx";
import FarmerOrderManagement from "./farmer/OrderManagement.jsx";
import SupplierProfile from "./farmer/SupplierProfile.jsx";
import SupplierWallet from "./farmer/SupplierWallet.jsx";

// Admin pages
import AdminDashboard from "./admin/AdminDashboard.jsx";
import AdminSettings from "./admin/AdminSettings.jsx";
import EscrowPayments from "./admin/EscrowPayments.jsx";
import AdminDisputeResolution from "./admin/AdminDisputeResolution.jsx";

function App() {
  return (
    <CartProvider>
      <VendorDataProvider>
        <div>
          <Routes>
            {/* General routes */}
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

            {/* footer routes */}
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />

            {/* Vendor routes */}
            <Route path="/vendordashboard" element={<VendorDashboard />} />
            <Route path="/ordermanagement" element={<OrderManagement />} />
            <Route path="/vendorproducts" element={<VendorProducts />} />
            <Route path="/farmily" element={<Farmily />} />
            <Route path="/vendorwallet" element={<VendorWallet />} />

            {/* Rider routes */}
            <Route path="/riderdashboard" element={<RiderDashboard />} />
            <Route
              path="/riderdeliveryqueue"
              element={<RiderDeliveryQueue />}
            />
            <Route path="/riderhelp" element={<RiderHelpPage />} />
            <Route path="/riderprofile" element={<RiderProfile />} />
            <Route
              path="/riderearnings"
              element={<RiderEarningsAndHistory />}
            />
            <Route
              path="/riderdelivery/:orderid"
              element={<RiderDeliveryDetail />}
            />

            {/* Farmer routes */}
            <Route path="/supplierdashboard" element={<SupplierDashboard />} />
            <Route path="/supplierproducts" element={<Products />} />
            <Route path="/supplierorders" element={<FarmerOrderManagement />} />
            <Route path="/supplierwallet" element={<SupplierWallet />} />
            <Route path="/supplierprofile" element={<SupplierProfile />} />

            {/* Admin routes */}
            <Route path="/admindashboard" element={<AdminDashboard />} />
            <Route path="/adminsettings" element={<AdminSettings />} />
            <Route path="/adminescrow" element={<EscrowPayments />} />
            <Route path="/admindisputeresolution" element={<AdminDisputeResolution />} />
          </Routes>
        </div>
      </VendorDataProvider>
    </CartProvider>
  );
}

export default App;
