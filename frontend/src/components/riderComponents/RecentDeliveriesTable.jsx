import React from "react";

const RecentDeliveriesTable = ({ deliveries = [] }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-green-200 bg-white dark:bg-gray-800">
      <table className="w-full text-left">
        <thead className="border-b border-green-200 bg-white dark:bg-gray-800">
          <tr>
            <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Order ID
            </th>
            <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Customer
            </th>
            <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Location
            </th>
            <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Status
            </th>
            <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300 text-right">
              Earnings
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-green-200">
          {deliveries.length === 0 ? (
            <tr>
              <td
                className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300"
                colSpan="5"
              >
                No deliveries yet.
              </td>
            </tr>
          ) : (
            deliveries.map((d) => (
              <tr key={d.id}>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                  {d.id}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                  {d.customer}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                  {d.location}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                    {d.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-300 text-right">
                  {d.earnings}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RecentDeliveriesTable;
