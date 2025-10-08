import { Route, Routes } from "react-router-dom";

import VendorSignup from "./signup/VendorSignup";
import RiderSignup from "./signup/RiderSignup";
import FarmerSignUp from "./signup/Farmersignup";
import BuyerSignup from "./signup/BuyerSignup";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import Marketplace from "./pages/Marketplace.jsx";
import Orders from "./pages/Orders.jsx";
import Help from "./pages/Help.jsx";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup/vendor" element={<VendorSignup />} />
        <Route path="/signup/rider" element={<RiderSignup />} />
        <Route path="/signup/farmer" element={<FarmerSignUp />} />
        <Route path="/signup/buyer" element={<BuyerSignup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/productpage" element={<ProductPage />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/help" element={<Help />} />
      </Routes>
    </div>
  );
}

export default App;
