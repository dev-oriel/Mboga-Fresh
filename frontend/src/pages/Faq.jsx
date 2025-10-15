import React, { useState } from "react";
import Header from "../components/Header";
import FooterSection from "../components/FooterSection";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I place an order on Mboga Fresh?",
      answer: "Browse our marketplace, add items to your cart, and proceed to checkout. You can pay via M-Pesa or cash on delivery. Once confirmed, your order will be prepared and delivered to your location."
    },
    {
      question: "What areas do you deliver to?",
      answer: "We currently deliver across Nairobi and surrounding areas. During checkout, enter your location to see if we deliver to your area. We're constantly expanding our delivery zones."
    },
    {
      question: "How fresh is the produce?",
      answer: "All our produce is sourced directly from local farmers and vendors. We ensure same-day or next-day delivery to guarantee maximum freshness. Each vendor is verified and maintains quality standards."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept M-Pesa, cash on delivery, and major credit/debit cards. All transactions are secure and encrypted for your protection."
    },
    {
      question: "Can I cancel or modify my order?",
      answer: "Yes! You can cancel or modify your order within 30 minutes of placing it. Go to 'My Orders', select your order, and choose the cancel or modify option. After 30 minutes, please contact our support team."
    },
    {
      question: "How do I become a vendor on Mboga Fresh?",
      answer: "Click on 'Sign Up' and select 'Vendor'. Fill in your business details, upload required documents, and our team will verify your application within 48 hours. Once approved, you can start listing your products."
    },
    {
      question: "What if I receive damaged or incorrect items?",
      answer: "We have a quality guarantee! If you receive damaged or incorrect items, contact us immediately through the app or call our support line. We'll arrange for a replacement or full refund within 24 hours."
    },
    {
      question: "How long does delivery take?",
      answer: "Standard delivery takes 2-4 hours within Nairobi. Express delivery (available for select areas) takes 1-2 hours. You'll receive real-time tracking updates once your order is dispatched."
    },
    {
      question: "Do you have a minimum order amount?",
      answer: "Our minimum order amount is KES 200. This helps us maintain quality service and ensure efficient delivery operations."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order is confirmed, you'll receive a tracking link via SMS and in the app. You can view real-time updates on your order status and rider location in the 'My Orders' section."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h1>
              <p className="text-lg text-gray-600">
                Find answers to common questions about Mboga Fresh
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                    <svg
                      className={`w-5 h-5 text-emerald-600 transition-transform flex-shrink-0 ${
                        openIndex === index ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    } overflow-hidden`}
                  >
                    <div className="px-6 pb-4 text-gray-600 leading-relaxed">{faq.answer}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-emerald-50 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Still have questions?</h2>
              <p className="text-gray-600 mb-6">Our support team is here to help you</p>
              <button
                onClick={() => window.location.href = '/contact'}
                className="bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-emerald-700 transition-colors"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </main>

      <FooterSection />
    </div>
  );
};

export default FAQ;
