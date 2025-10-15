// src/signup/RiderSignup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupWithFormData } from "../api/auth";

const RiderSignup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleName, setVehicleName] = useState("");
  const [password, setPassword] = useState("");
  const [idFile, setIdFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // basic client-side validation to avoid unnecessary requests
    if (
      !fullName ||
      !email ||
      !phone ||
      !idNumber ||
      !vehicleType ||
      !password
    ) {
      setError("Please fill all required fields (including email).");
      return;
    }

    const fd = new FormData();
    fd.append("role", "rider");
    fd.append("name", fullName);
    fd.append("email", email);
    fd.append("phone", phone);
    fd.append("password", password);
    fd.append("idNumber", idNumber);
    fd.append("vehicleType", vehicleType);
    fd.append("vehicleName", vehicleName || "");
    if (idFile) fd.append("doc0", idFile);

    setLoading(true);
    try {
      await signupWithFormData(fd);
      navigate("/login", {
        state: { info: "Rider account created (pending verification)" },
      });
    } catch (err) {
      // err may be string or object; try to show a helpful message
      setError(
        err?.message ||
          (err?.message === undefined && JSON.stringify(err)) ||
          "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-4">Become a Rider</h2>

        {error && <div className="mb-3 text-sm text-red-600">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm text-gray-700">Full Name</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name"
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="you@example.com"
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700">Phone Number</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+254 7XX XXX XXX"
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700">ID Number</label>
            <input
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              placeholder="National ID / Passport"
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700">Vehicle Type</label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">Select vehicle type</option>
              <option value="motorbike">Motorbike</option>
              <option value="bicycle">Bicycle</option>
              <option value="truck">Truck</option>
              <option value="van">Van</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700">
              Vehicle Name (optional)
            </label>
            <input
              value={vehicleName}
              onChange={(e) => setVehicleName(e.target.value)}
              placeholder="e.g. Bajaj Boxer"
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Choose a strong password"
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700">
              Upload ID (optional)
            </label>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setIdFile(e.target.files?.[0] ?? null)}
              className="mt-1"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded text-white ${
              loading ? "bg-gray-400" : "bg-emerald-600"
            }`}
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm mt-4 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-emerald-600">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default RiderSignup;
