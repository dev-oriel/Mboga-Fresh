import React from "react";
import Header from "../components/Header.jsx";
import HeroSection from "../components/HeroSection.jsx";
import CategoriesSection from "../components/CategoriesSection.jsx";
import VendorsSection from "../components/VendorsSection.jsx";
import WeeklyBundle from "../components/WeeklyBundle.jsx";
import Footer from "../components/FooterSection.jsx";
import Freshpicks from "../components/Freshpicks.jsx";

const Home = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Header />

      <main>
        <HeroSection />
        <CategoriesSection />
        <VendorsSection />
        <WeeklyBundle />
        <Freshpicks />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
