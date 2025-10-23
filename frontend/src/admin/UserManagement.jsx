// frontend/src/admin/UserManagement.jsx - REPLACED ICONS WITH LUCIDE

import React, { useMemo, useState } from "react";
import AdminHeader from "../components/adminComponents/AdminHeader";
import AdminSidebar from "../components/adminComponents/AdminSidebar";
import {
  Eye,
  MessageSquare,
  Ban,
  AlertTriangle,
  Store,
  Leaf,
  Bike,
  Star,
  Users,
  X, // Used for closing the detail card
} from "lucide-react"; // <-- MODIFIED IMPORTS

/* tiny visual helpers */
const StatusBadge = ({ status }) => {
  let classes =
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ";
  switch ((status || "").toString().toLowerCase()) {
    case "active":
    case "online":
      classes += "bg-emerald-100 text-emerald-700";
      break;
    case "suspended":
    case "terminated":
      classes += "bg-red-100 text-red-700";
      break;
    case "expiring soon":
      classes += "bg-amber-100 text-amber-800";
      break;
    case "offline":
    default:
      classes += "bg-stone-100 text-stone-600";
  }
  return <span className={classes}>{status}</span>;
};

// ToggleSwitch unchanged - good reusable component
const ToggleSwitch = ({ checked, onChange }) => (
  <label className="relative inline-block w-10 h-6">
    <input
      type="checkbox"
      className="opacity-0 w-0 h-0 peer"
      checked={!!checked}
      onChange={(e) => onChange(e.target.checked)}
    />
    <span
      className="absolute cursor-pointer inset-0 bg-stone-300 rounded-full transition-colors duration-200 
                 peer-checked:bg-emerald-600 after:absolute after:content-[''] after:h-5 after:w-5 after:left-[2px] 
                 after:bottom-[2px] after:bg-white after:rounded-full after:transition-transform after:duration-200 
                 peer-checked:after:translate-x-4"
      aria-hidden="true"
    ></span>
  </label>
);

/* --- Sample data --- */
const initialData = {
  buyers: [
    {
      id: "b1",
      name: "Aisha Hassan",
      phone: "0722 123 456",
      area: "Westlands",
      orders: 42,
      escrow: "KES 15,500",
      status: "Active",
      enabled: true,
      __role: "buyers",
    },
    {
      id: "b2",
      name: "James Omondi",
      phone: "0711 987 654",
      area: "Kasarani",
      orders: 12,
      escrow: "KES 4,200",
      status: "Active",
      enabled: true,
      __role: "buyers",
    },
    {
      id: "b3",
      name: "Mary Wanjiru",
      phone: "0733 555 888",
      area: "Kilimani",
      orders: 5,
      escrow: "KES 1,800",
      status: "Suspended",
      enabled: false,
      __role: "buyers",
    },
  ],
  sellers: [
    {
      id: "s1",
      name: "Wanjiku Mwangi",
      location: "Kawangware",
      rating: 4.8,
      sales: "KES 125,400",
      pending: 3,
      escrow: "KES 15,200",
      enabled: true,
      __role: "sellers",
    },
    {
      id: "s2",
      name: "Akinyi Otieno",
      location: "Kibera",
      rating: 4.5,
      sales: "KES 98,650",
      pending: 1,
      escrow: "KES 8,500",
      enabled: true,
      __role: "sellers",
    },
    {
      id: "s3",
      name: "Chebet Korir",
      location: "Githurai 44",
      rating: 4.9,
      sales: "KES 182,300",
      pending: 5,
      escrow: "KES 22,750",
      enabled: true,
      __role: "sellers",
    },
  ],
  suppliers: [
    {
      id: "p1",
      name: "Green Valley Farms",
      produce: "Kale",
      volume: "500 Kgs / week",
      lastDelivery: "2023-10-26",
      score: 4.8,
      status: "Active",
      enabled: true,
      __role: "suppliers",
    },
    {
      id: "p2",
      name: "Baraka Growers",
      produce: "Tomatoes",
      volume: "1200 Kgs / week",
      lastDelivery: "2023-10-25",
      score: 4.5,
      status: "Active",
      enabled: true,
      __role: "suppliers",
    },
    {
      id: "p3",
      name: "Kilimo Bora",
      produce: "Spinach",
      volume: "300 Kgs / week",
      lastDelivery: "2023-10-22",
      score: 4.9,
      status: "Expiring Soon",
      enabled: true,
      __role: "suppliers",
    },
  ],
  riders: [
    {
      id: "r1",
      name: "Peter Kariuki",
      phone: "0799 111 222",
      vehicle: "Motorbike - KMC 123A",
      zone: "Westlands",
      deliveries: 120,
      rating: 4.8,
      status: "Online",
      enabled: true,
      __role: "riders",
    },
    {
      id: "r2",
      name: "Brian Omondi",
      phone: "0712 345 678",
      vehicle: "Motorbike - KMD 456B",
      zone: "Kibera",
      deliveries: 95,
      rating: 4.5,
      status: "Online",
      enabled: true,
      __role: "riders",
    },
    {
      id: "r3",
      name: "Jane Wambui",
      phone: "0722 987 654",
      vehicle: "TukTuk - KME 789C",
      zone: "CBD",
      deliveries: 88,
      rating: 4.9,
      status: "Offline",
      enabled: true,
      __role: "riders",
    },
  ],
};

const flattenUsers = (data) => {
  const out = [];
  Object.entries(data).forEach(([role, list]) => {
    list.forEach((u) => out.push({ ...u, __role: role }));
  });
  return out;
};

/* --- Compact Users table used in main layout --- */
function UsersTable({ users = [], onToggle = () => {}, onView = () => {} }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-0 overflow-hidden border border-stone-200">
      <table className="min-w-full">
        <thead className="bg-emerald-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600">
              Name
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600">
              Info
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600">
              Extra
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600">
              Status
            </th>
            <th className="px-6 py-4 text-right text-xs font-semibold text-stone-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t last:border-b hover:bg-stone-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stone-900">
                {u.name}
                <div className="text-xs font-normal text-stone-500">
                  {u.__role}
                </div>
              </td>

              <td className="px-6 py-4 text-sm text-stone-600 whitespace-nowrap">
                {u.phone || u.location || u.produce || u.vehicle || "-"}
              </td>

              <td className="px-6 py-4 text-sm text-stone-600 whitespace-nowrap">
                {u.rating || u.score ? (
                  <div className="inline-flex items-center">
                    <Star className="text-amber-400 mr-1 w-4 h-4" />{" "}
                    {/* Lucide Icon */}
                    {(u.rating || u.score).toFixed(1)}
                  </div>
                ) : (
                  u.orders ?? "-"
                )}
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                {u.status ? (
                  <StatusBadge status={u.status} />
                ) : u.enabled ? (
                  <StatusBadge status="Active" />
                ) : (
                  <StatusBadge status="Offline" />
                )}
              </td>

              <td className="px-6 py-4 text-right">
                <div className="inline-flex items-center space-x-3 text-lg">
                  <button
                    onClick={() => onView(u)}
                    title="View"
                    className="text-emerald-600 hover:text-emerald-800"
                  >
                    <Eye size={16} /> {/* Lucide Icon */}
                  </button>
                  <button
                    title="Message"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <MessageSquare size={16} /> {/* Lucide Icon */}
                  </button>
                  <button
                    title="Warn"
                    className="text-amber-500 hover:text-amber-700"
                  >
                    <AlertTriangle size={16} /> {/* Lucide Icon */}
                  </button>
                  <button
                    title="Suspend"
                    className="text-red-500 hover:text-red-700"
                  >
                    <Ban size={16} /> {/* Lucide Icon */}
                  </button>
                  <ToggleSwitch
                    checked={u.enabled}
                    onChange={(v) => onToggle(u.id, v)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* --- User Detail Card Component --- */
function UserDetailCard({ user, onToggle, onClose }) {
  if (!user) return null;

  const Icon =
    {
      buyers: Users,
      sellers: Store,
      suppliers: Leaf,
      riders: Bike,
    }[user.__role] || Users;

  const statusText = user.status ?? (user.enabled ? "Active" : "Suspended");

  return (
    <div className="rounded-xl bg-white p-6 shadow border border-stone-200 sticky top-28">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-stone-900">User Details</h3>
        <button
          onClick={onClose}
          className="text-stone-500 hover:text-red-500 p-1 rounded-full hover:bg-stone-100"
        >
          <X size={20} /> {/* Lucide Icon */}
        </button>
      </div>

      <div className="mb-4 flex items-center space-x-3 border-b pb-4">
        <div className="p-3 bg-emerald-100 rounded-full text-emerald-600">
          <Icon size={24} />
        </div>
        <div>
          <div className="text-2xl font-bold">{user.name}</div>
          <div className="text-sm font-medium text-stone-500 capitalize">
            {user.__role}
          </div>
        </div>
      </div>

      <div className="mb-6 space-y-4">
        <DetailRow label="Contact" value={user.phone || user.email || "N/A"} />
        <DetailRow
          label="Location"
          value={user.area || user.location || user.zone || "N/A"}
        />
        <DetailRow
          label="Status"
          value={<StatusBadge status={statusText} />}
          isComponent={true}
        />

        {user.__role === "buyers" && (
          <DetailRow label="Orders" value={user.orders} />
        )}
        {user.__role === "buyers" && (
          <DetailRow label="Escrow" value={user.escrow} />
        )}

        {user.__role === "sellers" && (
          <DetailRow label="Sales" value={user.sales} />
        )}
        {user.__role === "sellers" && (
          <DetailRow label="Rating" value={`${user.rating} / 5`} />
        )}

        {user.__role === "suppliers" && (
          <DetailRow label="Produce" value={user.produce} />
        )}
        {user.__role === "suppliers" && (
          <DetailRow label="Volume" value={user.volume} />
        )}

        {user.__role === "riders" && (
          <DetailRow label="Vehicle" value={user.vehicle} />
        )}
        {user.__role === "riders" && (
          <DetailRow label="Deliveries" value={user.deliveries} />
        )}
      </div>

      <div className="space-y-3 pt-4 border-t border-stone-200">
        <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700">
          <Eye size={16} /> View Full Profile
        </button>
        <button
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700"
          onClick={() => onToggle(user.id, !user.enabled)}
        >
          <Ban size={16} />{" "}
          {user.enabled ? "Suspend Account" : "Activate Account"}
        </button>
        <div className="flex items-center justify-between pt-2">
          <div className="text-sm font-medium text-stone-700">
            Account Enabled
          </div>
          <ToggleSwitch
            checked={user.enabled}
            onChange={(v) => onToggle(user.id, v)}
          />
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, isComponent = false }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="font-medium text-stone-700">{label}:</span>
      {isComponent ? value : <span className="text-stone-600">{value}</span>}
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
    const list =
      roleFilter === "all"
        ? allUsers
        : allUsers.filter((u) => u.__role === roleFilter);
    const q = search.toLowerCase();
    return list.filter(
      (u) =>
        !search ||
        (u.name && u.name.toLowerCase().includes(q)) ||
        (u.phone && u.phone.includes(q)) ||
        (u.location && u.location.toLowerCase().includes(q))
    );
  }, [roleFilter, allUsers, search]);

  const selectedUser = useMemo(
    () => allUsers.find((u) => u.id === selectedUserId) || null,
    [allUsers, selectedUserId]
  );

  const handleToggle = (id, newChecked) => {
    setData((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((role) => {
        next[role] = next[role].map((u) =>
          u.id === id
            ? {
                ...u,
                enabled: newChecked,
                status: newChecked
                  ? role === "riders"
                    ? "Online"
                    : "Active"
                  : role === "riders"
                  ? "Offline"
                  : "Suspended",
              }
            : u
        );
      });
      return next;
    });

    if (selectedUserId === id) {
      setSelectedUserId(null);
      setTimeout(() => setSelectedUserId(id), 50);
    }
  };

  const handleView = (user) => {
    setSelectedUserId(user.id);
    setRoleFilter(user.__role ?? "all");
  };

  const handleCloseDetail = () => {
    setSelectedUserId(null);
  };

  const userOptions = useMemo(() => {
    const list =
      roleFilter === "all"
        ? allUsers
        : allUsers.filter((u) => u.__role === roleFilter);
    return list;
  }, [roleFilter, allUsers]);

  return (
    <div className="min-h-screen bg-stone-50">
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

          <main className="flex-1 p-8 bg-stone-50">
            <div className="max-w-7xl mx-auto">
              {/* Page title */}
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-stone-900">
                  User Management
                </h1>
              </div>

              {/* Controls row: left = role/user selects, right = search */}
              <div className="flex items-center justify-between gap-4 mb-6 p-4 bg-white rounded-xl shadow-sm border border-stone-200">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-stone-700">
                    Filter by Role
                  </label>
                  <select
                    value={roleFilter}
                    onChange={(e) => {
                      setRoleFilter(e.target.value);
                      setSelectedUserId(null);
                    }}
                    className="rounded-lg border border-stone-300 px-3 py-2 bg-white text-sm focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="all">All Roles</option>
                    <option value="buyers">Buyers</option>
                    <option value="sellers">Sellers (Mama Mboga)</option>
                    <option value="suppliers">Suppliers (Farmers)</option>
                    <option value="riders">Riders</option>
                  </select>

                  <select
                    value={selectedUserId || ""}
                    onChange={(e) => setSelectedUserId(e.target.value || null)}
                    className="rounded-lg border border-stone-300 px-3 py-2 bg-white text-sm w-56 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Select User to Manage</option>
                    {userOptions.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.__role})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Search */}
                <div className="relative">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search user by name or phone"
                    className="w-64 rounded-full border border-stone-300 px-4 py-2 bg-white text-sm shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 pl-10"
                  />
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-lg">
                    search
                  </span>
                </div>
              </div>

              {/* Main content grid */}
              <div className="grid grid-cols-12 gap-6">
                <div
                  className={`transition-all duration-300 ${
                    selectedUser ? "col-span-8" : "col-span-12"
                  }`}
                >
                  <div className="rounded-xl bg-white shadow-md">
                    <div className="p-4 border-b border-stone-200">
                      <h2 className="text-xl font-semibold text-stone-900">
                        User List ({visibleUsers.length})
                      </h2>
                      <p className="text-sm text-stone-500">
                        Overview and quick actions for all filtered users.
                      </p>
                    </div>

                    <div>
                      <UsersTable
                        users={visibleUsers}
                        onToggle={handleToggle}
                        onView={handleView}
                      />
                    </div>
                  </div>
                </div>

                {/* User Detail Sidebar/Card */}
                <aside
                  className={`transition-all duration-300 ${
                    selectedUser ? "col-span-4 block" : "col-span-0 hidden"
                  }`}
                >
                  <UserDetailCard
                    user={selectedUser}
                    onToggle={handleToggle}
                    onClose={handleCloseDetail}
                  />
                </aside>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
