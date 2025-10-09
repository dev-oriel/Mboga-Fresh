import React from 'react';

function RiderEarningsAndHistory() {
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
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white shadow-sm">
        {/* wrapper that ensures logo, nav and profile align correctly */}
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Image from public folder */}
            <img src="/favicon.svg" alt="Mboga Fresh Logo" className="h-8 w-8 object-contain" />
            <h1 className="text-xl font-bold text-green-700">Mboga Fresh</h1>
          </div>

          <nav className="flex-1 flex justify-center md:justify-end space-x-8 text-sm text-gray-600">
            <a className="hover:underline" href="#">Dashboard</a>
            <a className="hover:underline" href="#">Orders</a>
            <a className="text-green-600 font-semibold" href="#">Earnings</a>
            <a className="hover:underline" href="#">Help</a>
          </nav>

          <div className="ml-4 flex items-center">
  <img
    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGsWq5QqWwF5f66c9kSicNkfyDw_dLYwhgqbTufkto3Cv95U7ah6Lpf7dxekVzJy7qtEuTMbSEMtzCsRdn_drhMsyEEFdvv-ktwLdeIdvdhXBKQf_f92jO-owfsZtFSRN1AnfO8VdV-vB-pUk5fJVCTKuLcXTQdcoADz4hP9cno0sovnYaZCswMomwMtLaD0H1t7htob_NXd0ApLJO7HIW7NyuZEkGHFj13FeiqxpfhWJLfwkkDOoJ9NitW6lF8OQQTWL6syZp4ng"
    alt="User Profile"
    className="h-9 w-9 rounded-full object-cover"
  />
</div>

        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Earnings & History</h2>

        <section className="mb-10">
          <h3 className="text-lg font-semibold text-gray-900 mb-5">This Week</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-sm text-gray-600 mb-2">Earnings — KSh</div>
              <div className="text-3xl font-bold text-gray-900">
                {earningsData.thisWeek.earnings.toLocaleString()}
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-sm text-gray-600 mb-2">Bonuses</div>
              <div className="text-3xl font-bold text-gray-900">
                {earningsData.thisWeek.bonuses.toLocaleString()}
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-sm text-gray-600 mb-2">Completed Deliveries</div>
              <div className="text-3xl font-bold text-gray-900">
                {earningsData.thisWeek.completedDeliveries}
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-5">Payout Summary</h3>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-white">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DATE</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AMOUNT</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {earningsData.payoutSummary.map((payout, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payout.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">KSh {payout.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
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
