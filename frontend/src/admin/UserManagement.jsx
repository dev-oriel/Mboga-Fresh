import React, { useEffect, useState } from 'react';
import AdminHeader from "../components/adminComponents/AdminHeader";
import AdminSidebar from "../components/adminComponents/AdminSidebar";
// Import icons
import {
  FaEye, FaCommentDots, FaBan, FaCheckCircle, FaStore, FaExclamationTriangle,
  FaHistory, FaStar, FaMotorcycle, FaTruckLoading, FaSeedling, FaUsers
} from 'react-icons/fa';

/**
 * UserManagementPage.jsx
 * Single-file component containing:
 * - Tabs (Buyers, Sellers, Suppliers, Riders)
 * - Specific table components for each role, styled with Tailwind
 * - Sample data and toggle handling
 *
 * Assumes Tailwind CSS is available in your project.
 */

// --- Reusable Helper Components ---

/**
 * A reusable status badge
 */
const StatusBadge = ({ status }) => {
  let classes = "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ";
  switch ((status || "").toString().toLowerCase()) {
    case 'active':
    case 'online':
      classes += "bg-green-100 text-green-700";
      break;
    case 'suspended':
    case 'terminated':
      classes += "bg-red-100 text-red-700";
      break;
    case 'expiring soon':
      classes += "bg-yellow-100 text-yellow-800";
      break;
    case 'offline':
    default:
      classes += "bg-stone-100 text-stone-600 dark:bg-stone-700 dark:text-stone-300";
  }
  return <span className={classes}>{status}</span>;
};

/**
 * A reusable toggle switch
 */
const ToggleSwitch = ({ checked, onChange }) => (
  <>
    {/* Switch CSS (kept here so the file is self-contained) */}
    <style>{`
      .switch { position: relative; display: inline-block; width: 38px; height: 22px; }
      .switch input { opacity: 0; width: 0; height: 0; }
      .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; -webkit-transition: .4s; transition: .4s; border-radius: 34px; }
      .slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 3px; bottom: 3px; background-color: white; -webkit-transition: .4s; transition: .4s; border-radius: 50%; }
      input:checked + .slider { background-color: #22c55e; }
      input:focus + .slider { box-shadow: 0 0 1px #22c55e; }
      input:checked + .slider:before { -webkit-transform: translateX(16px); -ms-transform: translateX(16px); transform: translateX(16px); }
      input:not(:checked) + .slider { background-color: #d1d5db; }
    `}</style>
    <label className="switch">
      <input
        type="checkbox"
        checked={!!checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="slider"></span>
    </label>
  </>
);

// --- Table Components ---

/**
 * Table for Buyers (Wateja)
 */
function BuyersTable({ users = [], onToggle = () => {} }) {
  return (
    <div className="rounded-lg shadow-sm border border-stone-200 dark:border-stone-800 overflow-hidden">
      <table className="min-w-full divide-y divide-stone-200 dark:divide-stone-700">
        <thead className="bg-green-50 dark:bg-green-900/10">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">Name (Jina)</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">Phone (Simu)</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">Area (Eneo)</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">Total Orders</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">Escrow History</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">Status (Hali)</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">Actions (Vitendo)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-200 dark:divide-stone-700">
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stone-900 dark:text-stone-50">{u.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500 dark:text-stone-400">{u.phone}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500 dark:text-stone-400">{u.area}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500 dark:text-stone-400">{u.orders}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500 dark:text-stone-400">{u.escrow}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge status={u.status} /></td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-4 text-lg">
                  <FaEye className="text-green-500 hover:text-green-700 cursor-pointer" title="View Details" />
                  <FaCommentDots className="text-blue-500 hover:text-blue-700 cursor-pointer" title="Send Message" />
                  {u.status === 'Suspended' ? (
                    <FaCheckCircle className="text-emerald-500 hover:text-emerald-700 cursor-pointer" title="Activate Buyer" />
                  ) : (
                    <FaBan className="text-red-500 hover:text-red-700 cursor-pointer" title="Suspend Buyer" />
                  )}
                  <ToggleSwitch checked={u.enabled} onChange={(isChecked) => onToggle(u.id, isChecked)} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Table for Sellers (Mama Mboga)
 */
function SellersTable({ users = [], onToggle = () => {} }) {
  return (
    <div className="rounded-lg shadow-sm border border-stone-200 dark:border-stone-800 overflow-hidden">
      <table className="min-w-full divide-y divide-stone-200 dark:divide-stone-700">
        <thead className="bg-yellow-50 dark:bg-yellow-900/10">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">Name (Jina)</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">Location (Mahali)</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">Freshness Rating</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">Total Sales (Mauzo)</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">Pending Orders</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">Escrow Balance</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">Actions (Vitendo)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-200 dark:divide-stone-700">
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stone-900 dark:text-stone-50">{u.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500 dark:text-stone-400">{u.location}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500 dark:text-stone-400">
                <div className="flex items-center">
                  <FaStar className="text-yellow-500 mr-1" /> {u.rating.toFixed(1)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500 dark:text-stone-400">{u.sales}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500 dark:text-stone-400">{u.pending}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500 dark:text-stone-400">{u.escrow}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-4 text-lg">
                  <FaStore className="text-teal-500 hover:text-teal-700 cursor-pointer" title="View Storefront" />
                  <FaCommentDots className="text-blue-500 hover:text-blue-700 cursor-pointer" title="Send Message" />
                  <FaExclamationTriangle className="text-orange-500 hover:text-orange-700 cursor-pointer" title="Send Warning" />
                  <FaBan className="text-red-500 hover:text-red-700 cursor-pointer" title="Suspend Seller" />
                  <ToggleSwitch checked={u.enabled} onChange={(isChecked) => onToggle(u.id, isChecked)} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Table for Suppliers (Wakulima)
 */
function SuppliersTable({ users = [], onToggle = () => {} }) {
  return (
    <div className="rounded-lg shadow-sm border border-stone-200 dark:border-stone-800 overflow-hidden">
      <table className="min-w-full divide-y divide-stone-200 dark:divide-stone-700">
        <thead className="bg-green-50 dark:bg-green-900/10">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">Farm Name (Shamba)</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">Produce Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">Supply Volume (Kgs)</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">Last Delivery</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">Quality Score</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">Contract Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">Actions (Matendo)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-200 dark:divide-stone-700">
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stone-900 dark:text-stone-50">{u.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500 dark:text-stone-400">{u.produce}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500 dark:text-stone-400">{u.volume}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500 dark:text-stone-400">{u.lastDelivery}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500 dark:text-stone-400">
                <div className="flex items-center">
                  <FaStar className="text-yellow-500 mr-1" /> {u.score.toFixed(1)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge status={u.status} /></td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-4 text-lg">
                  <FaHistory className="text-indigo-500 hover:text-indigo-700 cursor-pointer" title="View History" />
                  <FaCommentDots className="text-blue-500 hover:text-blue-700 cursor-pointer" title="Send Message" />
                  <FaBan className="text-red-500 hover:text-red-700 cursor-pointer" title="Terminate Contract" />
                  <ToggleSwitch checked={u.enabled} onChange={(isChecked) => onToggle(u.id, isChecked)} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Table for Riders (Wapanda Boda)
 */
function RidersTable({ users = [], onToggle = () => {} }) {
  return (
    <div className="rounded-lg shadow-sm border border-stone-200 dark:border-stone-800 overflow-hidden">
      <table className="min-w-full divide-y divide-stone-200 dark:divide-stone-700">
        <thead className="bg-blue-50 dark:bg-blue-900/10">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">Name (Jina)</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">Phone (Simu)</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">Vehicle (Gari)</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">Current Zone (Eneo)</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">Deliveries (30d)</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">Rating</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">Status (Hali)</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">Actions (Vitendo)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-200 dark:divide-stone-700">
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stone-900 dark:text-stone-50">{u.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500 dark:text-stone-400">{u.phone}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500 dark:text-stone-400">{u.vehicle}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500 dark:text-stone-400">{u.zone}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500 dark:text-stone-400">{u.deliveries}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500 dark:text-stone-400">
                <div className="flex items-center">
                  <FaStar className="text-yellow-500 mr-1" /> {u.rating.toFixed(1)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge status={u.status} /></td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-4 text-lg">
                  <FaEye className="text-green-500 hover:text-green-700 cursor-pointer" title="View Details" />
                  <FaCommentDots className="text-blue-500 hover:text-blue-700 cursor-pointer" title="Send Message" />
                  <FaBan className="text-red-500 hover:text-red-700 cursor-pointer" title="Suspend Rider" />
                  <ToggleSwitch checked={u.enabled} onChange={(isChecked) => onToggle(u.id, isChecked)} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


// --- Main Page Component ---

export default function UserManagement() {
  // Active tab state
  const [activeTab, setActiveTab] = useState('buyers');

  // Sample initial users grouped by role, adapted to the new table structures
  const initialData = {
    buyers: [
      { id: 'b1', name: 'Aisha Hassan', phone: '0722 123 456', area: 'Westlands', orders: 42, escrow: 'KES 15,500', status: 'Active', enabled: true },
      { id: 'b2', name: 'James Omondi', phone: '0711 987 654', area: 'Kasarani', orders: 12, escrow: 'KES 4,200', status: 'Active', enabled: true },
      { id: 'b3', name: 'Mary Wanjiru', phone: '0733 555 888', area: 'Kilimani', orders: 5, escrow: 'KES 1,800', status: 'Suspended', enabled: false },
      { id: 'b4', name: 'David Koech', phone: '0700 111 222', area: 'South B', orders: 28, escrow: 'KES 9,750', status: 'Active', enabled: true },
    ],
    sellers: [
      { id: 's1', name: 'Wanjiku Mwangi', location: 'Kawangware', rating: 4.8, sales: 'KES 125,400', pending: 3, escrow: 'KES 15,200', enabled: true },
      { id: 's2', name: 'Akinyi Otieno', location: 'Kibera', rating: 4.5, sales: 'KES 98,650', pending: 1, escrow: 'KES 8,500', enabled: true },
      { id: 's3', name: 'Chebet Korir', location: 'Githurai 44', rating: 4.9, sales: 'KES 182,300', pending: 5, escrow: 'KES 22,750', enabled: true },
      { id: 's4', name: 'Fatuma Ali', location: 'Eastleigh', rating: 4.7, sales: 'KES 110,100', pending: 0, escrow: 'KES 5,800', enabled: false },
    ],
    suppliers: [
      { id: 'p1', name: 'Green Valley Farms', produce: 'Kale (Sukuma Wiki)', volume: '500 Kgs / week', lastDelivery: '2023-10-26', score: 4.8, status: 'Active', enabled: true },
      { id: 'p2', name: 'Baraka Growers', produce: 'Tomatoes', volume: '1200 Kgs / week', lastDelivery: '2023-10-25', score: 4.5, status: 'Active', enabled: true },
      { id: 'p3', name: 'Kilimo Bora', produce: 'Spinach', volume: '300 Kgs / week', lastDelivery: '2023-10-22', score: 4.9, status: 'Expiring Soon', enabled: true },
      { id: 'p4', name: 'Upendo Organics', produce: 'Assorted Herbs', volume: '150 Kgs / week', lastDelivery: '2023-09-15', score: 4.2, status: 'Terminated', enabled: false },
    ],
    riders: [
      { id: 'r1', name: 'Peter Kariuki', phone: '0799 111 222', vehicle: 'Motorbike - KMC 123A', zone: 'Westlands', deliveries: 120, rating: 4.8, status: 'Online', enabled: true },
      { id: 'r2', name: 'Brian Omondi', phone: '0712 345 678', vehicle: 'Motorbike - KMD 456B', zone: 'Kibera', deliveries: 95, rating: 4.5, status: 'Online', enabled: true },
      { id: 'r3', name: 'Jane Wambui', phone: '0722 987 654', vehicle: 'TukTuk - KME 789C', zone: 'CBD', deliveries: 88, rating: 4.9, status: 'Offline', enabled: true },
      { id: 'r4', name: 'Mike Kiptoo', phone: '0700 888 777', vehicle: 'Motorbike - KMG 202E', zone: 'Eastleigh', deliveries: 45, rating: 3.9, status: 'Suspended', enabled: false },
    ],
  };

  // Store users in state so toggles update the UI
  const [usersByRole, setUsersByRole] = useState(initialData);

  // Toggle handler passed into table rows
  const handleToggle = (id, newChecked) => {
    // Update whichever role contains the user
    setUsersByRole((prev) => {
      const next = { ...prev };
      for (const role of Object.keys(next)) {
        next[role] = next[role].map((u) => (u.id === id ? { ...u, enabled: newChecked, status: newChecked ? (role === 'riders' ? 'Online' : 'Active') : (role === 'riders' ? 'Offline' : 'Suspended') } : u));
      }
      return next;
    });
    // Replace the console.log with an API call if needed
    console.log('Toggled', id, newChecked);
  };

  // Tabs array
  const tabs = [
    { key: 'buyers', label: 'Buyers (Wateja)', icon: FaUsers },
    { key: 'sellers', label: 'Sellers (Mama Mboga)', icon: FaStore },
    { key: 'suppliers', label: 'Suppliers (Wakulima)', icon: FaSeedling },
    { key: 'riders', label: 'Riders (Wapanda Boda)', icon: FaMotorcycle },
  ];

  // Highlight the "User Management" / "Users" item inside AdminSidebar so it looks active.
  // This is a non-destructive DOM tweak that runs after mount.
  useEffect(() => {
    const aside = document.querySelector('aside');
    if (!aside) return;
    // Find any element that contains the words "user" or "management" or "users"
    const els = Array.from(aside.querySelectorAll('*'));
    const match = els.find(el => {
      const txt = (el.textContent || '').trim().toLowerCase();
      return txt === 'user management' || txt === 'users' || txt.includes('user management') || txt.includes('users');
    });
    if (match) {
      // apply Tailwind classes for active state
      match.classList.add('text-green-500', 'font-semibold');
      // optionally remove muted text class if present
      match.classList.remove('text-stone-500', 'dark:text-stone-400');
    }
    // cleanup not necessary — harmless to leave applied classes
  }, []);

  return (
    <>
      <div className="bg-background-light dark:bg-background-dark font-display text-stone-900 dark:text-stone-100 min-h-screen">
        <div className="flex min-h-screen">
          {/* Sidebar - render your AdminSidebar here; hidden on small screens */}
          <aside className="hidden md:block md:w-64 lg:w-72 bg-white dark:bg-black/10 border-r border-stone-200 dark:border-stone-700">
            <AdminSidebar />
          </aside>

          {/* Main content column */}
          <div className="flex-1 flex flex-col bg-white dark:bg-background-dark">
            {/* Header - render your AdminHeader here */}
            <header className="sticky top-0 z-30 bg-white dark:bg-background-dark border-b border-stone-200 dark:border-stone-700">
              <AdminHeader />
            </header>

            <main className="flex-1 bg-background-light dark:bg-background-dark">
              <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50">Users</h2>
                </div>

                {/* Tab navigation */}
                <div className="mb-6">
                  <div className="border-b border-stone-200 dark:border-stone-700">
                    <nav aria-label="Tabs" className="-mb-px flex space-x-8">
                      {tabs.map((t) => {
                        const isActive = t.key === activeTab;
                        const Icon = t.icon;
                        return (
                          <button
                            key={t.key}
                            onClick={() => setActiveTab(t.key)}
                            className={`flex items-center space-x-2 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${
                              isActive
                                ? 'border-green-500 text-green-500'
                                : 'border-transparent text-stone-500 dark:text-stone-400 hover:border-stone-300 dark:hover:border-stone-600 hover:text-stone-700 dark:hover:text-stone-200'
                            }`}
                            aria-current={isActive ? 'page' : undefined}
                          >
                            <Icon className="h-5 w-5" />
                            <span>{t.label}</span>
                          </button>
                        );
                      })}
                    </nav>
                  </div>
                </div>

                {/* Conditionally rendered tables */}
                <div className="mt-8">
                  {activeTab === 'buyers' && <BuyersTable users={usersByRole.buyers} onToggle={handleToggle} />}
                  {activeTab === 'sellers' && <SellersTable users={usersByRole.sellers} onToggle={handleToggle} />}
                  {activeTab === 'suppliers' && <SuppliersTable users={usersByRole.suppliers} onToggle={handleToggle} />}
                  {activeTab === 'riders' && <RidersTable users={usersByRole.riders} onToggle={handleToggle} />}
                </div>
                
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
