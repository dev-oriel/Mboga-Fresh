import React from "react";
import ProfileSidebar from "../components/ProfileSidebar";
import Header from "../components/Header";
import PersonalInfoCard from "../components/PersonalInfoCard";
import FavoritesCard from "../components/FavoritesCard";
import OrderHistoryCard from "../components/OrderHistoryCard";
import AddressesCard from "../components/AddressesCard";
import PaymentMethodsCard from "../components/PaymentMethodsCard";

const BuyerProfile = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans">
        <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <ProfileSidebar />
          </aside>
          <section className="lg:col-span-3 space-y-8">
            <PersonalInfoCard />
            <FavoritesCard />
            <OrderHistoryCard />
            <AddressesCard />
            <PaymentMethodsCard />
          </section>
        </div>
      </main>
    </div>
  );
};

export default BuyerProfile;
