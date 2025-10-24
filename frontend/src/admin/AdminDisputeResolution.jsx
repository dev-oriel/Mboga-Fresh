import React from "react";
import Sidebar from "../components/adminComponents/AdminSidebar";
import Header from "../components/adminComponents/AdminHeader";
import { Paperclip, Send, Upload, Truck, CheckCircle, RefreshCcw } from "lucide-react";

const AdminDisputeResolution = () => {
  const messages = [
    {
      sender: "Amina Hassan (Buyer)",
      text: "I received the order, but the mangoes were not ripe as described. They are hard and inedible.",
      side: "left",
      avatar: "https://randomuser.me/api/portraits/women/79.jpg",
    },
    {
      sender: "Juma Mwangi (Seller)",
      text: "I assure you, the mangoes were ripe when they left my farm. Perhaps they were damaged in transit?",
      side: "right",
      avatar: "https://randomuser.me/api/portraits/men/51.jpg",
    },
    {
      sender: "Amina Hassan (Buyer)",
      text: "There’s no visible damage to the packaging. The mangoes are simply not ripe.",
      side: "left",
      avatar: "https://randomuser.me/api/portraits/women/79.jpg",
    },
    {
      sender: "Amina Hassan (Buyer)",
      text: "I've attached photos as evidence. Please review them.",
      side: "left",
      avatar: "https://randomuser.me/api/portraits/women/79.jpg",
      images: [
        "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400",
        "https://images.unsplash.com/photo-1574226516831-e1dff420e12e?w=400",
      ],
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Chat Section */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
            <div className="border-b p-5">
              <h2 className="text-lg font-semibold text-gray-800">
                Dispute: Order #123456
              </h2>
              <p className="text-green-600 text-sm font-medium">Unripe Mangoes</p>
            </div>

            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 ${
                    msg.side === "right" ? "justify-end" : ""
                  }`}
                >
                  {msg.side === "left" && (
                    <img
                      src={msg.avatar}
                      alt={msg.sender}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <div
                    className={`max-w-[70%] p-3 rounded-2xl ${
                      msg.side === "right"
                        ? "bg-green-100 text-gray-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p className="text-sm font-semibold mb-1">{msg.sender}</p>
                    <p className="text-sm">{msg.text}</p>
                    {msg.images && (
                      <div className="flex gap-3 mt-3">
                        {msg.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt="evidence"
                            className="w-32 h-24 object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  {msg.side === "right" && (
                    <img
                      src={msg.avatar}
                      alt={msg.sender}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="border-t p-4 flex items-center gap-3">
              <input
                type="text"
                placeholder="Type your message to all parties..."
                className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none"
              />
              <button className="bg-green-500 p-2 rounded-full text-white hover:bg-green-600">
                <Send size={18} />
              </button>
            </div>
          </div>

          {/* Right: Dispute Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
            <div>
              <h3 className="text-gray-800 font-semibold">Dispute Details</h3>
              <div className="text-sm text-gray-600 mt-3 space-y-1">
                <p>
                  <span className="font-medium text-gray-800">Order ID:</span>{" "}
                  #123456
                </p>
                <p>
                  <span className="font-medium text-gray-800">Buyer:</span>{" "}
                  Amina Hassan
                </p>
                <p>
                  <span className="font-medium text-gray-800">Seller:</span>{" "}
                  Juma Mwangi
                </p>
                <p>
                  <span className="font-medium text-gray-800">Date Opened:</span>{" "}
                  2024-07-26
                </p>
                <p>
                  <span className="font-medium text-gray-800">Status:</span>{" "}
                  <span className="text-red-500 font-semibold">Open</span>
                </p>
              </div>
            </div>

            {/* Evidence */}
            <div>
              <h4 className="text-gray-800 font-semibold mb-2">
                Evidence Uploaded
              </h4>
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400"
                  alt="evidence1"
                  className="w-20 h-16 object-cover rounded-lg"
                />
                <img
                  src="https://images.unsplash.com/photo-1574226516831-e1dff420e12e?w=400"
                  alt="evidence2"
                  className="w-20 h-16 object-cover rounded-lg"
                />
                <div className="w-12 h-12 border-2 border-dashed rounded-lg flex items-center justify-center text-gray-400 cursor-pointer hover:text-gray-600">
                  <Upload size={20} />
                </div>
              </div>
            </div>

            {/* Admin Actions */}
            <div>
              <h4 className="text-gray-800 font-semibold mb-2">Admin Actions</h4>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-2 bg-red-500 text-white font-medium py-2 rounded-full hover:bg-red-600">
                  <RefreshCcw size={16} />
                  Refund Buyer
                </button>
                <button className="w-full flex items-center justify-center gap-2 bg-green-500 text-white font-medium py-2 rounded-full hover:bg-green-600">
                  <Truck size={16} />
                  Release to Seller
                </button>
                <button className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white font-medium py-2 rounded-full hover:bg-emerald-700">
                  <CheckCircle size={16} />
                  Mark Resolved
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDisputeResolution;
