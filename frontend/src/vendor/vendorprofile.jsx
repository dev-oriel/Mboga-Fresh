import React from "react";
import VendorProfileSidebar from "../components/vendorComponents/VendorProfileSidebar";
import Header from "../components/vendorComponents/Header";
import Footer from "../components/vendorComponents/Footer";
import VendorPersonalInfoCard from "../components/vendorComponents/VendorPersonalInfoCard";
import VendorStoreInfoCard from "../components/vendorComponents/VendorStoreInfoCard";
import VendorOrderHistoryCard from "../components/vendorComponents/VendorOrderHistoryCard";
import VendorAddressesCard from "../components/vendorComponents/VendorAddressesCard";
import VendorPaymentMethodsCard from "../components/vendorComponents/VendorPaymentMethodsCard";


import { useAuth } from "../context/AuthContext";

export default function FreshHarvestProfile() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState("store");

  const initialStore = {
    shopName: "Mama Mboga's Finest",
    location: "Kibera, Nairobi",
    contact: "+254 712 345 678",
    description:
      "Fresh vegetables and fruits sourced directly from local farmers. Quality you can trust.",
  };

  const [storeInfo, setStoreInfo] = useState(() => {
    try {
      const saved = localStorage.getItem("fh_store_info");
      return saved ? JSON.parse(saved) : initialStore;
    } catch (e) {
      return initialStore;
    }
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [reviews] = useState([
    {
      id: 1,
      name: "Aisha Hassan",
      time: "2 weeks ago",
      rating: 5,
      text: "The freshest produce I've ever had! The tomatoes were so juicy and flavorful. Will definitely be ordering again.",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    },
    {
      id: 2,
      name: "David Mwangi",
      time: "1 month ago",
      rating: 4,
      text: "Great quality and fast delivery. The spinach was a bit wilted, but overall very satisfied.",
      avatar:
        "https://images.unsplash.com/photo-1545996124-1b0fb2c7d2a0?auto=format&fit=crop&w=200&q=80",
    },
  ]);

  const [modalImage, setModalImage] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    localStorage.setItem("fh_store_info", JSON.stringify(storeInfo));
  }, [storeInfo]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const handleStoreChange = (e) => {
    const { id, value } = e.target;
    setStoreInfo((prev) => ({ ...prev, [id]: value }));
  };

  const handleStoreSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (!storeInfo.shopName || !storeInfo.contact) {
      setToast("Shop name and contact are required.");
      return;
    }
    // saved to localStorage via effect
    setToast("Store information saved successfully.");
    console.log("Saved store info:", storeInfo);
  };

  const handlePasswordChange = (e) => {
    const { id, value } = e.target;
    setPasswordData((p) => ({ ...p, [id]: value }));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setToast("New passwords do not match.");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setToast("Password must be at least 6 characters.");
      return;
    }
    // Mock password update
    setToast("Password updated successfully.");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    console.log("Password changed (mock):", passwordData);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast("Copied to clipboard");
    } catch (e) {
      setToast("Could not copy");
    }
  };

  const ratingStats = (() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => counts[r.rating]++);
    const total = reviews.length || 1;
    return {
      counts,
      total,
      average: (
        reviews.reduce((s, r) => s + r.rating, 0) / (reviews.length || 1)
      ).toFixed(1),
      percent: (n) => Math.round(((counts[n] || 0) / total) * 100),
    };
  })();


const VendorProfile = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 text-zinc-900 dark:text-gray-100">
      {/* Top nav */}
      <Header
        avatarUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuDeL7radWSj-FEteEjqLpufXII3-tc_o7GMvLvB07AaD_bYBkfAcIOnNbOXkTdMOHRgJQwLZE-Z_iw72Bd8bpHzfXP_m0pIvteSw7FKZ1qV9GD1KfgyDVG90bCO7OGe6JyYIkm9DBo2ArC60uEqSfDvnnYWeo6IqVEjWxsVX6dUoxjm9ozyVlriiMdVLc_jU9ZxS01QcxNa8hn-ePNbB6IcXSwExf2U61R-epab8nsOkbq95E7z6b-fH4zOt0j2MPt20nrqtPM1NHI"
        userName={user?.name || "Vendor"}
      />

     
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <VendorProfileSidebar />
          </aside>
          <section className="lg:col-span-3 space-y-8">
            <VendorPersonalInfoCard />
            <VendorStoreInfoCard />
            <VendorOrderHistoryCard />
            <VendorAddressesCard />
            <VendorPaymentMethodsCard />
          </section>
        </div>
      </main>
    </div>
  );
};

export default VendorProfile;