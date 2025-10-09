import React from "react";

const OrderHistoryCard = () => {
  const rows = [
    {
      id: "#MBF-1024",
      date: "12 Aug 2023",
      total: "Ksh 1,250.00",
      status: "Delivered",
      badge: "green",
    },
    {
      id: "#MBF-1023",
      date: "10 Aug 2023",
      total: "Ksh 950.00",
      status: "Processing",
      badge: "yellow",
    },
    {
      id: "#MBF-1022",
      date: "08 Aug 2023",
      total: "Ksh 1,500.00",
      status: "Shipped",
      badge: "blue",
    },
    {
      id: "#MBF-1019",
      date: "05 Aug 2023",
      total: "Ksh 800.00",
      status: "Delivered",
      badge: "green",
    },
  ];

  const badgeClass = (b) =>
    b === "green"
      ? "bg-green-200 text-green-800"
      : b === "yellow"
      ? "bg-yellow-200 text-yellow-800"
      : "bg-blue-200 text-blue-800";

  return (
    <div className="bg-white rounded-xl shadow-md p-6" id="order-history">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Order History</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-4 font-semibold">Order ID</th>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold">Total</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold"></th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b">
                <td className="p-4">{r.id}</td>
                <td className="p-4">{r.date}</td>
                <td className="p-4">{r.total}</td>
                <td className="p-4">
                  <span
                    className={`${badgeClass(
                      r.badge
                    )} text-xs font-semibold px-2.5 py-0.5 rounded-full`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="p-4">
                  <a
                    className="font-medium text-emerald-600 hover:underline"
                    href="#"
                  >
                    View Details
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-center">
        <a className="font-semibold text-emerald-600 hover:underline" href="#">
          View All Orders
        </a>
      </div>
    </div>
  );
};

export default OrderHistoryCard;
