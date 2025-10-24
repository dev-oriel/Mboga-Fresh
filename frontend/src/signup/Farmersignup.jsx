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

const FarmerSignUp = () => {
  const [formData, setFormData] = useState({
    farmName: "",
    contactPerson: "",
    email: "",
    phone: "",
    location: "",
    password: "",
    produceTypes: "",
  });
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
    const { farmName, contactPerson, email, phone, location, password } =
      formData;

    if (
      !farmName ||
      !contactPerson ||
      !email ||
      !phone ||
      !location ||
      !password
    ) {
      setError("Please fill all required fields.");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("role", "farmer");
      fd.append("name", contactPerson); // User.name (Owner's Name)
      fd.append("email", email);
      fd.append("phone", phone);
      fd.append("password", password);
      fd.append("farmName", farmName); // FarmerProfile field
      fd.append("contactPerson", contactPerson);
      fd.append("location", location);
      // Assuming produceTypes is sent as a comma-separated string that the backend can parse
      if (formData.produceTypes)
        fd.append("produceTypes", formData.produceTypes);

      await signupWithFormData(fd);
      navigate("/login", {
        state: {
          info: "Farmer account created (pending review). Please log in.",
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
            agriculture
          </span>
        </div>
        <h1 className="text-3xl font-bold text-black mt-2">Mboga Fresh</h1>
        <p className="text-gray-500">
          Connect your farm directly to the market
        </p>
      </div>

      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Create your Farmer/Supplier Account
        </h2>
        <p className="text-sm text-center text-gray-500 mb-4">
          Your identity and farm details must be verified by the admin.
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
                htmlFor="farmName"
                className="block text-sm font-medium text-gray-600"
              >
                Farm Name
              </label>
              <input
                type="text"
                id="farmName"
                name="farmName"
                value={formData.farmName}
                onChange={handleInputChange}
                placeholder="Green Acres Farm"
                required
                className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label
                htmlFor="contactPerson"
                className="block text-sm font-medium text-gray-600"
              >
                Contact Person Name
              </label>
              <input
                type="text"
                id="contactPerson"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleInputChange}
                placeholder="Daniel Mutuku"
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
                placeholder="farm@example.com"
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

            <div className="md:col-span-2">
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-600"
              >
                Farm Location (County/Town)
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Rift Valley, Nakuru"
                required
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
                htmlFor="produceTypes"
                className="block text-sm font-medium text-gray-600"
              >
                Main Produce (e.g., Tomatoes, Maize, Avocados)
              </label>
              <input
                type="text"
                id="produceTypes"
                name="produceTypes"
                value={formData.produceTypes}
                onChange={handleInputChange}
                placeholder="Tomatoes, Maize, Avocados"
                className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
            {loading ? "Submitting for Review..." : "Sign Up as Farmer"}
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

export default FarmerSignUp;
