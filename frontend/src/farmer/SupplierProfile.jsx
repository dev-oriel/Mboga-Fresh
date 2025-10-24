import React, { useEffect, useState } from "react";

import Header from "../components/FarmerComponents/Header";
import Footer from "../components/FarmerComponents/Footer";

import { useAuth } from "../context/AuthContext";

// --- Icons + SidebarLink ---
const StoreIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);
const StarIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.534 4.736a1 1 0 00.95.69h4.98c.969 0 1.371 1.24.588 1.81l-4.027 2.927a1 1 0 00-.364 1.118l1.534 4.736c.3.921-.755 1.688-1.54 1.118l-4.027-2.927a1 1 0 00-1.175 0l-4.027 2.927c-.784.57-1.838-.197-1.54-1.118l1.534-4.736a1 1 0 00-.364-1.118L2.98 10.163c-.783-.57-.38-1.81.588-1.81h4.98a1 1 0 00.95-.69L11.049 2.927z" />
  </svg>
);
const LockIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);
const HelpIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.79 4 4 0 1.844-1.192 3.433-2.824 3.949V16H11v-1.001c1.246-.562 2.24-1.848 2.24-3.499 0-1.657-1.343-3-3-3s-3 1.343-3 3c0 .17.01.337.03.5h-2.034a.998.998 0 01-.196-.5zM12 20a1 1 0 100-2 1 1 0 000 2z" />
  </svg>
);
const LogoutIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const SidebarLink = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors font-medium ${
      isActive ? "bg-green-600 text-white" : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
    }`}
  >
    {React.cloneElement(icon, { className: `w-5 h-5 ${isActive ? "text-white" : "text-zinc-500"}` })}
    <span>{label}</span>
  </button>
);

// --- Component ---
export default function SupplierProfile() {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState("store");

  // store info and other states copied from your earlier code
  const initialStore = {
    shopName: "Mama Mboga's Finest",
    location: "Kibera, Nairobi",
    contact: "+254 712 345 678",
    description: "Fresh vegetables and fruits sourced directly from local farmers. Quality you can trust.",
  };

  const [storeInfo, setStoreInfo] = useState(() => {
    try {
      const saved = localStorage.getItem("fh_store_info");
      return saved ? JSON.parse(saved) : initialStore;
    } catch {
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
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    },
    {
      id: 2,
      name: "David Mwangi",
      time: "1 month ago",
      rating: 4,
      text: "Great quality and fast delivery. The spinach was a bit wilted, but overall very satisfied.",
      avatar: "https://images.unsplash.com/photo-1545996124-1b0fb2c7d2a0?auto=format&fit=crop&w=200&q=80",
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
    if (!storeInfo.shopName || !storeInfo.contact) {
      setToast("Shop name and contact are required.");
      return;
    }
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
    setToast("Password updated successfully.");
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    console.log("Password changed (mock):", passwordData);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast("Copied to clipboard");
    } catch {
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
      average: (reviews.reduce((s, r) => s + r.rating, 0) / (reviews.length || 1)).toFixed(1),
      percent: (n) => Math.round(((counts[n] || 0) / total) * 100),
    };
  })();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 text-zinc-900 dark:text-gray-100">
      {/* Header */}
      <Header avatarUrl={user?.avatar} userName={user?.name || "Supplier"} />

      {/* small top-right controls */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end -mt-16 pb-2">
          <div className="flex items-center gap-3">
            <button type="button" aria-label="Notifications" className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700 transition">
              <svg className="w-6 h-6 text-zinc-700 dark:text-zinc-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>

            <button
              onClick={() => setModalImage(user?.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80")}
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm hover:scale-105 transition-transform"
              title="View profile picture"
            >
              <img src={user?.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"} alt={user?.name || "Profile"} className="w-full h-full object-cover" />
            </button>

            <div className="hidden sm:flex flex-col items-start">
              <span className="text-sm font-medium text-zinc-900 dark:text-gray-100">{user?.name || "Vendor"}</span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">Vendor</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-sm">
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <img
                    src={user?.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"}
                    alt="vendor"
                    className="w-24 h-24 rounded-full object-cover"
                    onClick={() => setModalImage(user?.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80")}
                    style={{ cursor: "pointer" }}
                  />
                  <button
                    title="Edit photo"
                    className="absolute bottom-0 right-0 bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:opacity-90"
                    onClick={() => setModalImage(user?.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80")}
                  >
                    ✎
                  </button>
                </div>
                <h2 className="mt-4 font-semibold">{user?.name || "Mama Mboga"}</h2>
                <p className="text-sm text-zinc-500">Vendor</p>
              </div>

              <div className="mt-6 space-y-2">
                <button
                  className={`w-full text-left p-3 rounded-lg font-medium transition-all ${
                    activeSection === "store" ? "bg-green-50 text-green-600" : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                  }`}
                  onClick={() => setActiveSection("store")}
                >
                  🏬 Store Information
                </button>
                <button
                  className={`w-full text-left p-3 rounded-lg font-medium transition-all ${
                    activeSection === "reviews" ? "bg-green-50 text-green-600" : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                  }`}
                  onClick={() => setActiveSection("reviews")}
                >
                  ⭐ Ratings & Reviews
                </button>
                <button
                  className={`w-full text-left p-3 rounded-lg font-medium transition-all ${
                    activeSection === "password" ? "bg-green-50 text-green-600" : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                  }`}
                  onClick={() => setActiveSection("password")}
                >
                  🔒 Change Password
                </button>
                <button
                  className="w-full text-left p-3 mt-4 rounded-lg font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                  onClick={() => setActiveSection("help")}
                >
                  ❓ Help & Support
                </button>

                <button
                  onClick={() => logout?.()}
                  className="w-full text-left p-3 mt-4 rounded-lg font-medium bg-red-600 text-white hover:opacity-90"
                >
                  ⏻ Logout
                </button>
              </div>
            </div>
          </aside>

          {/* Content */}
          <section className="lg:col-span-9 space-y-6">
            {/* Store */}
            {activeSection === "store" && (
              <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Store Information</h3>
                <form onSubmit={handleStoreSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-1">Shop Name</label>
                      <input id="shopName" value={storeInfo.shopName} onChange={handleStoreChange} className="w-full px-3 py-2 border rounded-md bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700" />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Location</label>
                      <input id="location" value={storeInfo.location} onChange={handleStoreChange} className="w-full px-3 py-2 border rounded-md bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-1">Contact</label>
                    <div className="flex gap-2 items-center">
                      <input id="contact" value={storeInfo.contact} onChange={handleStoreChange} className="w-full px-3 py-2 border rounded-md bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700" />
                      <button type="button" className="px-3 py-2 bg-green-600 text-white rounded-md" onClick={() => copyToClipboard(storeInfo.contact)}>
                        Copy
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-1">Description</label>
                    <textarea id="description" rows={4} value={storeInfo.description} onChange={handleStoreChange} className="w-full px-3 py-2 border rounded-md bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700" />
                  </div>

                  <div className="flex justify-end">
                    <button className="px-4 py-2 bg-green-600 text-white rounded-md" type="submit">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Ratings */}
            {activeSection === "reviews" && (
              <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Ratings & Reviews</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="md:col-span-1 text-center">
                    <div className="text-4xl font-bold">{ratingStats.average}</div>
                    <div className="flex justify-center mt-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 .587l3.668 7.431L24 9.748l-6 5.847L19.335 24 12 19.897 4.665 24 6 15.595 0 9.748l8.332-1.73z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-sm text-zinc-500 mt-2">{reviews.length} reviews</p>
                  </div>

                  <div className="md:col-span-2">
                    {([5, 4, 3, 2, 1] || []).map((n) => (
                      <div key={n} className="flex items-center gap-3 mb-2">
                        <div className="w-6 text-sm">{n}</div>
                        <div className="flex-1 bg-zinc-200 dark:bg-zinc-700 rounded-full h-2 overflow-hidden">
                          <div className="h-2 bg-green-600 rounded-full" style={{ width: `${ratingStats.percent(n)}%` }} />
                        </div>
                        <div className="w-12 text-sm text-right text-zinc-500">{ratingStats.percent(n)}%</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  {reviews.map((r) => (
                    <div key={r.id} className="border-t pt-4">
                      <div className="flex items-start gap-4">
                        <img src={r.avatar} alt={r.name} className="w-10 h-10 rounded-full object-cover" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold">{r.name}</div>
                              <div className="text-xs text-zinc-500">{r.time}</div>
                            </div>
                            <div className="flex text-green-600">{Array.from({ length: r.rating }).map((_, i) => (
                              <svg key={i} className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .587l3.668 7.431L24 9.748l-6 5.847L19.335 24 12 19.897 4.665 24 6 15.595 0 9.748l8.332-1.73z" /></svg>
                            ))}</div>
                          </div>
                          <p className="mt-2 text-zinc-700 dark:text-zinc-300">{r.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Password */}
            {activeSection === "password" && (
              <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-xl">
                  <div>
                    <label className="block text-sm mb-1">Current Password</label>
                    <input id="currentPassword" type="password" value={passwordData.currentPassword} onChange={handlePasswordChange} className="w-full px-3 py-2 border rounded-md bg-white dark:bg-zinc-900" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">New Password</label>
                    <input id="newPassword" type="password" value={passwordData.newPassword} onChange={handlePasswordChange} className="w-full px-3 py-2 border rounded-md bg-white dark:bg-zinc-900" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Confirm New Password</label>
                    <input id="confirmPassword" type="password" value={passwordData.confirmPassword} onChange={handlePasswordChange} className="w-full px-3 py-2 border rounded-md bg-white dark:bg-zinc-900" />
                  </div>

                  <div className="flex justify-end">
                    <button className="px-4 py-2 bg-green-600 text-white rounded-md" type="submit">Update Password</button>
                  </div>
                </form>
              </div>
            )}

            {/* Help */}
            {activeSection === "help" && (
              <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Help & Support</h3>
                <p className="text-zinc-700 dark:text-zinc-300 mb-4">For support, email <strong>support@mbogafresh.example</strong> or call <strong>+254 712 345 678</strong>.</p>
                <details className="bg-zinc-100 dark:bg-zinc-700 p-4 rounded-md">
                  <summary className="cursor-pointer font-medium">How do I update my store info?</summary>
                  <p className="mt-2">Edit the fields on the Store Information tab and click Save Changes.</p>
                </details>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />

      {/* modal image */}
      {modalImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setModalImage(null)}>
          <img src={modalImage} alt="enlarged" className="max-h-[80vh] rounded-md shadow-lg" />
        </div>
      )}

      {/* toast */}
      {toast && (
        <div className="fixed right-4 bottom-6 bg-zinc-900 text-white px-4 py-2 rounded-md shadow-md">
          {toast}
        </div>
      )}
    </div>
  );
}
