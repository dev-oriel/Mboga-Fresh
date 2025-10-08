// File: src/pages/Marketplace.jsx
import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import CategoryCard from "../components/CategoryCard";
import VendorCard from "../components/VendorCard";
import ProductCard from "../components/ProductCard";
import SearchInput from "../components/SearchInput";
import Footer from "../components/FooterSection.jsx";

const categories = [
  {
    name: "Vegetables",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAMrKOlhg_mlTPfXU1ILPJnQCBu5e_zz2eyPIwsEgNVaSx0jNXboTb2FK1T6BnutRgK_JaoJCwVjN9OlIl0rcsZzCAAbBrmdLVoEGcNTQjcLJxuDXYBoIAIRHiZku_JmlTbeD_pua7BBrVCvhWB7UWGwxa_BdSuyOFghkE345UzpJRp3SFby56BsqLcL_bQYpalUX9OlZis675NNmsm2Id9Ex3_5q1jZ0-lb9pMBypcbzilDI2EJysYwBcHgfJ64cgi0gF72AjzPJA",
  },
  {
    name: "Fruits",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC6aakDyqKofqUq6UorrT6_6k6pAoofUUKJ6RoMszqEunN_Cx5lI4puTxGwQnzWMPxUk7PzSCheIgqWqahnvyVEB47hYG0adVb5uiEbuHU3JZY7lyqtStcvjoqmdo4DRqrpJFtY7ZN_TQ8QV-VoGo58mirugLYrtf_-6uivlqnG7962pnZrxq6P5GS_4-MhKBANtkW8w9bL3PXGO1Wibg0rhwRJWkdarWqXYpS0rBJ0xrvHuJe3cK2epGQaPhsZWtmhjM0gJ1RS7Wk",
  },
  {
    name: "Grains",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAVUiGBaKpjFcMbI0OVtvZYVBTzBGEBCMSOhlUlttXebAwcjJnAQGR8c4MACzaWyCs2Dckkc7hNgazsQxPnGZenVpuwvxTHxsRhwzp0iAxVcnFm_dnn4-laECkXHMcOU5pA7qB2z7kmZoxXNWpRSVG-d2YYWWkEWVRLDelYZBaqynhQKswOxcacGrcex5ilPJ15pWxVClBLDlp5T8qwmQX7vGkKvrm8iQa6TfBkIAXh6QsMq_NtKOnVcJQbbGne-kZW5CZlV3h6bdw",
  },
  {
    name: "Dairy",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDrsKCqnp8K2Zvoo_EDaGsLLh08TxgBTjMXCksRtr1WyD7w1Af7cSj4tghyQVMZbIcSp-3h-9U9L01PiYBwaI3ch6_v6MSryR1SyCtQ4MS7548Ao_6BRRWNL_zRthBlKLL5QRy7FWoZmUhcrsg3YO8Q-HOViFf0LcvP8NOuTISDwSMBkeZQ0rzmXCDzgwK6S_-N145OSFkqemtyEHDQJ4IMWIWKvi-73CgW03sxFhSC55RLPiO2b-hJTAGmids8eKcpZf-uiS8CW1o",
  },
  {
    name: "Herbs",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDj24WxO9zScxN0NgLD1n17Lf7W923tNxRAm55Q2bh8DC6m8YIQtyg2xYHWb3w-ZKXMY8V9Ne-pGxC1JhOUs56pACCcD1Cfc0uaZEuCG24fxOSiqTK6oUprXnM3gXj44G45R4-Rg0EUMU-TPfjG8UDTfBvGSZxCIMJp4p9wibjMMiZIAIY1s25u55TQFEgpBV7va-lL3q-uXWKySHd3cOLctQvor19-eRGr16QI3FR9wReoBzomWOYpU8g7ZvgwUwocTs56nr3ujgA",
  },
];

const vendors = ["Mama Rose", "Farmer John", "Auntie Agnes", "Uncle David"];

const products = [
  {
    title: "Fresh Tomatoes",
    vendor: "Mama Rose",
    price: "$5.00/kg",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBV8gBbKDa7cnMo9Dd_h-fyu4f1jiSE04nHoEkLNmImaNTqW_itR65qLuIFDIy4loHjhJGzzmb0dRdiodmUR4SR4tObd-gXkt64n3DsrJoy1DjfS74qMY9Tfg0xfB_d8-9Nq8CQqOVLD7FqjVurOP6UI1rZCj-Qe6GCrmx87UmvQdPA6VXx_Zmhn2zxzE_Nhi0FgYDA-CnO7ZXYrbubdEE72AIpZh9pqmyWoPqkUeFvjSsWV3Sp5NDBK2wLd_VXxHmMemnOdC3EKcU",
  },
  {
    title: "Ripe Bananas",
    vendor: "Farmer John",
    price: "$3.00/bunch",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuATQit1JrF5Jnyt4wkvgo4gg9AE35WZUHYu4bkP8Ug9C24i6Hq1pNoyB6sLrOU8lTrlw08oS_T1yAyCSoFN6GBDhXyWuTyePSown1zYI1IdMrIa_s7q3R85HYOD-V4TQtSPgpFWQ4LJFw-8rwhCMVpOnTZuUJWySzBEnWCg6X2TJG7zO-c5S8NdyRVip8br5YvWYZb3AkCpH2K7OdAX80AZ36gBsL552hxuZRtmFY-68iwn-ESSyvtSyqLf1RcvFa55S4lzOUzCDRM",
  },
  {
    title: "Local Maize",
    vendor: "Auntie Agnes",
    price: "$7.00/bag",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCE2vx0omfIVX_cxMw3zT-Hocpu96iI4Gg3YTPbjpWBwpR9VPY9bl3mSAIv46Z1CGFL9geypRsb9U6KLa4qBnHnOkhQjzNVAuzxa6i2th8D2mvIxvAZpt7EuWfA_ZfI3H0HBzb9ljHYCXk5-morYzFkjCdsWkWQUYPWcN-9LM-cUkgeqQyBdaa1LOOC7PmqVdXdsuyfrRkIHrx_Lt6vR4HXtY3M5RptiygBw5sK6p6F42NKZK5j1wZPo5yTYqy_1L1KfQ4-OP8BTz0",
  },
  {
    title: "Cow Milk",
    vendor: "Uncle David",
    price: "$2.50/L",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-4kZZF-70sStKShTAUuldwKdpu0w5V9vvTbxPLXAOgzJS9T506opmPQMB4NHK2HVsZJXpTsvQBkVGzuTPZrVeoj1PWuyzkRW0-o2z9rmZEWcv8AJAIaqrmb_K66TNu5vZhxg1oBSMyMglb_1Fsh-1C3n97R7YNDP6IbWtLVW5X7a5rzVFn9ioTP2SvQ4E_KXxJFFLg-yDlEWCtH3UfodK9i7qf0zYoHkXj-UYYcaG1r7h7Hfee2lmo4I1wPETSp1lX7TTUkpiw5c",
  },
];

const Marketplace = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f6f8f6] dark:bg-[#152111] text-[#111827] dark:text-[#E5E7EB] font-sans">
      <style>{`.kenyan-basket-texture{background-image:linear-gradient(rgba(246,248,246,0.95),rgba(246,248,246,0.95)),url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")}.dark .kenyan-basket-texture{background-image:linear-gradient(rgba(21,33,17,0.95),rgba(21,33,17,0.95)),url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")}`}</style>

      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-3">
            <Sidebar categories={categories} />
          </aside>

          <section className="lg:col-span-9">
            <div className="space-y-12">
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-[#111827] dark:text-white">
                    Categories
                  </h2>
                  <SearchInput />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-4">
                  {categories.map((c) => (
                    <CategoryCard key={c.name} {...c} />
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#111827] dark:text-white mb-4">
                  Featured Vendors
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {vendors.map((v) => (
                    <VendorCard key={v} name={v} />
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-[#111827] dark:text-white">
                    Shop Fresh Produce
                  </h2>
                  <a
                    className="text-sm font-medium text-[#42cf17] hover:underline"
                    href="#"
                  >
                    View All
                  </a>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((p) => (
                    <ProductCard key={p.title} {...p} />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer className="border-t-2 border-gray-500" />
    </div>
  );
};

export default Marketplace;
