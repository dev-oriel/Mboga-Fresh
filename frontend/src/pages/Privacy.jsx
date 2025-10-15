import React from "react";
import Header from "../components/Header";
import FooterSection from "../components/FooterSection";

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 md:p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-gray-600 mb-8">Last updated: October 15, 2025</p>

            <div className="prose prose-emerald max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information Collection</h2>
                <p className="text-gray-700 leading-relaxed">
                  We collect information you provide during registration, orders, and support inquiries. This includes personal information like name, email, phone, and delivery address.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Use of Information</h2>
                <p className="text-gray-700 leading-relaxed">
                  Your information is used to process orders, improve services, provide support, and communicate important updates. We do not sell your personal information to third parties.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Cookies & Tracking</h2>
                <p className="text-gray-700 leading-relaxed">
                  Our website may use cookies and similar tracking technologies to enhance user experience, analyze traffic, and provide personalized content.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Sharing</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may share your information with trusted service providers for delivery, payment processing, and analytics. All providers comply with strict data protection rules.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Security</h2>
                <p className="text-gray-700 leading-relaxed">
                  We implement industry-standard measures to protect your personal data. However, no method of transmission over the Internet is 100% secure.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights</h2>
                <p className="text-gray-700 leading-relaxed">
                  You can access, update, or delete your personal information at any time by contacting us. You may also opt-out of promotional communications.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Changes to this Policy</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may update this Privacy Policy periodically. Continued use of our services constitutes acceptance of any changes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contact Us</h2>
                <p className="text-gray-700 leading-relaxed">
                  For questions or concerns about privacy, contact us at:
                </p>
                <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">Email: privacy@mbogafresh.co.ke</p>
                  <p className="text-gray-700">Phone: +254 700 123 456</p>
                  <p className="text-gray-700">Address: Karen Road, Nairobi, Kenya</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <FooterSection />
    </div>
  );
};

export default Privacy;
