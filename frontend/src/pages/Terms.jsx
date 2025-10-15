import React from "react";
import Header from "../components/Header";
import FooterSection from "../components/FooterSection";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-8 md:p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Terms of Service
            </h1>
            <p className="text-gray-600 mb-8">
              Last updated: October 15, 2025
            </p>

            <div className="prose prose-emerald max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  1. Acceptance of Terms
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  By accessing and using Mboga Fresh's platform, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. We reserve the right to modify these terms at any time, and your continued use of the platform constitutes acceptance of any changes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  2. User Accounts
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  To use certain features of Mboga Fresh, you must create an account. You agree to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Provide accurate, current, and complete information during registration</li>
                  <li>Maintain the security of your password and account</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                  <li>Accept responsibility for all activities that occur under your account</li>
                  <li>Not create multiple accounts or share your account with others</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  3. Use of Services
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Mboga Fresh provides a digital marketplace connecting buyers with vendors and farmers for fresh produce. You agree to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Use our services only for lawful purposes</li>
                  <li>Not engage in any fraudulent or deceptive activities</li>
                  <li>Not interfere with the proper functioning of the platform</li>
                  <li>Respect the intellectual property rights of Mboga Fresh and other users</li>
                  <li>Comply with all applicable local, national, and international laws</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  4. Orders and Payments
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  When placing an order through Mboga Fresh:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>All prices are in Kenyan Shillings (KES) and include applicable taxes</li>
                  <li>Payment must be made at the time of order placement or delivery, as specified</li>
                  <li>We accept M-Pesa, cash on delivery, and credit/debit cards</li>
                  <li>Orders can be cancelled within 30 minutes of placement</li>
                  <li>You are responsible for ensuring delivery address accuracy</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  5. Vendor Responsibilities
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Vendors and farmers using our platform agree to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Provide accurate descriptions and images of their products</li>
                  <li>Maintain high quality standards for all produce listed</li>
                  <li>Fulfill orders promptly and as described</li>
                  <li>Comply with all food safety regulations and standards</li>
                  <li>Respond to customer inquiries and concerns in a timely manner</li>
                  <li>Pay applicable fees and commissions as per our vendor agreement</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  6. Delivery and Returns
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We strive to deliver fresh produce within the specified timeframe. In case of damaged or incorrect items, customers must report issues within 24 hours of delivery. Refunds or replacements will be processed according to our return policy. Perishable items cannot be returned once delivered unless they are damaged or do not meet quality standards.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  7. Limitation of Liability
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Mboga Fresh acts as a platform connecting buyers and sellers. While we verify vendors and maintain quality standards, we are not liable for issues arising from product quality, delivery delays caused by circumstances beyond our control, or disputes between buyers and vendors. Our total liability is limited to the amount paid for the specific transaction in question.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  8. Intellectual Property
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  All content on the Mboga Fresh platform, including logos, text, graphics, and software, is the property of Mboga Fresh or its licensors. You may not use, reproduce, or distribute any content without our express written permission. User-generated content remains the property of the respective users, who grant us a license to use it on our platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  9. Termination
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to suspend or terminate your account at any time for violations of these Terms of Service, fraudulent activity, or any behavior that we deem harmful to the platform or other users. Upon termination, your right to use the services will immediately cease.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  10. Governing Law
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  These Terms of Service are governed by the laws of the Republic of Kenya. Any disputes arising from these terms will be resolved in the courts of Kenya. By using our services, you consent to the jurisdiction of Kenyan courts.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  11. Contact Information
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <div className="mt-4 bg-emerald-50 border border-emerald-200 p-4 rounded-lg">
                  <p className="text-gray-700">Email: <a href="mailto:legal@mbogafresh.co.ke" className="text-emerald-600 hover:underline">legal@mbogafresh.co.ke</a></p>
                  <p className="text-gray-700">Phone: <a href="tel:+254700123456" className="text-emerald-600 hover:underline">+254 700 123 456</a></p>
                  <p className="text-gray-700">Address: Karen Road, Nairobi, Kenya</p>
                </div>
              </section>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200 text-center">
              <p className="text-gray-600">
                By continuing to use Mboga Fresh, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </main>

      <FooterSection />
    </div>
  );
};

export default Terms;
