import React from "react";
import VendorProfileSidebar from "../components/vendorComponents/VendorProfileSidebar";
import Header from "../components/vendorComponents/Header";
import VendorPersonalInfoCard from "../components/vendorComponents/VendorPersonalInfoCard";
import VendorStoreInfoCard from "../components/vendorComponents/VendorStoreInfoCard";
import VendorOrderHistoryCard from "../components/vendorComponents/VendorOrderHistoryCard";
import VendorAddressesCard from "../components/vendorComponents/VendorAddressesCard";
import VendorPaymentMethodsCard from "../components/vendorComponents/VendorPaymentMethodsCard";

const VendorProfile = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Header />
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