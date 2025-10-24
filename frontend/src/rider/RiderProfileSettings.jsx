import React from "react";
import RiderHeader from "../components/riderComponents/RiderHeader";
import RiderProfileSidebar from "../components/riderComponents/RiderProfileSidebar";
import RiderPersonalInfoCard from "../components/riderComponents/RiderPersonalInfoCard";
import RiderVehicleInfoCard from "../components/riderComponents/RiderVehicleInfoCard";
import VendorAddressesCard from "../components/vendorComponents/VendorAddressesCard";
import VendorPaymentMethodsCard from "../components/vendorComponents/VendorPaymentMethodsCard";
import { useAuth } from "../context/AuthContext";

export default function ProfileSettings() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 text-zinc-900 dark:text-gray-100">
      <RiderHeader />

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <RiderProfileSidebar />
          </aside>
          <section className="lg:col-span-3 space-y-8">
            <RiderPersonalInfoCard />
            <RiderVehicleInfoCard />
            <VendorAddressesCard />
            <VendorPaymentMethodsCard />
          </section>
        </div>
      </main>
    </div>
  );
}