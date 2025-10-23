// frontend/src/admin/UserManagement.jsx - FINAL DYNAMIC VERSION (DISPLAY FIX)

import React, { useMemo, useState, useEffect, useCallback } from "react";
import AdminHeader from "../components/adminComponents/AdminHeader";
import AdminSidebar from "../components/adminComponents/AdminSidebar";
import axios from "axios";
import {
  Eye,
  MessageSquare,
  Ban,
  AlertTriangle,
  Store,
  Leaf,
  Bike,
  Users,
  Star,
  X,
  Loader2,
  User,
  CheckCircle,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

/**
 * Maps DB role keys (singular) to professional display names.
 */
const ROLE_DISPLAY_MAP = {
  buyer: "Buyer",
  vendor: "Vendor (Mama Mboga)",
  farmer: "Farmer (Supplier)",
  rider: "Rider",
  admin: "Admin",
  unknown: "Unknown Role",
};

/* --- Helper Components --- */

const StatusBadge = ({ status }) => {
  let classes =
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-wide ";
  const lowerStatus = (status || "").toLowerCase();

  if (lowerStatus === "active" || lowerStatus === "online") {
    classes += "bg-emerald-100 text-emerald-700 font-semibold";
  } else if (
    lowerStatus === "suspended" ||
    lowerStatus === "terminated" ||
    lowerStatus === "offline"
  ) {
    classes += "bg-red-100 text-red-700 font-semibold";
  } else if (lowerStatus === "pending") {
    classes += "bg-amber-100 text-amber-800 font-semibold";
  } else {
    classes += "bg-stone-100 text-stone-600";
  }
  return <span className={classes}>{status}</span>;
};

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

/* --- Main User Table --- */
function UsersTable({
  users = [],
  onToggle = () => {},
  onView = () => {},
  loading = false,
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-0 overflow-hidden border border-stone-200">
      <table className="min-w-full divide-y divide-stone-100">
        <thead className="bg-emerald-50/50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">
              Name (Jina)
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">
              Key Info
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-4 text-right text-xs font-semibold text-stone-700 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5" className="py-12 text-center text-stone-500">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-500" />
                Loading users...
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td colSpan="5" className="py-12 text-center text-stone-500">
                No users match the current criteria.
              </td>
            </tr>
          ) : (
            users.map((u) => {
              // FIX: Determine role using the most reliable field (u.role is the singular key from DB)
              const roleKey = u.role ? u.role.toLowerCase() : "unknown";
              const roleDisplay =
                ROLE_DISPLAY_MAP[roleKey] || ROLE_DISPLAY_MAP["unknown"];

              return (
                <tr
                  key={u.id}
                  className="border-t last:border-b border-stone-100 hover:bg-emerald-50/50 cursor-pointer transition duration-150"
                  onClick={() => onView(u)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stone-900">
                    {u.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-stone-600 whitespace-nowrap">
                    {roleDisplay}
                  </td>
                  <td className="px-6 py-4 text-sm text-stone-600">
                    {u.phone || u.location || u.produce || u.vehicle || "-"}
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
                    <div className="inline-flex items-center space-x-3">
                      <button
                        title="View Details"
                        className="text-emerald-600 hover:text-emerald-800 p-1 bg-emerald-50 rounded-md transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          onView(u);
                        }}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        title={
                          u.enabled ? "Suspend Account" : "Activate Account"
                        }
                        className={`${
                          u.enabled
                            ? "text-red-500 bg-red-50"
                            : "text-emerald-600 bg-emerald-50"
                        } hover:opacity-80 p-1 rounded-md transition`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggle(u.id, !u.enabled);
                        }}
                      >
                        {u.enabled ? (
                          <Ban size={16} />
                        ) : (
                          <CheckCircle size={16} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

/* --- User Detail Card Component --- */
function UserDetailCard({ user, onToggle, onClose }) {
  if (!user) return null;

  // Determine the role key (singular, lowercase)
  const roleKey = user.role ? user.role.toLowerCase() : "unknown";
  // Determine the plural key (used for mapping data access below)
  const userRoleKeyPlural = user.role ? user.role + "s" : "unknowns";

  // Map role key to Lucide Icon
  const Icon =
    {
      buyer: Users,
      vendor: Store,
      farmer: Leaf,
      rider: Bike,
      admin: User,
      unknown: User,
    }[roleKey] || Users;

  const roleDisplay = ROLE_DISPLAY_MAP[roleKey] || ROLE_DISPLAY_MAP["unknown"];
  const statusText = user.status ?? (user.enabled ? "Active" : "Suspended");

  return (
    <div className="rounded-xl bg-white p-6 shadow-xl border border-stone-200 sticky top-28">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-stone-900">Manage User Access</h3>
        <button
          onClick={onClose}
          className="text-stone-500 hover:text-red-500 p-1 rounded-full hover:bg-stone-100"
          aria-label="Close user details"
        >
          <X size={20} />
        </button>
      </div>

      <div className="mb-6 flex items-center space-x-4 border-b pb-4">
        <div className="p-3 bg-red-100 rounded-full text-red-600">
          <Icon size={24} />
        </div>
        <div>
          <div className="text-2xl font-bold text-stone-900">{user.name}</div>
          <div className="text-sm font-medium text-stone-500">
            {roleDisplay}
          </div>
        </div>
      </div>

      <div className="mb-6 space-y-4 text-sm">
        <h4 className="font-semibold text-stone-800">Key Information</h4>
        <DetailRow label="Phone" value={user.phone || "N/A"} />
        <DetailRow label="Email" value={user.email || "N/A"} />
        <DetailRow
          label="Primary Area"
          value={user.area || user.location || user.zone || "N/A"}
        />
        <DetailRow
          label="Account Status"
          value={<StatusBadge status={statusText} />}
          isComponent={true}
        />

        {/* Dynamic Details based on Role (using userRoleKeyPlural for conditional rendering) */}
        {userRoleKeyPlural === "buyers" && (
          <DetailRow label="Total Orders" value={user.orders || 0} />
        )}
        {userRoleKeyPlural === "buyers" && (
          <DetailRow label="Escrow Balance" value={user.escrow || "KES 0"} />
        )}

        {userRoleKeyPlural === "sellers" && (
          <DetailRow label="Total Sales" value={user.sales || "KES 0"} />
        )}
        {userRoleKeyPlural === "sellers" && (
          <DetailRow
            label="Rating"
            value={user.rating ? `${user.rating} / 5` : "N/A"}
          />
        )}
        {userRoleKeyPlural === "sellers" && (
          <DetailRow label="Business Name" value={user.businessName || "N/A"} />
        )}

        {userRoleKeyPlural === "farmers" && (
          <DetailRow label="Main Produce" value={user.produce || "N/A"} />
        )}
        {userRoleKeyPlural === "farmers" && (
          <DetailRow label="Supply Volume" value={user.volume || "N/A"} />
        )}

        {userRoleKeyPlural === "riders" && (
          <DetailRow label="Vehicle" value={user.vehicle || "N/A"} />
        )}
        {userRoleKeyPlural === "riders" && (
          <DetailRow label="Deliveries" value={user.deliveries || 0} />
        )}

        {roleKey === "admin" && <DetailRow label="User ID" value={user.id} />}
      </div>

      <div className="space-y-3 pt-4 border-t border-stone-200">
        <div className="flex items-center justify-between py-2">
          <div className="text-sm font-medium text-stone-700">
            Account Enabled (Toggle)
          </div>
          <ToggleSwitch
            checked={user.enabled}
            onChange={(v) => onToggle(user.id, v)}
          />
        </div>

        <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
          <MessageSquare size={16} /> Send Direct Message
        </button>
        <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-stone-300 text-stone-700 font-semibold hover:bg-stone-100 transition">
          <AlertTriangle size={16} /> Issue Formal Warning
        </button>
      </div>
    </div>
  );
}

function DetailRow({ label, value, isComponent = false }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="font-medium text-stone-700">{label}:</span>
      {isComponent ? (
        value
      ) : (
        <span className="text-stone-600 font-medium">{value}</span>
      )}
    </div>
  );
}

/* --- Main Page Component --- */
export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // roleFilter holds the singular, backend-compatible role key
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [search, setSearch] = useState("");

  const visibleUsers = useMemo(() => {
    // Client-side search filtering
    const q = search.toLowerCase();

    return users.filter(
      (u) =>
        !search ||
        (u.name && u.name.toLowerCase().includes(q)) ||
        (u.phone && u.phone.includes(q)) ||
        (u.location && u.location.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q))
    );
  }, [users, search]);

  // 1. Fetching Logic
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Send the singular role key to the backend
      const url = `${API_BASE}/api/admin/users?role=${roleFilter}`;
      const response = await axios.get(url, { withCredentials: true });

      const initialUsers = response.data.map((u) => ({
        ...u,
        // DEFENSIVE FIX: Ensure 'role' field is used and fallback to the main object
        role: u.role || (u.__role ? u.__role.slice(0, -1) : "unknown"),
        // Ensure a fallback non-null status field
        status: u.status || (u.enabled ? "Active" : "Suspended"),
      }));

      setUsers(initialUsers);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Failed to load user data. Check server logs or API endpoint.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const selectedUser = useMemo(
    () => users.find((u) => u.id === selectedUserId) || null,
    [users, selectedUserId]
  );

  // 2. Local Toggle/Update Logic
  const handleToggle = (id, newChecked) => {
    // Optimistically update the local state for immediate feedback
    setUsers((prevUsers) =>
      prevUsers.map((u) => {
        if (u.id !== id) return u;

        const isRider = u.role === "rider" || u.__role === "riders";

        const newStatus = isRider
          ? newChecked
            ? "Online"
            : "Offline"
          : newChecked
          ? "Active"
          : "Suspended";

        return {
          ...u,
          enabled: newChecked,
          status: newStatus,
        };
      })
    );

    // Re-set selected user to force the UserDetailCard to re-render with new status
    if (selectedUserId === id) {
      setSelectedUserId(null);
      setTimeout(() => setSelectedUserId(id), 50);
    }
  };

  const handleView = (user) => {
    setSelectedUserId(user.id);
  };

  const handleCloseDetail = () => {
    setSelectedUserId(null);
  };

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
                {error && (
                  <div className="text-red-600 text-sm bg-red-100 p-2 rounded-lg border border-red-200">
                    {error}
                  </div>
                )}
              </div>

              {/* Controls row: Role Filter and Search */}
              <div className="flex items-center justify-between gap-4 mb-6 p-4 bg-white rounded-xl shadow-sm border border-stone-200">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-stone-700">
                    Filter by Role
                  </label>
                  <select
                    value={roleFilter}
                    onChange={(e) => {
                      setRoleFilter(e.target.value);
                      setSearch("");
                    }}
                    className="rounded-lg border border-stone-300 px-3 py-2 bg-white text-sm focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    {/* Filter options using singular role keys */}
                    <option value="all">All Roles</option>
                    <option value="buyer">Buyers</option>
                    <option value="vendor">Vendors (Mama Mboga)</option>
                    <option value="farmer">Farmers (Suppliers)</option>
                    <option value="rider">Riders</option>
                    <option value="admin">Admins</option>
                  </select>
                </div>

                {/* Search Input */}
                <div className="relative">
                  <input
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                    }}
                    placeholder="Search by name, phone, or location"
                    className="w-64 rounded-full border border-stone-300 px-4 py-2 bg-white text-sm shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 pl-10"
                  />
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-lg">
                    search
                  </span>
                </div>
              </div>

              {/* Main content grid */}
              <div className="grid grid-cols-12 gap-6">
                {/* User List Table */}
                <div
                  className={`transition-all duration-300 ${
                    selectedUser ? "col-span-12 lg:col-span-8" : "col-span-12"
                  }`}
                >
                  <div className="rounded-xl bg-white shadow-md">
                    <div className="p-4 border-b border-stone-200">
                      <h2 className="text-xl font-semibold text-stone-900">
                        User List ({visibleUsers.length})
                      </h2>
                      <p className="text-sm text-stone-500">
                        Click a row to manage detailed access and status.
                      </p>
                    </div>
                    <div>
                      <UsersTable
                        users={visibleUsers}
                        onToggle={handleToggle}
                        onView={handleView}
                        loading={loading}
                      />
                    </div>
                  </div>
                </div>

                {/* User Detail Sidebar/Card */}
                <aside
                  className={`col-span-12 lg:col-span-4 transition-all duration-300 ${
                    selectedUser ? "block" : "hidden"
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
