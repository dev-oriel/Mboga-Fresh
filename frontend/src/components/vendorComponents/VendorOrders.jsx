// frontend/src/components/vendorComponents/VendorOrders.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * VendorOrders (Read-only)
 *
 * Shows a vendor's incoming orders (from farmers) — history + current orders.
 * This component is read-only: no buttons that change order status.
 * Only action available: View (navigates to a read-only order detail page).
 *
 * Replace mock data with API data when ready.
 */

const ORDERS_FROM_FARMERS = [
  {
    id: "IN-2001",
    status: "Delivered",
    date: "2024-09-22",
    farmer: "Green Valley Farms",
    items: [
      { name: "Kales (sacks)", qty: 10 },
      { name: "Tomatoes (crates)", qty: 4 },
    ],
    total: 4200,
    notes: "Delivered early morning, checked and accepted.",
  },
  {
    id: "IN-2002",
    status: "In Transit",
    date: "2024-10-02",
    farmer: "Tropical Fruits Co.",
    items: [{ name: "Mangoes (baskets)", qty: 25 }],
    total: 3750,
    notes: "Dispatched by farmer, ETA 2024-10-04",
  },
  {
    id: "IN-2003",
    status: "Pending",
    date: "2024-10-05",
    farmer: "Highland Potatoes Ltd",
    items: [{ name: "Potatoes (sacks)", qty: 20 }],
    total: 7000,
    notes: "Awaiting pickup by transporter.",
  },
  {
    id: "IN-2004",
    status: "Cancelled",
    date: "2024-08-28",
    farmer: "Smallholder Herbs",
    items: [{ name: "Basil (kg)", qty: 12 }],
    total: 600,
    notes: "Farmer cancelled due to crop issue.",
  },
];

const statusStyles = {
  Delivered: "bg-green-50 text-green-700",
  "In Transit": "bg-blue-50 text-blue-700",
  Pending: "bg-yellow-50 text-yellow-700",
  Cancelled: "bg-gray-100 text-gray-700",
  Default: "bg-gray-100 text-gray-700",
};

const VendorOrders = () => {
  const navigate = useNavigate();

  const viewDetails = (id) => {
    // Navigate to a vendor read-only incoming order detail page. Adjust route as needed.
    navigate(`/vendordashboard?incomingOrder=${encodeURIComponent(id)}`);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        Incoming Orders — History & Current
      </h2>

      <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
        This list shows orders received from farmers (deliveries and supply
        shipments). This is a read-only history view — status updates happen
        upstream (farmers / transporters).
      </p>

      <div className="space-y-6">
        {ORDERS_FROM_FARMERS.map((o) => {
          const badgeClass = statusStyles[o.status] || statusStyles.Default;

          return (
            <article
              key={o.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col md:flex-row gap-4 items-start md:items-center"
              aria-labelledby={`incoming-${o.id}-title`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badgeClass}`}
                  >
                    {o.status}
                  </span>

                  <div className="text-sm text-gray-500">
                    {new Date(o.date).toLocaleDateString(undefined, {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </div>

                <h3
                  id={`incoming-${o.id}-title`}
                  className="text-lg font-bold mt-2"
                >
                  Incoming {o.id}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Farmer:{" "}
                  <strong className="text-gray-800 dark:text-gray-100">
                    {o.farmer}
                  </strong>
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  Items:{" "}
                  <strong>
                    {o.items.map((it) => `${it.qty}× ${it.name}`).join(", ")}
                  </strong>
                </p>

                {o.notes && (
                  <p className="mt-2 text-sm text-gray-400">Notes: {o.notes}</p>
                )}

                <p className="mt-2 font-semibold">
                  Total value: KSh {Number(o.total).toLocaleString()}
                </p>
              </div>

              <div className="flex-shrink-0 flex flex-col gap-2 justify-start">
                <button
                  onClick={() => viewDetails(o.id)}
                  className="px-4 py-2 rounded-lg border border-emerald-600 text-emerald-700 font-semibold"
                >
                  View
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default VendorOrders;
