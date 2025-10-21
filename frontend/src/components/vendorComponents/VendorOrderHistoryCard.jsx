// frontend/src/components/vendorComponents/VendorOrderHistoryCard.jsx
import React, { useState } from "react";

const VendorOrderHistoryCard = () => {
  const [openRow, setOpenRow] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const rows = [
    {
      id: "#MBF-1024",
      date: "12 Aug 2023",
      customer: "Aisha Hassan",
      total: "Ksh 1,250.00",
      status: "Delivered",
      badge: "green",
      details: [
        { item: "Organic Spinach", qty: 2, price: "Ksh 100" },
        { item: "Ripe Mangoes", qty: 3, price: "Ksh 750" },
        { item: "Delivery Fee", qty: 1, price: "Ksh 400" },
      ],
    },
    {
      id: "#MBF-1023",
      date: "10 Aug 2023",
      customer: "David Mwangi",
      total: "Ksh 950.00",
      status: "Processing",
      badge: "yellow",
      details: [
        { item: "Kale (Sukuma Wiki)", qty: 4, price: "Ksh 200" },
        { item: "Avocados", qty: 5, price: "Ksh 750" },
      ],
    },
    {
      id: "#MBF-1022",
      date: "08 Aug 2023",
      customer: "Grace Kamau",
      total: "Ksh 1,500.00",
      status: "Shipped",
      badge: "blue",
      details: [
        { item: "Tomatoes", qty: 5, price: "Ksh 500" },
        { item: "Onions", qty: 5, price: "Ksh 300" },
        { item: "Garlic", qty: 2, price: "Ksh 200" },
        { item: "Delivery Fee", qty: 1, price: "Ksh 500" },
      ],
    },
    {
      id: "#MBF-1019",
      date: "05 Aug 2023",
      customer: "John Ochieng",
      total: "Ksh 800.00",
      status: "Delivered",
      badge: "green",
      details: [
        { item: "Cabbage", qty: 2, price: "Ksh 300" },
        { item: "Potatoes", qty: 3, price: "Ksh 500" },
      ],
    },
  ];

  const badgeClass = (b) =>
    b === "green"
      ? "bg-green-100 text-green-700"
      : b === "yellow"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-blue-100 text-blue-700";

  const toggleDetails = (id) => {
    setOpenRow(openRow === id ? null : id);
  };

  const visibleRows = showAll ? rows : rows.slice(0, 2);

  return (
    <div className="bg-white rounded-xl shadow-md p-6" id="order-history">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Order History</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="p-4 font-semibold text-gray-700">Order ID</th>
              <th className="p-4 font-semibold text-gray-700">Date</th>
              <th className="p-4 font-semibold text-gray-700">Customer</th>
              <th className="p-4 font-semibold text-gray-700">Total</th>
              <th className="p-4 font-semibold text-gray-700">Status</th>
              <th className="p-4 font-semibold text-gray-700 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {visibleRows.map((r) => (
              <React.Fragment key={r.id}>
                <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-gray-800">{r.id}</td>
                  <td className="p-4 text-gray-600">{r.date}</td>
                  <td className="p-4 text-gray-800">{r.customer}</td>
                  <td className="p-4 text-gray-800 font-medium">{r.total}</td>
                  <td className="p-4">
                    <span
                      className={`${badgeClass(
                        r.badge
                      )} text-xs font-semibold px-2.5 py-0.5 rounded-full`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => toggleDetails(r.id)}
                      className="font-medium text-emerald-600 hover:underline"
                    >
                      {openRow === r.id ? "Hide Details" : "View Details"}
                    </button>
                  </td>
                </tr>

                {openRow === r.id && (
                  <tr>
                    <td colSpan="6" className="p-4 bg-gray-50 rounded-b-lg">
                      <div className="border border-gray-200 rounded-lg p-4 space-y-3 transition-all duration-300">
                        <h4 className="font-semibold text-gray-800 mb-2">
                          Order Summary
                        </h4>
                        <ul className="space-y-1">
                          {r.details.map((item, idx) => (
                            <li
                              key={idx}
                              className="flex justify-between text-sm text-gray-700"
                            >
                              <span>
                                {item.item} × {item.qty}
                              </span>
                              <span className="font-medium">{item.price}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="pt-2 border-t border-gray-200 mt-3 text-sm text-gray-600">
                          <p>
                            <span className="font-medium text-gray-800">
                              Delivery Address:
                            </span>{" "}
                            123 Ngong Road, Nairobi, Kenya
                          </p>
                          <p>
                            <span className="font-medium text-gray-800">
                              Payment Method:
                            </span>{" "}
                            M-Pesa
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={() => setShowAll(!showAll)}
          className="font-semibold text-emerald-600 hover:underline transition-colors"
        >
          {showAll ? "Hide Orders" : "View All Orders"}
        </button>
      </div>
    </div>
  );
};

export default VendorOrderHistoryCard;