import { Route, Routes } from "react-router-dom";

import VendorSignup from "./signup/VendorSignup";
import RiderSignup from "./signup/RiderSignup";
import FarmerSignUp from "./signup/Farmersignup";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import ProductPage from "./pages/ProductPage.jsx";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup/vendor" element={<VendorSignup />} />
        <Route path="/signup/rider" element={<RiderSignup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/productpage" element={<ProductPage />} />
        
      </Routes>
    </div>
  );
}

export default App;
