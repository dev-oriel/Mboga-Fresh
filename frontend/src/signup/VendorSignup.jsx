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

const VendorSignup = () => {
  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    phoneNumber: "",
    location: "",
    email: "",
    password: "",
  });
  const [docFile, setDocFile] = useState(null);
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
      !formData.businessName ||
      !formData.ownerName ||
      !formData.phoneNumber ||
      !formData.location ||
      !formData.email ||
      !formData.password
    ) {
      setError("Please fill all required fields.");
      return;
    }

    const fd = new FormData();
    fd.append("role", "vendor");
    fd.append("name", formData.ownerName); // User.name
    fd.append("email", formData.email);
    fd.append("phone", formData.phoneNumber);
    fd.append("password", formData.password);
    fd.append("businessName", formData.businessName); // VendorProfile field
    fd.append("ownerName", formData.ownerName); // Redundant but kept for validation history
    fd.append("location", formData.location);

    if (docFile) fd.append("doc0", docFile);

    setLoading(true);
    try {
      await signupWithFormData(fd);

      navigate("/login", {
        state: {
          info: "Vendor account created (pending review). Please log in.",
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
            storefront
          </span>
        </div>
        <h1 className="text-3xl font-bold text-black mt-2">Mboga Fresh</h1>
        <p className="text-gray-500">Become a trusted food partner</p>
      </div>

      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Create your Vendor Account
        </h2>
        <p className="text-sm text-center text-gray-500 mb-4">
          Your account will be reviewed before activation.
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
                htmlFor="businessName"
                className="block text-sm font-medium text-gray-600"
              >
                Business Name
              </label>
              <input
                type="text"
                id="businessName"
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                placeholder="Mama Mboga Stalls"
                required
                className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label
                htmlFor="ownerName"
                className="block text-sm font-medium text-gray-600"
              >
                Owner Name
              </label>
              <input
                type="text"
                id="ownerName"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleInputChange}
                placeholder="Aisha Ali"
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
                placeholder="shop@example.com"
                required
                className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-600"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
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
                Primary Location (e.g., Kilimani, Westlands)
              </label>
              <select
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="" disabled>
                  Select Primary Market/Area
                </option>
                <option>Nairobi</option>
                <option>Mombasa</option>
                <option>Kisumu</option>
                <option>Nakuru</option>
              </select>
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
                htmlFor="docFile"
                className="block text-sm font-medium text-gray-600"
              >
                Upload Business License / ID (Optional)
              </label>
              <input
                type="file"
                id="docFile"
                accept="image/*,application/pdf"
                onChange={(e) => setDocFile(e.target.files?.[0] ?? null)}
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
            {loading ? "Submitting for Review..." : "Sign Up as Vendor"}
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

export default VendorSignup;
