import React, { useEffect, useMemo, useState } from "react";
import AdminHeader from "../components/adminComponents/AdminHeader";
import AdminSidebar from "../components/adminComponents/AdminSidebar";
import {
  FaEye,
  FaCommentDots,
  FaBan,
  FaCheckCircle,
  FaStore,
  FaExclamationTriangle,
  FaHistory,
  FaStar,
  FaMotorcycle,
  FaSeedling,
  FaUsers,
} from "react-icons/fa";

/**
 * UserManagement.jsx
 * - Sidebar & Header left unchanged (imported)
 * - Role + User selects on the left, Search input on the right in the same control row
 * - Removed the Onboard button
 * - Search placeholder updated to "Search user"
 */

/* tiny visual helpers */
const Pill = ({ children, className = "" }) => (
  <span className={`inline-block px-3 py-1 rounded-full text-sm ${className}`}>{children}</span>
);

const StatusBadge = ({ status }) => {
  let classes = "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ";
  switch ((status || "").toString().toLowerCase()) {
    case "active":
    case "online":
      classes += "bg-green-100 text-green-700";
      break;
    case "suspended":
    case "terminated":
      classes += "bg-red-100 text-red-700";
      break;
    case "expiring soon":
      classes += "bg-yellow-100 text-yellow-800";
      break;
    case "offline":
    default:
      classes += "bg-stone-100 text-stone-600 dark:bg-stone-700 dark:text-stone-300";
  }
  return <span className={classes}>{status}</span>;
};

const ToggleSwitch = ({ checked, onChange }) => (
  <>
    <style>{`
      .switch { position: relative; display: inline-block; width: 38px; height: 22px; }
      .switch input { opacity: 0; width: 0; height: 0; }
      .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #e5e7eb; transition: .2s; border-radius: 9999px; }
      .slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 3px; bottom: 3px; background-color: white; transition: .2s; border-radius: 9999px; }
      input:checked + .slider { background-color: #16a34a; }
      input:checked + .slider:before { transform: translateX(16px); }
    `}</style>
    <label className="switch">
      <input type="checkbox" checked={!!checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="slider"></span>
    </label>
  </>
);

/* --- Sample data --- */
const initialData = {
  buyers: [
    { id: "b1", name: "Aisha Hassan", phone: "0722 123 456", area: "Westlands", orders: 42, escrow: "KES 15,500", status: "Active", enabled: true },
    { id: "b2", name: "James Omondi", phone: "0711 987 654", area: "Kasarani", orders: 12, escrow: "KES 4,200", status: "Active", enabled: true },
    { id: "b3", name: "Mary Wanjiru", phone: "0733 555 888", area: "Kilimani", orders: 5, escrow: "KES 1,800", status: "Suspended", enabled: false },
  ],
  sellers: [
    { id: "s1", name: "Wanjiku Mwangi", location: "Kawangware", rating: 4.8, sales: "KES 125,400", pending: 3, escrow: "KES 15,200", enabled: true },
    { id: "s2", name: "Akinyi Otieno", location: "Kibera", rating: 4.5, sales: "KES 98,650", pending: 1, escrow: "KES 8,500", enabled: true },
    { id: "s3", name: "Chebet Korir", location: "Githurai 44", rating: 4.9, sales: "KES 182,300", pending: 5, escrow: "KES 22,750", enabled: true },
    { id: "s4", name: "Fatuma Ali", location: "Eastleigh", rating: 4.7, sales: "KES 110,100", pending: 0, escrow: "KES 5,800", enabled: false },
  ],
  suppliers: [
    { id: "p1", name: "Green Valley Farms", produce: "Kale", volume: "500 Kgs / week", lastDelivery: "2023-10-26", score: 4.8, status: "Active", enabled: true },
    { id: "p2", name: "Baraka Growers", produce: "Tomatoes", volume: "1200 Kgs / week", lastDelivery: "2023-10-25", score: 4.5, status: "Active", enabled: true },
    { id: "p3", name: "Kilimo Bora", produce: "Spinach", volume: "300 Kgs / week", lastDelivery: "2023-10-22", score: 4.9, status: "Expiring Soon", enabled: true },
    { id: "p4", name: "Upendo Organics", produce: "Assorted Herbs", volume: "150 Kgs / week", lastDelivery: "2023-09-15", score: 4.2, status: "Terminated", enabled: false },
  ],
  riders: [
    { id: "r1", name: "Peter Kariuki", phone: "0799 111 222", vehicle: "Motorbike - KMC 123A", zone: "Westlands", deliveries: 120, rating: 4.8, status: "Online", enabled: true },
    { id: "r2", name: "Brian Omondi", phone: "0712 345 678", vehicle: "Motorbike - KMD 456B", zone: "Kibera", deliveries: 95, rating: 4.5, status: "Online", enabled: true },
    { id: "r3", name: "Jane Wambui", phone: "0722 987 654", vehicle: "TukTuk - KME 789C", zone: "CBD", deliveries: 88, rating: 4.9, status: "Offline", enabled: true },
  ],
};

const flattenUsers = (data) => {
  const out = [];
  Object.entries(data).forEach(([role, list]) => {
    list.forEach((u) => out.push({ ...u, __role: role }));
  });
  return out;
};

/* --- Compact Users table used in layout --- */
function UsersTable({ users = [], onToggle = () => {}, onView = () => {} }) {
  return (
    <div className="bg-white rounded-lg shadow p-0 overflow-hidden border">
      <table className="min-w-full">
        <thead className="bg-yellow-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600">Name</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600">Info</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600">Extra</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600">Status</th>
            <th className="px-6 py-4 text-right text-xs font-semibold text-stone-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t last:border-b hover:bg-stone-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stone-900">{u.name}</td>

              <td className="px-6 py-4 text-sm text-stone-600 whitespace-nowrap">
                {u.phone || u.location || u.produce || u.vehicle || "-"}
              </td>

              <td className="px-6 py-4 text-sm text-stone-600 whitespace-nowrap">
                {u.rating ? (
                  <div className="inline-flex items-center">
                    <FaStar className="text-yellow-400 mr-1" /> {u.rating.toFixed(1)}
                  </div>
                ) : u.score ? (
                  <div className="inline-flex items-center">
                    <FaStar className="text-yellow-400 mr-1" /> {u.score.toFixed(1)}
                  </div>
                ) : (
                  u.orders ?? "-"
                )}
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                {u.status ? <StatusBadge status={u.status} /> : u.enabled ? <StatusBadge status="Active" /> : <StatusBadge status="Offline" />}
              </td>

              <td className="px-6 py-4 text-right">
                <div className="inline-flex items-center space-x-3">
                  <button onClick={() => onView(u)} title="View" className="text-green-600 hover:text-green-800">
                    <FaEye />
                  </button>
                  <button title="Message" className="text-blue-600 hover:text-blue-800"><FaCommentDots /></button>
                  <button title="Warn" className="text-orange-500 hover:text-orange-700"><FaExclamationTriangle /></button>
                  <button title="Suspend" className="text-red-500 hover:text-red-700"><FaBan /></button>
                  <ToggleSwitch checked={u.enabled} onChange={(v) => onToggle(u.id, v)} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* --- Main Page --- */
export default function UserManagement() {
  const [data, setData] = useState(initialData);
  const allUsers = useMemo(() => flattenUsers(data), [data]);

  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [search, setSearch] = useState("");

  const visibleUsers = useMemo(() => {
    const list = roleFilter === "all" ? allUsers : allUsers.filter((u) => u.__role === roleFilter);
    if (!search) return list;
    const q = search.toLowerCase();
    return list.filter((u) => (u.name && u.name.toLowerCase().includes(q)) || (u.phone && u.phone.includes(q)) || (u.location && u.location.toLowerCase().includes(q)));
  }, [roleFilter, allUsers, search]);

  const selectedUser = useMemo(() => allUsers.find((u) => u.id === selectedUserId) || null, [allUsers, selectedUserId]);

  const handleToggle = (id, newChecked) => {
    setData((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((role) => {
        next[role] = next[role].map((u) => (u.id === id ? { ...u, enabled: newChecked, status: newChecked ? (role === "riders" ? "Online" : "Active") : (role === "riders" ? "Offline" : "Suspended") } : u));
      });
      return next;
    });
  };

  const handleView = (user) => {
    setSelectedUserId(user.id);
    setRoleFilter(user.__role ?? "all");
  };

  const userOptions = useMemo(() => {
    const list = roleFilter === "all" ? allUsers : allUsers.filter((u) => u.__role === roleFilter);
    return list;
  }, [roleFilter, allUsers]);

  const otherUsers = useMemo(() => allUsers.filter((u) => u.id !== selectedUserId), [allUsers, selectedUserId]);

  return (
    <div className="min-h-screen bg-background-light">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="hidden md:block">
          <AdminSidebar />
        </div>

        {/* Main column */}
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-30 bg-white border-b border-stone-200">
            <AdminHeader />
          </header>

          <main className="flex-1 p-8 bg-[rgba(245,247,236,0.7)]">
            <div className="max-w-7xl mx-auto">
              {/* Page title */}
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-stone-900"> </h1>
                {/* removed Onboard button as requested */}
              </div>

              {/* Controls row: left = role/user selects, right = search */}
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-stone-700">Role</label>
                  <select
                    value={roleFilter}
                    onChange={(e) => {
                      setRoleFilter(e.target.value);
                      setSelectedUserId(null);
                    }}
                    className="rounded-md border px-3 py-2 bg-white"
                  >
                    <option value="all">All</option>
                    <option value="buyers">Buyers</option>
                    <option value="sellers">Sellers</option>
                    <option value="suppliers">Suppliers</option>
                    <option value="riders">Riders</option>
                  </select>

                  <label className="text-sm font-medium text-stone-700">Select user</label>
                  <select
                    value={selectedUserId || ""}
                    onChange={(e) => setSelectedUserId(e.target.value || null)}
                    className="rounded-md border px-3 py-2 bg-white"
                  >
                    <option value="">Choose user to manage </option>
                    {userOptions.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} {u.__role ? `(${u.__role})` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Search moved to the right and placeholder changed */}
                <div className="flex items-center">
                  <div className="relative">
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search user"
                      className="w-64 rounded-full border px-4 py-2 bg-white shadow-sm focus:outline-none"
                    />
                    <div className="absolute right-3 top-2.5 text-stone-400">🔍</div>
                  </div>
                </div>
              </div>

              {/* Main content grid */}
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-8">
                  <div className="rounded-xl bg-white p-4 shadow">
                    <div className="mb-3">
                      <h2 className="text-lg font-semibold">USERS</h2>
                      <p className="text-sm text-stone-500">Manage suppliers — or switch role to manage other users.</p>
                    </div>

                    <div className="mt-4">
                      <UsersTable users={visibleUsers} onToggle={handleToggle} onView={handleView} />
                    </div>
                  </div>

                  {selectedUser && (
                    <div className="mt-6">
                      <div className="rounded-lg bg-white p-4 shadow">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">Other users</h3>
                          <span className="text-sm text-stone-500">{otherUsers.length} users</span>
                        </div>

                        <div className="mt-3">
                          <ul className="divide-y">
                            {otherUsers.slice(0, 8).map((u) => (
                              <li key={u.id} className="py-3 flex items-center justify-between">
                                <div>
                                  <div className="font-medium">{u.name}</div>
                                  <div className="text-sm text-stone-500">{u.__role} — {u.phone || u.location || u.produce || u.vehicle}</div>
                                </div>
                                <div className="text-sm text-stone-500">{u.status || (u.enabled ? "Active" : "Offline")}</div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <aside className="col-span-4">
                  <div className="rounded-xl bg-white p-6 shadow">
                    <h3 className="text-lg font-semibold mb-2">Manage user</h3>
                    {selectedUser ? (
                      <>
                        <div className="mb-4">
                          <div className="text-xl font-bold">{selectedUser.name}</div>
                          <div className="text-sm text-stone-500">{selectedUser.__role}</div>
                        </div>

                        <div className="mb-4 space-y-2">
                          <div>
                            <div className="text-xs text-stone-500">Contact</div>
                            <div className="font-medium">{selectedUser.phone ?? selectedUser.location ?? "-"}</div>
                          </div>

                          <div>
                            <div className="text-xs text-stone-500">Extra</div>
                            <div className="font-medium">
                              {selectedUser.rating ? `Rating: ${selectedUser.rating}` : selectedUser.score ? `Score: ${selectedUser.score}` : selectedUser.orders ?? "-"}
                            </div>
                          </div>

                          <div>
                            <div className="text-xs text-stone-500">Status</div>
                            <div className="mt-1"><StatusBadge status={selectedUser.status ?? (selectedUser.enabled ? "Active" : "Offline")} /></div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-green-600 text-white">Save changes</button>
                          <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border">View history</button>
                          <div className="flex items-center justify-between">
                            <div className="text-sm">Enable account</div>
                            <ToggleSwitch checked={selectedUser.enabled} onChange={(v) => handleToggle(selectedUser.id, v)} />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-sm text-stone-500">Choose a user from the dropdown or table to manage details here.</div>
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
