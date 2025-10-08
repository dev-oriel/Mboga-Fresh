// frontend/src/pages/Help.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

import Footer from "../components/FooterSection.jsx";

/**
 * Help page (Help Center)
 * - Accordion with keyboard accessibility
 * - Search box filters FAQ client-side
 * - Uses explicit hex colors rather than custom theme tokens
 */

const FAQS = [
  {
    q: "How do I place an order?",
    a: "To place an order, simply browse our marketplace, add the desired produce to your cart, and proceed to checkout. You will be prompted to enter your delivery details and payment information. Our platform uses a secure escrow system to ensure a trusted transaction.",
  },
  {
    q: "What are the payment options?",
    a: "We accept various payment methods, including mobile money (M-Pesa), credit/debit cards, and bank transfers. All payments are securely processed and held in escrow until your order is confirmed as delivered.",
  },
  {
    q: "How can I track my delivery?",
    a: "Once your order is dispatched, you can track its progress in real-time from the 'Orders' section of your account. You will receive notifications at each stage of the delivery process, from the farm to your doorstep.",
  },
  {
    q: "What is your return policy?",
    a: "We are committed to providing the freshest produce. If you are not satisfied with the quality of your order, please contact our support team within 24 hours of delivery. We will investigate the issue and may offer a replacement or refund, depending on the circumstances.",
  },
];

const COLORS = {
  primary: "#4CAF50",
  coral: "#FF7F50",
  beige: "#F5F5DC",
  darkText: "#333333",
  lightText: "#666666",
};

const Help = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [openIndex, setOpenIndex] = useState(null);

  const filteredFaqs = useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    if (!q) return FAQS;
    return FAQS.filter(
      (f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)
    );
  }, [query]);

  const toggleIndex = (i) => {
    setOpenIndex((prev) => (prev === i ? null : i));
  };

  const onKeyHeader = (e, i) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleIndex(i);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = (i + 1) % filteredFaqs.length;
      const el = document.querySelector(`#faq-button-${next}`);
      el?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = (i - 1 + filteredFaqs.length) % filteredFaqs.length;
      const el = document.querySelector(`#faq-button-${prev}`);
      el?.focus();
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: COLORS.beige, color: COLORS.darkText }}
    >
      <Header />

      <main className="flex-grow">
        {/* Hero / Search */}
        <section
          className="bg-white py-16 sm:py-24"
          aria-labelledby="help-hero-title"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1
              id="help-hero-title"
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: COLORS.darkText }}
            >
              How can we help?
            </h1>
            <p
              className="text-lg max-w-2xl mx-auto mb-8"
              style={{ color: COLORS.lightText }}
            >
              Find answers to your questions, or get in touch with our support
              team.
            </p>

            <div className="max-w-xl mx-auto">
              <div className="relative">
                <label htmlFor="help-search" className="sr-only">
                  Search help articles
                </label>
                <input
                  id="help-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for answers..."
                  className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-gray-200 focus:ring-2 transition-colors"
                  style={{
                    borderColor: "#e5e7eb",
                    outlineColor: COLORS.primary,
                    color: COLORS.darkText,
                    backgroundColor: "#ffffff",
                  }}
                />
                <span
                  className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-lg"
                  style={{ color: COLORS.lightText }}
                >
                  search
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <h2
              className="text-2xl font-bold mb-8 text-center"
              style={{ color: COLORS.darkText }}
            >
              Frequently Asked Questions
            </h2>

            <div className="space-y-4" id="faq-accordion">
              {filteredFaqs.length === 0 && (
                <p
                  className="text-center text-sm"
                  style={{ color: COLORS.lightText }}
                >
                  No results for &quot;{query}&quot;.
                </p>
              )}

              {filteredFaqs.map((f, i) => {
                const isOpen = openIndex === i;
                return (
                  <div
                    key={f.q}
                    className={`accordion-item bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden`}
                    style={{ borderRadius: 12 }}
                  >
                    <div className="w-full">
                      <button
                        id={`faq-button-${i}`}
                        aria-expanded={isOpen}
                        aria-controls={`faq-panel-${i}`}
                        onClick={() => toggleIndex(i)}
                        onKeyDown={(e) => onKeyHeader(e, i)}
                        className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                        style={{ cursor: "pointer" }}
                      >
                        <span
                          className="font-semibold text-lg"
                          style={{ color: COLORS.darkText }}
                        >
                          {f.q}
                        </span>

                        <span className="flex items-center gap-2">
                          <span
                            className="material-symbols-outlined icon-plus"
                            style={{
                              color: COLORS.coral,
                              display: isOpen ? "none" : "inline-block",
                            }}
                            aria-hidden="true"
                          >
                            add_circle
                          </span>
                          <span
                            className="material-symbols-outlined icon-minus"
                            style={{
                              color: COLORS.coral,
                              display: isOpen ? "inline-block" : "none",
                            }}
                            aria-hidden="true"
                          >
                            remove_circle
                          </span>
                        </span>
                      </button>

                      <div
                        id={`faq-panel-${i}`}
                        role="region"
                        aria-labelledby={`faq-button-${i}`}
                        className={`px-6 pb-6 transition-[max-height,opacity] duration-300 ease-in-out`}
                        style={{
                          maxHeight: isOpen ? 400 : 0,
                          opacity: isOpen ? 1 : 0,
                        }}
                      >
                        <p style={{ color: COLORS.lightText }}>{f.a}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <div className="mt-16 text-center">
              <h3
                className="text-2xl font-bold mb-4"
                style={{ color: COLORS.darkText }}
              >
                Still need help?
              </h3>
              <p className="text-sm mb-8" style={{ color: COLORS.lightText }}>
                Our support team is here for you.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <button
                  onClick={() => navigate("/contact")}
                  className="bg-[#4CAF50] hover:opacity-95 text-white font-bold py-4 px-8 rounded-lg transition-colors flex items-center justify-center gap-3 text-lg"
                  aria-label="Chat with us"
                >
                  <span className="material-symbols-outlined">chat</span>
                  Chat with us
                </button>

                <a
                  className="bg-[#FF7F50] hover:opacity-95 text-white font-bold py-4 px-8 rounded-lg transition-colors flex items-center justify-center gap-3 text-lg"
                  href="mailto:support@mbogafresh.example"
                  aria-label="Send us an email"
                >
                  <span className="material-symbols-outlined">email</span>
                  Send us an email
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Help;
