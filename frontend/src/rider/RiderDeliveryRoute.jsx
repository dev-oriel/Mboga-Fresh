import React from "react";
import { useNavigate } from "react-router-dom";
import RiderHeader from "../components/riderComponents/RiderHeader";

const RiderDeliveryRoute = () => {
  const navigate = useNavigate();

  const handleOrdersClick = () => {
    navigate("/riderdeliveryqueue");
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-text-light dark:text-text-dark">
      <RiderHeader />
      
      <main className="flex-1 px-4 sm:px-6 lg:px-8 xl:px-40 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-6">
            <button 
              onClick={handleOrdersClick}
              className="text-green-500 dark:text-green-300 hover:underline font-medium"
            >
              Orders
            </button>
            <span className="text-subtle-light dark:text-subtle-dark">/</span>
            <span>Order #12345</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="md:col-span-2 space-y-8">
              {/* Map Section */}
              <div className="relative rounded-xl overflow-hidden shadow-lg bg-white/50 dark:bg-black/20 border-2 border-green-100 dark:border-green-700" 
                   style={{
                     backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                   }}>
                <div 
                  className="w-full bg-center bg-no-repeat aspect-video bg-cover" 
                  style={{
                    backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBmjZOmMeitn7qScd4_WEh8lIwJ5ZOXArZwLhrXjk0f4th4Cl3bJ1jp375VedMnCpVxDs7XNRXJ2dfw7Fpn3K-QxPBTvNT8D26fHfTm0yvTLEgccgsdJHgOEYepBdhG6lIRI24w1y--vLb3u2TVsEPi2cEzHWAGBR7sM48qF78ctYtie5V-Sdy5HCmegiBevIjcp5u91ljilbH0XIL6rRO12pvzjbKKPQYDWPHveAoriT7XjgxvvoEAvVLA27H_JduiM-crIj8wAYk")`
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <h2 className="text-2xl font-bold text-white">Delivery Route</h2>
                  <p className="text-white/80">Mama Rose's Greens to Aisha Hassan</p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm p-6 rounded-xl border-2 border-green-100 dark:border-green-700"
                   style={{
                     backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                   }}>
                <h3 className="text-lg font-bold mb-4">Contact Information</h3>
                <div className="flex items-start gap-4">
                  <div 
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-16 w-16 border-2 border-green-400"
                    style={{
                      backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuD1YEHOv23RcKPO688ZgOzgwpUf_xzDBRgAnZA2X6rK28YtdJUELrh1NR_-1ofvpxuO_8l1Pn-BQ8F904Gvza3pTQTUe3t_zTTx1U-2Jx4zzI4mByaaIB93XpQbK-jFol_88uTjen8YWm04RtRKJRvhEBiA9WDQdqKUum_uHhvTFMdHL_fF8KydW1IlD805ulWZtQrtFx607L_L7jWAUsBzL0xKxkovLnbkNhdlFFmpNFytYJ8zTGOohES6DmC_VLDU73aVQPDz5YE")`
                    }}
                  />
                  <div className="flex-1">
                    <p className="font-bold">Aisha Hassan (Customer)</p>
                    <p className="text-sm text-green-500 dark:text-green-300 font-medium">
                      Mama Rose's Greens (Vendor)
                    </p>
                    <div className="flex gap-3 mt-3">
                      <button className="flex-1 flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-300 text-sm font-bold hover:bg-green-100 dark:hover:bg-green-800/30 transition-colors duration-200">
                        <span className="material-symbols-outlined text-base">call</span>
                        <span>Call</span>
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-300 text-sm font-bold hover:bg-green-100 dark:hover:bg-green-800/30 transition-colors duration-200">
                        <span className="material-symbols-outlined text-base">message</span>
                        <span>Message</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm p-6 rounded-xl border-2 border-green-100 dark:border-green-700"
                   style={{
                     backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                   }}>
                <h3 className="text-lg font-bold mb-4">Items in Order</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b-2 border-green-100 dark:border-green-700">
                      <tr>
                        <th className="px-4 py-3 text-left font-bold text-green-500 dark:text-green-300">
                          Item
                        </th>
                        <th className="px-4 py-3 text-left font-bold text-green-500 dark:text-green-300">
                          Quantity
                        </th>
                        <th className="px-4 py-3 text-right font-bold text-green-500 dark:text-green-300">
                          Price
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-green-50 dark:border-green-900/30">
                        <td className="px-4 py-4 font-medium">Tomatoes</td>
                        <td className="px-4 py-4">2 kg</td>
                        <td className="px-4 py-4 text-right">KES 200</td>
                      </tr>
                      <tr className="border-b border-green-50 dark:border-green-900/30">
                        <td className="px-4 py-4 font-medium">Spinach</td>
                        <td className="px-4 py-4">1 bunch</td>
                        <td className="px-4 py-4 text-right">KES 100</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-4 font-medium">Mangoes</td>
                        <td className="px-4 py-4">3</td>
                        <td className="px-4 py-4 text-right">KES 300</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="md:col-span-1 space-y-8">
              {/* Order Summary */}
              <div className="bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm p-6 rounded-xl border-2 border-green-100 dark:border-green-700"
                   style={{
                     backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                   }}>
                <h3 className="text-lg font-bold mb-4">Order Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="font-bold text-green-500 dark:text-green-300">Order ID</span>
                    <span className="font-medium">#12345</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-green-500 dark:text-green-300">Order Date</span>
                    <span className="font-medium">July 26, 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-green-500 dark:text-green-300">Payment</span>
                    <span className="font-medium">Mobile Money</span>
                  </div>
                  <div className="pt-3 mt-3 border-t-2 border-green-100 dark:border-green-700 flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span>KES 1,500</span>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm p-6 rounded-xl border-2 border-green-100 dark:border-green-700"
                   style={{
                     backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                   }}>
                <h3 className="text-lg font-bold mb-4">Delivery Address</h3>
                <p className="text-sm font-medium">Aisha Hassan</p>
                <p className="text-sm text-green-500 dark:text-green-300 font-medium">
                  123 Acacia Avenue, Nairobi
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button className="w-full flex items-center justify-center gap-2 rounded-xl h-12 px-5 bg-green-600 hover:bg-green-700 text-white text-base font-bold shadow-lg transition-all transform hover:scale-105 duration-200">
                  <span className="material-symbols-outlined">local_shipping</span>
                  <span>Confirm Pickup</span>
                </button>
                <button className="w-full flex items-center justify-center gap-2 rounded-xl h-12 px-5 bg-green-600 hover:bg-green-700 text-white text-base font-bold shadow-lg transition-all transform hover:scale-105 duration-200">
                  <span className="material-symbols-outlined">route</span>
                  <span>Start Delivery</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RiderDeliveryRoute;