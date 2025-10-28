import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { VendorDataProvider } from "./context/VendorDataContext";
import { BulkCartProvider } from "./context/BulkCartContext.jsx";
import PrivateRoute from "./components/PrivateRoute";

// Signup pages
import VendorSignup from "./signup/VendorSignup";
import RiderSignup from "./signup/RiderSignup";
import FarmerSignUp from "./signup/Farmersignup";
import BuyerSignup from "./signup/BuyerSignup";

// Common pages (Public/Buyer Flow)
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
import OrderDetails from "./pages/OrderDetails";

// Footer Info pages
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
import BulkOrdersList from "./vendor/BulkOrdersList.jsx";

// Rider pages
import RiderDashboard from "./rider/RiderDashboard.jsx";
import RiderDeliveryQueue from "./rider/RiderDeliveryQueue.jsx";
import RiderHelpPage from "./rider/RiderHelpPage.jsx";
import RiderProfile from "./rider/RiderProfileSettings.jsx";
import RiderEarningsAndHistory from "./rider/RiderEarningsAndHistory.jsx";
import RiderDeliveryDetail from "./rider/RiderDeliveryDetail.jsx";
import RiderDeliveryRoute from "./rider/RiderDeliveryRoute.jsx";
import RiderOrderConfirmation from "./rider/RiderOrderConfirmation.jsx";

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
import UserManagement from "./admin/UserManagement.jsx";
import AdminDisputeResolution from "./admin/AdminDisputeResolution.jsx";
import ReportsAnalytics from "./admin/ReportsAnalytics.jsx";
import ProductManagement from "./admin/ProductManagement.jsx";
import DeliveryAndLogistics from "./admin/DeliveryAndLogistics.jsx";
import AdminOrderManagement from "./admin/OrderManagement.jsx";
// import ReportsAnalytics from "./admin/ReportsAnalytics.jsx";

function App() {
  return (
    <CartProvider>
      <VendorDataProvider>
        <BulkCartProvider>
          <div>
            <Routes>
              {/* ==============================================================
              1. PUBLIC BROWSING & AUTH ROUTES
              - Allows: Unauthenticated users (guests) and logged-in buyers.
              - Action: Redirects logged-in staff (Vendor/Farmer/Rider/Admin) to their dashboard.
              ==============================================================
            */}
              <Route
                element={
                  <PrivateRoute
                    allowedRoles={["buyer", "guest"]}
                    allowUnauthenticated={true}
                    redirectIfAuthenticated={true}
                  />
                }
              >
                <Route path="/" element={<Home />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/category/:id" element={<CategoryPage />} />
                <Route path="/vendor/:id" element={<VendorPage />} />

                {/* Public Info Routes */}
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<Faq />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/help" element={<Help />} />

                {/* Login & Signup Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup/vendor" element={<VendorSignup />} />
                <Route path="/signup/farmer" element={<FarmerSignUp />} />
                <Route path="/signup/rider" element={<RiderSignup />} />
                <Route path="/signup/buyer" element={<BuyerSignup />} />
              </Route>

              {/* ==============================================================
              2. PROTECTED ROUTES (REQUIRES LOGIN)
              ==============================================================
            */}

              {/* Buyer (ONLY accessible by Buyer/Admin) */}
              <Route
                element={<PrivateRoute allowedRoles={["buyer", "admin"]} />}
              >
                <Route path="/orders" element={<Orders />} />
                <Route path="/cart" element={<ShoppingCart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/profile" element={<BuyerProfile />} />
                <Route path="/orders/:orderId" element={<OrderDetails />} />
                <Route path="/order-placed" element={<OrderPlaced />} />
              </Route>

              {/* Vendor (ONLY accessible by Vendor/Admin) */}
              <Route
                element={<PrivateRoute allowedRoles={["vendor", "admin"]} />}
              >
                <Route path="/vendordashboard" element={<VendorDashboard />} />
                <Route path="/ordermanagement" element={<OrderManagement />} />
                <Route path="/vendorproducts" element={<VendorProducts />} />
                <Route path="/farmily" element={<Farmily />} />
                <Route path="/vendorwallet" element={<VendorWallet />} />
                <Route path="/vendorprofile" element={<Vendorprofile />} />
                <Route path="/bulkorders" element={<BulkOrdersList />} />
              </Route>

              {/* Farmer (Supplier) (ONLY accessible by Farmer/Admin) */}
              <Route
                element={<PrivateRoute allowedRoles={["farmer", "admin"]} />}
              >
                <Route
                  path="/supplierdashboard"
                  element={<SupplierDashboard />}
                />
                <Route path="/supplierproducts" element={<Products />} />
                <Route
                  path="/supplierorders"
                  element={<FarmerOrderManagement />}
                />
                <Route path="/supplierwallet" element={<SupplierWallet />} />
                <Route path="/supplierprofile" element={<SupplierProfile />} />
              </Route>

              {/* Rider (ONLY accessible by Rider/Admin) */}
              <Route
                element={<PrivateRoute allowedRoles={["rider", "admin"]} />}
              >
                <Route path="/riderdashboard" element={<RiderDashboard />} />
                <Route
                  path="/rider-confirm-delivery"
                  element={<RiderOrderConfirmation />}
                />
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
                <Route
                  path="/riderdeliveryroute"
                  element={<RiderDeliveryRoute />}
                />
              </Route>

              {/* Admin (ONLY accessible by Admin) */}
              <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
                <Route path="/admindashboard" element={<AdminDashboard />} />
                <Route
                  path="/deliveryandlogistics"
                  element={<DeliveryAndLogistics />}
                />
                <Route path="/adminsettings" element={<AdminSettings />} />
                <Route path="/usermanagement" element={<UserManagement />} />
                <Route path="/adminproducts" element={<ProductManagement />} />
                <Route
                  path="/admin/ordermanagement"
                  element={<AdminOrderManagement />}
                />
                <Route path="/adminescrow" element={<EscrowPayments />} />
                <Route
                  path="/admindisputeresolution"
                  element={<AdminDisputeResolution />}
                />
                <Route path="/adminreports" element={<ReportsAnalytics />} />
                {/* Assuming you want to include this new import once component is ready: */}
                {/* <Route path="/adminreports" element={<ReportsAnalytics />} /> */}
              </Route>

              {/* Final Fallback: Redirects all unknown paths to the public homepage */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </BulkCartProvider>
      </VendorDataProvider>
    </CartProvider>
  );
}

export default App;
