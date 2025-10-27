import React from "react";
import Header from "../components/FarmerComponents/Header";
import FarmerProfileSidebar from "../components/FarmerComponents/FarmerProfileSidebar";
import FarmerPersonalInfoCard from "../components/FarmerComponents/FarmerPersonalInfoCard";
import FarmerFarmInfoCard from "../components/FarmerComponents/FarmerFarmInfoCard";
import OrderHistoryCard from "../components/OrderHistoryCard";
import AddressesCard from "../components/AddressesCard";
import PaymentMethodsCard from "../components/PaymentMethodsCard";
import { useAuth } from "../context/AuthContext";

export default function SupplierProfile() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 text-zinc-900 dark:text-gray-100">
      <Header />

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <FarmerProfileSidebar />
          </aside>
          <section className="lg:col-span-3 space-y-8">
            <FarmerPersonalInfoCard />
            <FarmerFarmInfoCard />
            <OrderHistoryCard />
            <AddressesCard />
            <PaymentMethodsCard />
          </section>
        </div>
      </main>
    </div>
  );
}
