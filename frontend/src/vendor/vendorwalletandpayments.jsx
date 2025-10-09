import React, { useState } from 'react'

// Single-file React component for the "Wallet & Payments" page.
// Designed for Tailwind CSS (v2+ / v3+). Paste into your project as a page/component.

function vendorwalletandpayments() {
  const [mpesa, setMpesa] = useState('254712345678')
  const [amount, setAmount] = useState('')
  const [balance] = useState({ escrow: 12500, available: 8750, earnings: 21250 })

  const transactions = [
    { date: '2024-07-26', id: 'ORD-20240726-001', desc: 'Sale of Sukuma Wiki', amount: 5000, status: 'Released' },
    { date: '2024-07-25', id: 'ORD-20240725-002', desc: 'Sale of Tomatoes', amount: 3750, status: 'Released' },
    { date: '2024-07-24', id: 'ORD-20240724-003', desc: 'Sale of Cabbages', amount: 7500, status: 'Released' },
    { date: '2024-07-23', id: 'WTH-20240723-001', desc: 'Withdrawal to M-Pesa', amount: -2500, status: 'Completed' },
    { date: '2024-07-22', id: 'DEP-20240722-001', desc: 'Float Deposit', amount: 2500, status: 'Processed' }
  ]

  function handleWithdraw(e) {
    e.preventDefault()
    if (!amount) return alert('Enter an amount to withdraw')
    alert(`Withdrawing Ksh ${amount} to ${mpesa}`)
    setAmount('')
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* ✅ Logo + Brand + Navigation */}
          <div className="flex items-center flex-1">
            <div className="flex items-center gap-3">
              <img src="/mboga-logo.png" alt="Mboga Fresh Logo" className="h-10" />
              <h1 className="text-2xl font-bold text-green-700">Mboga Fresh</h1>
            </div>

            <nav className="ml-12 flex-1 flex justify-center space-x-8 text-sm text-gray-600">
              <a className="hover:underline" href="#">Dashboard</a>
              <a className="hover:underline" href="#">Orders</a>
              <a className="hover:underline" href="#">Products</a>
              <a className="text-green-600 font-semibold" href="#">Payments</a>
            </nav>
          </div>

          {/* ✅ User Profile */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Mama Mboga</span>
            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">👩</div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold mb-6">Wallet & Payments</h2>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left / center: main content */}
          <section className="lg:col-span-3 space-y-6">
            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-6 shadow-sm flex flex-col">
                <div className="text-xs text-gray-500">Funds in Escrow</div>
                <div className="mt-4 text-2xl font-bold">Ksh {balance.escrow.toLocaleString()}</div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm flex flex-col">
                <div className="text-xs text-gray-500">Available Balance</div>
                <div className="mt-4 text-2xl font-bold">Ksh {balance.available.toLocaleString()}</div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm flex flex-col">
                <div className="text-xs text-gray-500">Total Earnings</div>
                <div className="mt-4 text-2xl font-bold">Ksh {balance.earnings.toLocaleString()}</div>
              </div>
            </div>

            {/* Transaction history */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-lg mb-4">Transaction History</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm table-auto">
                  <thead>
                    <tr className="text-left text-gray-500">
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Order ID</th>
                      <th className="pb-3">Description</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((t, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="py-3 text-gray-600">{t.date}</td>
                        <td className="py-3 text-gray-600">{t.id}</td>
                        <td className="py-3 text-gray-600">{t.desc}</td>
                        <td className={`py-3 ${t.amount < 0 ? 'text-red-500' : 'text-gray-800'}`}>
                          Ksh {Math.abs(t.amount).toLocaleString()}
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              t.status === 'Released'
                                ? 'bg-green-100 text-green-700'
                                : t.status === 'Completed'
                                ? 'bg-gray-100 text-gray-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Right: Withdraw panel */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h4 className="font-semibold text-lg mb-4">Withdraw Funds</h4>

              <form onSubmit={handleWithdraw} className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">M-Pesa Number</label>
                  <input
                    value={mpesa}
                    onChange={(e) => setMpesa(e.target.value)}
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">Amount</label>
                  <input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g., 5000"
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
                  />
                </div>

                <button className="w-full bg-green-500 hover:bg-green-600 text-white rounded-md py-2 font-medium">
                  Withdraw Now
                </button>

                <div className="mt-4 text-sm bg-green-50 border border-green-100 p-3 rounded-md text-green-700">
                  <strong className="block">Tip:</strong>
                  M-Pesa withdrawals are processed instantly but may take up to 5 minutes to reflect in your account.
                </div>
              </form>
            </div>
          </aside>
        </div>

        <footer className="mt-10 text-sm text-gray-500 flex justify-between">
          <div>© 2024 Mboga Fresh. All rights reserved.</div>
          <div className="space-x-4">
            <a className="hover:underline" href="#">Terms of Service</a>
            <a className="hover:underline" href="#">Privacy Policy</a>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default vendorwalletandpayments
