import React, { useState } from 'react';

export default function OrderManagement() {
  const [activeTab, setActiveTab] = useState('new');

  const orders = [
    {
      id: '#12345',
      buyer: 'Aisha Hassan',
      items: 'Tomatoes, Onions',
      amount: 'KES 1,500',
      status: 'Pending',
      payment: 'Unpaid',
      action: 'Accept Order'
    },
    {
      id: '#12346',
      buyer: 'Fatima Ali',
      items: 'Potatoes, Carrots',
      amount: 'KES 2,200',
      status: 'Pending',
      payment: 'Paid',
      action: 'Accept Order'
    },
    {
      id: '#12347',
      buyer: 'Grace Mwangi',
      items: 'Mangoes, Bananas',
      amount: 'KES 1,800',
      status: 'Confirmed',
      payment: 'Unpaid',
      action: 'Mark as Delivered'
    },
    {
      id: '#12348',
      buyer: 'Sarah Kamau',
      items: 'Avocados, Spinach',
      amount: 'KES 1,200',
      status: 'Delivered',
      payment: 'Paid',
      action: 'View Details'
    },
    {
      id: '#12349',
      buyer: 'Esther Njoroge',
      items: 'Cabbages, Peppers',
      amount: 'KES 2,000',
      status: 'Pending',
      payment: 'Unpaid',
      action: 'Accept Order'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'Confirmed':
        return 'bg-blue-100 text-blue-700';
      case 'Delivered':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPaymentColor = (payment) => {
    return payment === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
  };

  const getActionButton = (action) => {
    if (action === 'View Details') {
      return 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50';
    } else if (action === 'Mark as Delivered') {
      return 'border border-green-600 text-green-600 bg-white hover:bg-green-50';
    } else {
      return 'bg-green-500 text-white hover:bg-green-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Mboga Fresh</span>
            </div>
            <nav className="flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-gray-900">Dashboard</a>
              <a href="#" className="text-green-600 font-medium">Orders</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Products</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Payments</a>
            </nav>
          </div>
          <div className="flex items-center space-x-3">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Mama" alt="Profile" className="w-10 h-10 rounded-full" />
            <span className="text-gray-900 font-medium">Mama Mboga</span>
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
          <p className="text-gray-600">Manage your incoming and ongoing orders, Mama Mboga.</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-8 border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('new')}
            className={`pb-4 px-1 relative ${
              activeTab === 'new'
                ? 'text-green-600 font-medium'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>New Orders</span>
              <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                5
              </span>
            </div>
            {activeTab === 'new' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('delivery')}
            className={`pb-4 px-1 ${
              activeTab === 'delivery'
                ? 'text-green-600 font-medium'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
              </svg>
              <span>In Delivery</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`pb-4 px-1 ${
              activeTab === 'completed'
                ? 'text-green-600 font-medium'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Completed</span>
            </div>
          </button>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Buyer
                </th>
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="py-4 px-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6 text-sm text-gray-900 font-medium">
                    {order.id}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-700">
                    {order.buyer}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-700">
                    {order.items}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900 font-medium">
                    {order.amount}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getPaymentColor(order.payment)}`}>
                      {order.payment}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${getActionButton(order.action)}`}>
                      {order.action}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}