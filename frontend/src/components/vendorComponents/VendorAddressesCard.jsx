// frontend/src/components/vendorComponents/VendorAddressesCard.jsx
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const VendorAddressesCard = () => {
  const { user, refresh } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: "",
    details: "",
    isPrimary: false,
  });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({
    show: false,
    type: "",
    message: "",
  });
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (user?.addresses) setAddresses(user.addresses);
  }, [user]);

  const showConfirmation = (type, message) => {
    setFeedback({ show: true, type, message });
    setTimeout(() => {
      if (mountedRef.current)
        setFeedback({ show: false, type: "", message: "" });
    }, 3000);
  };

  const saveAddresses = async (updatedAddresses, action = "saved") => {
    try {
      setLoading(true);
      await axios.put(
        "http://localhost:5000/api/profile/addresses",
        { addresses: updatedAddresses },
        { withCredentials: true }
      );
      if (typeof refresh === "function") await refresh();
      showConfirmation("success", `Address ${action} successfully.`);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to save addresses";
      console.error(msg);
      showConfirmation("error", msg);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  const handleAddAddress = () => {
    if (!newAddress.label || !newAddress.details)
      return showConfirmation("error", "Please fill all fields.");

    const updated = newAddress.isPrimary
      ? [
          { ...newAddress },
          ...addresses.map((a) => ({ ...a, isPrimary: false })),
        ]
      : [newAddress, ...addresses];

    setAddresses(updated);
    saveAddresses(updated, "added");
    setNewAddress({ label: "", details: "", isPrimary: false });
    setShowForm(false);
  };

  const handleDelete = (index) => {
    setDeleteIndex(index);
  };

  const confirmDelete = () => {
    const updated = addresses.filter((_, i) => i !== deleteIndex);
    setAddresses(updated);
    setDeleteIndex(null);
    saveAddresses(updated, "deleted");
  };

  const handleTogglePrimary = (index) => {
    const updated = addresses.map((a, i) => ({ ...a, isPrimary: i === index }));
    setAddresses(updated);
    saveAddresses(updated, "updated");
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 relative" id="addresses">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">Saved Addresses</h3>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-colors text-sm flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">add</span>
            Add New Address
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="mb-4 text-sm text-rose-600 bg-rose-50 p-3 rounded">
          {errorMsg}
        </div>
      )}

      {showForm && (
        <div className="border border-gray-200 rounded-lg p-4 mb-6 space-y-4">
          <h4 className="font-semibold text-gray-900">Add a New Address</h4>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Address Label (e.g., Store Location, Warehouse)
            </label>
            <input
              type="text"
              value={newAddress.label}
              onChange={(e) =>
                setNewAddress({ ...newAddress, label: e.target.value })
              }
              placeholder="Enter label"
              className="mt-1 block w-full rounded-lg border border-gray-200 shadow-sm focus:border-emerald-600 focus:ring focus:ring-emerald-100 sm:text-sm p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Address Details
            </label>
            <textarea
              rows="2"
              value={newAddress.details}
              onChange={(e) =>
                setNewAddress({ ...newAddress, details: e.target.value })
              }
              placeholder="Enter full address"
              className="mt-1 block w-full rounded-lg border border-gray-200 shadow-sm focus:border-emerald-600 focus:ring focus:ring-emerald-100 sm:text-sm p-2"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              id="isPrimary"
              type="checkbox"
              checked={newAddress.isPrimary}
              onChange={(e) =>
                setNewAddress({ ...newAddress, isPrimary: e.target.checked })
              }
              className="h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
            />
            <label htmlFor="isPrimary" className="text-gray-700">
              Set as Primary
            </label>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setShowForm(false)}
              className="text-sm font-medium text-rose-500 hover:underline"
            >
              Cancel
            </button>
            <button
              onClick={handleAddAddress}
              disabled={loading}
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-colors text-sm"
            >
              {loading ? "Saving..." : "Save Address"}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {addresses.map((address, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 flex justify-between items-start hover:bg-gray-50 transition-colors"
          >
            <div>
              <p className="font-semibold text-gray-900">{address.label}</p>
              <p className="text-gray-500">{address.details}</p>
              {address.isPrimary && (
                <span className="mt-1 inline-block bg-emerald-50 text-emerald-600 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  Primary
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {!address.isPrimary && (
                <button
                  onClick={() => handleTogglePrimary(index)}
                  className="text-gray-500 hover:text-emerald-600 text-sm font-medium"
                >
                  Set Primary
                </button>
              )}
              <button
                onClick={() => handleDelete(index)}
                className="text-gray-500 hover:text-rose-500"
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {deleteIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-lg">
            <h4 className="text-lg font-semibold mb-2">Confirm Deletion</h4>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete this address?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteIndex(null)}
                className="px-4 py-2 rounded-md border text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-md bg-rose-600 text-white text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {feedback.show && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg text-white transition-all duration-300 ${
            feedback.type === "success" ? "bg-emerald-600" : "bg-rose-600"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base">
              {feedback.type === "success" ? "check_circle" : "error"}
            </span>
            <p className="text-sm font-medium">{feedback.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorAddressesCard;