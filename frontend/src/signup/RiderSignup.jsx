import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupWithFormData } from "../api/auth";

const normalizeError = (err) => {
  if (!err) return "Signup failed";
  if (typeof err === "object" && err.message) return err.message;
  if (Array.isArray(err.details) && err.details.length) {
    return err.details.map((d) => d.message).join(", ");
  }
  return String(err);
};

const RiderSignup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    idNumber: "",
    vehicleType: "",
    vehicleName: "",
    password: "",
  });
  const [idFile, setIdFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.idNumber ||
      !formData.vehicleType ||
      !formData.password
    ) {
      setError("Please fill all required fields.");
      return;
    }

    const fd = new FormData();
    fd.append("role", "rider");
    fd.append("name", formData.fullName);
    fd.append("email", formData.email);
    fd.append("phone", formData.phone);
    fd.append("password", formData.password);
    fd.append("idNumber", formData.idNumber);
    fd.append("vehicleType", formData.vehicleType);
    fd.append("vehicleName", formData.vehicleName || "");

    if (idFile) fd.append("doc0", idFile);

    setLoading(true);
    try {
      await signupWithFormData(fd);

      navigate("/login", {
        state: {
          info: "Rider account created (pending review). Please log in.",
        },
      });
    } catch (err) {
      setError(normalizeError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
      <div className="flex flex-col items-center mb-8">
        <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center">
          <span className="text-emerald-600 text-3xl material-symbols-outlined">
            two_wheeler
          </span>
        </div>
        <h1 className="text-3xl font-bold text-black mt-2">Mboga Fresh</h1>
        <p className="text-gray-500">Become a last-mile delivery partner</p>
      </div>

      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Create your Rider Account
        </h2>
        <p className="text-sm text-center text-gray-500 mb-4">
          Identity and vehicle documentation are required for approval.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-600"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Juma Kiprono"
                required
                className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label
                htmlFor="idNumber"
                className="block text-sm font-medium text-gray-600"
              >
                National ID Number
              </label>
              <input
                type="text"
                id="idNumber"
                name="idNumber"
                value={formData.idNumber}
                onChange={handleInputChange}
                placeholder="12345678"
                required
                className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-600"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="rider@example.com"
                required
                className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-600"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+254 7XX XXX XXX"
                required
                className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

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
                value={formData.vehicleType}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="" disabled>
                  Select Vehicle
                </option>
                <option value="motorbike">Motorbike</option>
                <option value="bicycle">Bicycle</option>
                <option value="truck">Truck</option>
                <option value="van">Van</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="vehicleName"
                className="block text-sm font-medium text-gray-600"
              >
                Vehicle Make (e.g., Bajaj Boxer)
              </label>
              <input
                type="text"
                id="vehicleName"
                name="vehicleName"
                value={formData.vehicleName}
                onChange={handleInputChange}
                placeholder="Bajaj Boxer"
                className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-600"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                required
                className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="idFile"
                className="block text-sm font-medium text-gray-600"
              >
                Upload ID Document (Image/PDF)
              </label>
              <input
                type="file"
                id="idFile"
                accept="image/*,application/pdf"
                onChange={(e) => setIdFile(e.target.files?.[0] ?? null)}
                className="mt-1 block w-full text-gray-700 p-1 border border-gray-300 rounded-lg focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            aria-disabled={loading}
            className={`w-full ${
              loading ? "bg-gray-400" : "bg-emerald-600 hover:bg-emerald-700"
            } text-white font-semibold py-3 rounded-lg transition-colors`}
          >
            {loading ? "Submitting for Review..." : "Sign Up as Rider"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-emerald-600 hover:underline font-medium"
            >
              Log In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RiderSignup;
