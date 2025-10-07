import { Route, Routes } from "react-router-dom";

import VendorSignup from "./signup/VendorSignup"
import RiderSignup from "./signup/RiderSignup"
import Home from "./pages/Home.jsx"; 

function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup/vendor" element={<VendorSignup />} />
      </Routes>
    </div>
  )
}

export default App
