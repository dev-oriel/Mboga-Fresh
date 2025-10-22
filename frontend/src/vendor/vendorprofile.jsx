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

const VendorProfile = () => {
  const { user } = useAuth();
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
