import React, { useMemo, useState } from 'react';
import Header from '../components/adminComponents/AdminHeader';
import Sidebar from '../components/adminComponents/AdminSidebar';

/* --- Mock data --- */
const initialDeliveries = [
  {
    id: '#ORD-98765',
    customer: 'Grace Mwai',
    destination: 'Nairobi, CBD',
    carrier: 'John Kiprop',
    status: 'In Transit',
    items: 3,
    eta: '2025-10-27',
    notes: 'Leave with concierge if not at home.',
  },
  {
    id: '#ORD-98764',
    customer: 'David Kimani',
    destination: 'Mombasa, Nyali',
    carrier: 'Alice Wanjiru',
    status: 'Delivered',
    items: 1,
    eta: '2025-10-20',
    notes: 'Delivered to neighbour.',
  },
  {
    id: '#ORD-98763',
    customer: 'Mary Omondi',
    destination: 'Kisumu, Milimani',
    carrier: 'N/A',
    status: 'Pending',
    items: 2,
    eta: null,
    notes: 'Waiting for dispatch assignment.',
  },
  {
    id: '#ORD-98762',
    customer: 'Peter Kariuki',
    destination: 'Nakuru, Langa Langa',
    carrier: 'N/A',
    status: 'Canceled',
    items: 4,
    eta: null,
    notes: 'Customer canceled before dispatch.',
  },
];

/* --- Small helper components (Tailwind only) --- */

const StatusBadge = ({ status }) => {
  const base = 'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold';
  switch (status) {
    case 'In Transit':
      return <span className={`${base} bg-blue-100 text-blue-800`}>{status}</span>;
    case 'Delivered':
      return <span className={`${base} bg-green-100 text-green-800`}>{status}</span>;
    case 'Canceled':
      return <span className={`${base} bg-red-100 text-red-800`}>{status}</span>;
    case 'Pending':
    default:
      return <span className={`${base} bg-yellow-100 text-yellow-800`}>{status}</span>;
  }
};

const EyeIcon = () => (
  <svg
    className="w-5 h-5 text-green-600 hover:text-green-800"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    aria-hidden
    focusable="false"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

const CancelIcon = () => (
  <svg
    className="w-5 h-5 text-red-600 hover:text-red-800"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    aria-hidden
    focusable="false"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden focusable="false">
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

/* --- Main Component --- */

export default function DeliveryAndLogistics() {
  const [deliveries] = useState(initialDeliveries);
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return deliveries.filter((d) => {
      if (statusFilter !== 'All Statuses' && d.status !== statusFilter) return false;
      if (!q) return true;
      return (
        d.id.toLowerCase().includes(q) ||
        (d.customer && d.customer.toLowerCase().includes(q)) ||
        (d.destination && d.destination.toLowerCase().includes(q)) ||
        (d.carrier && d.carrier.toLowerCase().includes(q))
      );
    });
  }, [deliveries, statusFilter, query]);

  const selected = useMemo(() => deliveries.find((d) => d.id === selectedId) || null, [deliveries, selectedId]);

  return (
    <div className="min-h-screen bg-background-light">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Main column */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="sticky top-0 z-30 bg-white border-b border-stone-200">
            <Header />
          </header>

          {/* Page content */}
          <main className="flex-1 p-6 lg:p-8 bg-gray-50">
            <div className="max-w-7xl mx-auto">
              {/* Title */}
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-semibold text-gray-900">Delivery & Logistics</h1>
                <div className="text-sm text-gray-500"></div>
              </div>

              {/* Controls: filter + search */}
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <label htmlFor="statusFilter" className="text-sm font-medium text-gray-700">
                      Filter by Status
                    </label>
                    <select
                      id="statusFilter"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="block w-full sm:w-auto pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option>All Statuses</option>
                      <option>Pending</option>
                      <option>In Transit</option>
                      <option>Delivered</option>
                      <option>Canceled</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-end w-full sm:w-auto">
                    <div className="relative w-full sm:w-80">
                      <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by ID, customer, or destination..."
                        className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                        aria-label="Search deliveries"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* List + Details grid */}
              <div className="grid grid-cols-12 gap-6 mt-8">
                {/* Left: table */}
                <div className="col-span-12 lg:col-span-8">
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-4 py-5 sm:px-6">
                      <h2 className="text-lg font-medium text-gray-900">Delivery List ({filtered.length})</h2>
                      <p className="mt-1 text-sm text-gray-500">Click a row to view and manage delivery details.</p>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carrier</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-200">
                          {filtered.map((d) => (
                            <tr
                              key={d.id}
                              className={`hover:bg-gray-50 cursor-pointer ${selectedId === d.id ? 'bg-green-50' : ''}`}
                              onClick={() => setSelectedId((prev) => (prev === d.id ? null : d.id))}
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') setSelectedId((prev) => (prev === d.id ? null : d.id));
                              }}
                              role="button"
                              aria-pressed={selectedId === d.id}
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{d.id}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{d.customer}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{d.destination}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{d.carrier}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <StatusBadge status={d.status} />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex items-center space-x-3">
                                  <button
                                    type="button"
                                    aria-label={`View ${d.id}`}
                                    onClick={(ev) => { ev.stopPropagation(); setSelectedId((prev) => (prev === d.id ? null : d.id)); }}
                                    className="p-1 rounded hover:bg-stone-100"
                                  >
                                    <EyeIcon />
                                  </button>

                                  <button
                                    type="button"
                                    aria-label={`Cancel ${d.id}`}
                                    onClick={(ev) => { ev.stopPropagation(); /* TODO: implement cancel */ }}
                                    className="p-1 rounded hover:bg-stone-100"
                                  >
                                    <CancelIcon />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}

                          {filtered.length === 0 && (
                            <tr>
                              <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                                No deliveries match your search/filters.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Right: details panel */}
                <aside className="col-span-12 lg:col-span-4">
                  <div className="bg-white rounded-lg shadow p-6 relative">
                    {/* Close button (visible and keyboard-accessible) */}
                    <button
                      type="button"
                      onClick={() => setSelectedId(null)}
                      aria-label="Close details panel"
                      className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 p-1 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>

                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Delivery details</h3>

                    {selected ? (
                      <>
                        <div className="mb-4">
                          <div className="text-sm text-gray-500">Order</div>
                          <div className="text-base font-medium text-gray-900">{selected.id}</div>
                        </div>

                        <div className="mb-3">
                          <div className="text-sm text-gray-500">Customer</div>
                          <div className="font-medium">{selected.customer}</div>
                        </div>

                        <div className="mb-3">
                          <div className="text-sm text-gray-500">Destination</div>
                          <div className="font-medium">{selected.destination}</div>
                        </div>

                        <div className="mb-3">
                          <div className="text-sm text-gray-500">Carrier</div>
                          <div className="font-medium">{selected.carrier}</div>
                        </div>

                        <div className="mb-3">
                          <div className="text-sm text-gray-500">Items</div>
                          <div className="font-medium">{selected.items}</div>
                        </div>

                        <div className="mb-4">
                          <div className="text-sm text-gray-500">ETA</div>
                          <div className="font-medium">{selected.eta ?? 'TBD'}</div>
                        </div>

                        <div className="mb-4">
                          <div className="text-sm text-gray-500">Notes</div>
                          <div className="text-sm text-gray-700">{selected.notes}</div>
                        </div>

                        <div className="space-y-2 mt-4">
                          <button
                            type="button"
                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                            onClick={() => { /* TODO: implement save/update */ }}
                          >
                            Save changes
                          </button>

                          <button
                            type="button"
                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border"
                            onClick={() => { /* TODO: implement history view */ }}
                          >
                            View history
                          </button>

                          <button
                            type="button"
                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-700 hover:bg-red-100"
                            onClick={() => { /* TODO: implement cancel action */ }}
                          >
                            Cancel delivery
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-sm text-gray-500">Select a delivery from the list to view details and actions here.</div>
                    )}
                  </div>
                </aside>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
