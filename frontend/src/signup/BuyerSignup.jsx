import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupBuyer } from "../api/auth";

const normalizeError = (err) => {
  if (!err) return "Signup failed";
  if (typeof err === "object" && err.message) return err.message;
  if (Array.isArray(err.details) && err.details.length) {
    return err.details.map((d) => d.message).join(", ");
  }
  return String(err);
};

const BuyerSignup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
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

    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.phoneNumber.trim() ||
      !formData.password
    ) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    try {
      await signupBuyer({
        name: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phoneNumber.trim(),
        password: formData.password,
        role: "buyer",
      });

      setFormData((prev) => ({ ...prev, password: "" }));
      navigate("/login", {
        state: { info: "Account created — please log in" },
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
            shopping_basket
          </span>
        </div>
        <h1 className="text-3xl font-bold text-black mt-2">Mboga Fresh</h1>
        <p className="text-gray-500">Fresh from the farm to your table</p>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Create your Buyer Account
        </h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-600"
            >
              Full Name
            </label>
            <input
              autoFocus
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Jane Doe"
              className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
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
              placeholder="you@example.com"
              className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
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
              className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
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
              className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            aria-disabled={loading}
            className={`w-full ${
              loading ? "bg-gray-400" : "bg-emerald-600 hover:bg-emerald-700"
            } text-white font-semibold py-3 rounded-lg transition-colors`}
          >
            {loading ? "Creating Account..." : "Sign Up"}
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

export default BuyerSignup;
