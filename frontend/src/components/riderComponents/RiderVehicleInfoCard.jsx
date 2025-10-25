// frontend/src/components/riderComponents/RiderVehicleInfoCard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const RiderVehicleInfoCard = () => {
  const { user, refresh } = useAuth();
  const [form, setForm] = useState({
    vehicleType: "",
    vehicleModel: "",
    vehiclePlate: "",
    location: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // Populate form from authenticated user data
  useEffect(() => {
    if (user) {
      setForm({
        vehicleType: user.vehicleType ?? "",
        vehicleModel: user.vehicleModel ?? "",
        vehiclePlate: user.vehiclePlate ?? user.plateNumber ?? "",
        location: user.location ?? "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), 4000);
    return () => clearTimeout(t);
  }, [message]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    setIsEditing(true);
  };

  const handleSaveChanges = async (e) => {
    e?.preventDefault?.();
    if (saving) return;

    if (!form.vehicleType) {
      setMessage({
        type: "error",
        text: "Vehicle type is required.",
      });
      return;
    }

    try {
      setSaving(true);

      const payload = {
        vehicleType: form.vehicleType,
        vehicleModel: form.vehicleModel,
        vehiclePlate: form.vehiclePlate,
        location: form.location,
      };

      await axios.put(
        `${import.meta.env.VITE_API_BASE || ""}/api/profile/vehicle`,
        payload,
        {
          withCredentials: true,
        }
      );

      // Critical: Refresh the user context after saving so the new data is available everywhere
      if (typeof refresh === "function") await refresh();

      setIsEditing(false);
      setMessage({ type: "success", text: "Vehicle information saved." });
    } catch (err) {
      console.error(
        "Failed to save vehicle info:",
        err?.response?.data ?? err?.message ?? err
      );
      const errText =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to save changes. Try again.";
      setMessage({ type: "error", text: errText });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6" id="vehicle-info">
      <div className="mb-6 flex items-start justify-between gap-4">
        <h3 className="text-xl font-bold text-gray-900">Vehicle Information</h3>

        {message && (
          <div
            className={`text-sm px-3 py-1 rounded-md font-medium ${
              message.type === "success"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            {message.text}
          </div>
        )}
      </div>

      <form className="space-y-6" onSubmit={handleSaveChanges}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="vehicleType"
              className="block text-sm font-medium text-gray-600"
            >
              Vehicle Type
            </label>
            <select
              id="vehicleType"
              name="vehicleType"
              value={form.vehicleType}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-gray-200 shadow-sm focus:border-emerald-600 focus:ring focus:ring-emerald-100 sm:text-sm p-2"
              required
            >
              <option value="">Select vehicle type</option>
              <option value="Motorbike">Motorbike</option>
              <option value="Bicycle">Bicycle</option>
              <option value="Car">Car</option>
              <option value="Van">Van</option>
              <option value="Scooter">Scooter</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="vehicleModel"
              className="block text-sm font-medium text-gray-600"
            >
              Vehicle Model
            </label>
            <input
              id="vehicleModel"
              name="vehicleModel"
              type="text"
              value={form.vehicleModel}
              onChange={handleChange}
              placeholder="e.g., Honda CB125, Toyota Probox"
              className="mt-1 block w-full rounded-lg border border-gray-200 shadow-sm focus:border-emerald-600 focus:ring focus:ring-emerald-100 sm:text-sm p-2"
            />
          </div>

          <div>
            <label
              htmlFor="vehiclePlate"
              className="block text-sm font-medium text-gray-600"
            >
              Vehicle Plate Number
            </label>
            <input
              id="vehiclePlate"
              name="vehiclePlate"
              type="text"
              value={form.vehiclePlate}
              onChange={handleChange}
              placeholder="e.g., KXX 123Y"
              className="mt-1 block w-full rounded-lg border border-gray-200 shadow-sm focus:border-emerald-600 focus:ring focus:ring-emerald-100 sm:text-sm p-2"
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-600"
            >
              Base Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g., Nairobi, Kenya"
              className="mt-1 block w-full rounded-lg border border-gray-200 shadow-sm focus:border-emerald-600 focus:ring focus:ring-emerald-100 sm:text-sm p-2"
            />
          </div>
        </div>

        {isEditing && (
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                if (user) {
                  setForm({
                    vehicleType: user.vehicleType ?? "",
                    vehicleModel: user.vehicleModel ?? "",
                    vehiclePlate: user.vehiclePlate ?? user.plateNumber ?? "",
                    location: user.location ?? "",
                  });
                }
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default RiderVehicleInfoCard;
