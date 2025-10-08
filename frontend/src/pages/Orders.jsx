// frontend/src/pages/Orders.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

import Footer from "../components/FooterSection.jsx";

const ORDERS = [
  {
    id: "123456",
    status: "Delivered",
    statusBadge: {
      label: "Delivered",
      bg: "bg-[#DCFCE7]", // green-100 like
      text: "text-[#166534]", // green-800 like
      icon: "check_circle",
    },
    date: "2024-07-15",
    title: "Basket of fresh fruits & vegetables",
    note: "Your basket of fresh fruits and vegetables has been successfully delivered.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDuva8nZOSC9MEllnNvwqdONZx96jhGNsyCDx5RwK037w3Q_VSLwen2y8v3ASowKlEXdOTvmgmfMWzD6x4RaXH1ken8-TUQC9RSgSBXQ1WnNaX2z-xn0_Thx2pAOPHkqIUWuyjZsgsuFRUigHVNlddXkHiHhz2pwOZePYO8rkqxFeoyLUTBOA_qQEjDTq09Lyk8QKXxhq78UUqiKKlryS867k5Mr4HFFYXvc2x8MHygyEnZLlbjn_ifc7mkzWZUFs_UVyzk2Rcyll0",
  },
  {
    id: "789012",
    status: "In Transit",
    statusBadge: {
      label: "In Transit",
      bg: "bg-[#DBEAFE]", // blue-100 like
      text: "text-[#1E3A8A]", // blue-800 like
      icon: "sync",
      spin: true,
    },
    date: "2024-07-17",
    title: "Premium vegetables selection",
    note: "Your selection of premium vegetables is on its way to you.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDd4R6vd2mvOXHTKLg6FakPCrP2UKvejg4t5NO-iv_I4xPbcsoIbh6P4eG91Q6WWxYEHYt-DJPhYSKg_W0Umx4tcqfJmn8y1teSzbPNyi9LSTVx2ACjGohkt2HNllZwqaStvXLNQqWtEDH5HylVA1BEsqyovR8l4mV8Y7recSke-m4lvZsbmmknRlZCUbBbRbdHM62GHD3xoIvx1A1r68ltV1_1XDfwz8nO29tOyLWLS6RTwSoWlK-VvfUeX4D5alnw7raR1PgLp38",
  },
  {
    id: "345678",
    status: "Delivered",
    statusBadge: {
      label: "Delivered",
      bg: "bg-[#DCFCE7]",
      text: "text-[#166534]",
      icon: "check_circle",
    },
    date: "2024-07-10",
    title: "Organic tomatoes & herbs",
    note: "A fresh batch of organic tomatoes and herbs, delivered.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCSCn59GFCO8wL0XgyOSWgCxLkSJqUI8_VX04KGfwnFUPTkyySFaAD5AzzWT_U5eTmAniriwonW3o95MtIAN6XilXtiHQlWYWEdrfEYqeMtQkX7Kjk-_jkgm2iJcP0F1sWdaY1WJPz7CE-MpLeo0c8lWG48xT64DmOThuSyfizj-0oXN1ZoTnyYPpqB7ckPv7QuhegOmtl0jDDRUJIUyhkVIGYUetJrWNWk36gQYXnoZPcWtnKbPOICoL_Riu0-s-ACl7FVUy-r81M",
  },
];

const Orders = () => {
  const navigate = useNavigate();

  const handleViewDetails = (orderId) => {
    // Navigate to an order detail route (create this route if missing)
    navigate(`/order/${orderId}`);
  };

  const handleReorder = (orderId) => {
    // Example: navigate to a reorder flow or product page; here we pass order id as query param
    navigate(`/marketplace?reorder=${orderId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f8f6] dark:bg-[#1a1a1a] text-[#111827] dark:text-[#E5E7EB]">
      {/* Header component uses its own navigation; pass a dynamic cart count if you track it */}
      <Header />

      <main className="flex-grow">
        {/* Hero */}
        <section className="relative bg-[#111827]/6 dark:bg-[#000000]/20 py-20">
          <div className="absolute inset-0 pointer-events-none">
            <img
              alt="Fresh produce background"
              className="w-full h-full object-cover opacity-20"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuva8nZOSC9MEllnNvwqdONZx96jhGNsyCDx5RwK037w3Q_VSLwen2y8v3ASowKlEXdOTvmgmfMWzD6x4RaXH1ken8-TUQC9RSgSBXQ1WnNaX2z-xn0_Thx2pAOPHkqIUWuyjZsgsuFRUigHVNlddXkHiHhz2pwOZePYO8rkqxFeoyLUTBOA_qQEjDTq09Lyk8QKXxhq78UUqiKKlryS867k5Mr4HFFYXvc2x8MHygyEnZLlbjn_ifc7mkzWZUFs_UVyzk2Rcyll0"
              loading="lazy"
            />
          </div>

          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#111827] dark:text-white mb-4">
              Your Orders
            </h1>
            <p className="text-lg text-[#374151] dark:text-[#D1D5DB] max-w-2xl mx-auto">
              Track your fresh produce from the farm to your doorstep. Here you
              can see your past and current orders.
            </p>
          </div>
        </section>

        {/* Orders list */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-16">
          <div className="max-w-5xl mx-auto space-y-8">
            {ORDERS.map((o) => (
              <article
                key={o.id}
                className="bg-white dark:bg-[#242424] rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden"
                aria-labelledby={`order-${o.id}-title`}
              >
                <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-8">
                  {/* Image */}
                  <div
                    className="w-full md:w-48 h-48 md:h-auto md:self-stretch rounded-lg bg-cover bg-center flex-shrink-0"
                    style={{ backgroundImage: `url('${o.image}')` }}
                    role="img"
                    aria-label={o.title}
                  />

                  {/* Content */}
                  <div className="flex-grow space-y-4 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-3">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${o.statusBadge.bg} ${o.statusBadge.text}`}
                      >
                        <span
                          className={`material-symbols-outlined text-base mr-1.5 ${
                            o.statusBadge.spin ? "animate-spin" : ""
                          }`}
                          style={
                            o.statusBadge.spin
                              ? { animationDuration: "3s" }
                              : undefined
                          }
                        >
                          {o.statusBadge.icon}
                        </span>
                        {o.statusBadge.label}
                      </span>

                      <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                        {new Date(o.date).toLocaleDateString(undefined, {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    <h3
                      id={`order-${o.id}-title`}
                      className="text-xl font-bold text-[#111827] dark:text-white"
                    >
                      Order #{o.id}
                    </h3>

                    <p className="text-[#4B5563] dark:text-[#9CA3AF]">
                      {o.note}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start pt-2">
                      {/* Primary action (Reorder or Track) */}
                      <button
                        onClick={() =>
                          o.status === "In Transit"
                            ? handleTrack(navigate)
                            : handleReorder(o.id, navigate)
                        }
                        className="bg-[#42cf17] hover:bg-[#36b90f] text-white font-bold py-2 px-6 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                        aria-label={
                          o.status === "In Transit"
                            ? `Track order ${o.id}`
                            : `Reorder ${o.id}`
                        }
                      >
                        <span className="material-symbols-outlined text-base">
                          {o.status === "In Transit"
                            ? "pin_drop"
                            : "restart_alt"}
                        </span>
                        {o.status === "In Transit"
                          ? "Track Delivery"
                          : "Reorder"}
                      </button>

                      <button
                        onClick={() => handleViewDetails(o.id)}
                        className="bg-[#E5E7EB] dark:bg-[#2f2f2f] hover:bg-[#d1d5db] dark:hover:bg-[#3a3a3a] text-[#111827] dark:text-[#E5E7EB] font-bold py-2 px-6 rounded-lg text-sm transition-colors"
                        aria-label={`View details for order ${o.id}`}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

/**
 * helper navigation handlers (kept outside component body to keep render clean)
 * note: they accept navigate as param so we can call from inline handlers.
 */
function handleViewDetails(id, navigate) {
  // If you have a route like /order/:id, navigate there.
  // The earlier code in the component calls this with a bound navigate param.
  // But our inline calls pass navigate directly (see below).
  if (!navigate) {
    // fallback no-op (shouldn't happen)
    return;
  }
  navigate(`/order/${id}`);
}

function handleReorder(id, navigate) {
  if (!navigate) return;
  // Navigate to marketplace with reorder param so marketplace can prefill cart
  navigate(`/marketplace?reorder=${encodeURIComponent(id)}`);
}

function handleTrack(navigate) {
  if (!navigate) return;
  // Navigate to tracking page — implement this route if you need it
  navigate("/tracking");
}

export default Orders;
