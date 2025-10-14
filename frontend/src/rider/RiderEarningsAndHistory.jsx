import React from 'react';
import { useNavigate } from 'react-router-dom';
import RiderHeader from '../components/riderComponents/RiderHeader'; // Import RiderHeader

function RiderEarningsAndHistory() {
  const navigate = useNavigate();
  
  const earningsData = {
    thisWeek: {
      earnings: 12500,
      bonuses: 1500,
      completedDeliveries: 25,
    },
    payoutSummary: [
      { date: 'July 14, 2024', amount: 12500, status: 'Paid' },
      { date: 'July 7, 2024', amount: 11800, status: 'Paid' },
      { date: 'June 30, 2024', amount: 10200, status: 'Paid' },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Use the RiderHeader component instead of custom header */}
      <RiderHeader />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Earnings & History</h2>

        <section className="mb-10">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">This Week</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Earnings — KSh</div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {earningsData.thisWeek.earnings.toLocaleString()}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Bonuses</div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {earningsData.thisWeek.bonuses.toLocaleString()}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Completed Deliveries</div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {earningsData.thisWeek.completedDeliveries}
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">Payout Summary</h3>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-white dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">DATE</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">AMOUNT</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">STATUS</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {earningsData.payoutSummary.map((payout, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{payout.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">KSh {payout.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                        {payout.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default RiderEarningsAndHistory;