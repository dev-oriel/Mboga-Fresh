// src/signup/VendorSignup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupWithFormData } from "../api/auth";

const VendorSignup = () => {
  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [docFile, setDocFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !businessName ||
      !ownerName ||
      !phoneNumber ||
      !location ||
      !email ||
      !password
    ) {
      setError("Please fill all fields.");
      return;
    }

    const fd = new FormData();
    fd.append("role", "vendor");
    fd.append("name", ownerName);
    fd.append("email", email);
    fd.append("phone", phoneNumber);
    fd.append("password", password);
    fd.append("businessName", businessName);
    fd.append("ownerName", ownerName);
    fd.append("location", location);
    if (docFile) fd.append("doc0", docFile);

    setLoading(true);
    try {
      await signupWithFormData(fd);
      // vendor signup -> pending verification. Redirect to login with message.
      navigate("/login", {
        state: { info: "Vendor account created (pending verification)" },
      });
    } catch (err) {
      setError(err?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-green-50">
      <header className="flex justify-between items-center px-6 py-4 bg-white shadow">
        <div className="flex items-center text-xl font-bold text-emerald-600">
          <div className="h-8 w-8 mr-2 rounded-full flex items-center justify-center bg-emerald-200">
            🌱
          </div>
          <span>Mboga Fresh</span>
        </div>
        <button
          onClick={() => navigate("/login")}
          className="bg-emerald-600 text-white py-2 px-4 rounded-full"
        >
          Log In
        </button>
      </header>

      <main className="flex-grow flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-2">
            Create your Vendor Account
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Your account will be reviewed before activation.
          </p>

          {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700">
                Business Name
              </label>
              <input
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="mt-1 w-full border rounded p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700">Owner Name</label>
              <input
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="mt-1 w-full border rounded p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full border rounded p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700">
                Phone Number
              </label>
              <input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mt-1 w-full border rounded p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700">Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-1 w-full border rounded p-2"
                required
              >
                <option value="">Select Location</option>
                <option>Nairobi</option>
                <option>Mombasa</option>
                <option>Kisumu</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full border rounded p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700">
                Optional document (shop license / ID)
              </label>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setDocFile(e.target.files?.[0] ?? null)}
                className="mt-1 w-full"
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
              Log in
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default VendorSignup;
