// frontend/src/pages/Login.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("buyer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const info = location.state?.info ?? null;

  const roleRedirectMap = {
    buyer: "/",
    vendor: "/vendordashboard",
    farmer: "/supplierdashboard",
    rider: "/riderdashboard",
    admin: "/admin",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // login() will call the API and refresh /me internally
      const res = await login(email.trim(), password, role);
      // Prefer server-canonical role: try res.user, then context user, then chosen role
      const actualRole = res?.user?.role || user?.role || role;
      const to = roleRedirectMap[actualRole] || "/";
      navigate(to);
    } catch (err) {
      // normalize error to a readable string
      let msg = "Login failed";
      if (!err) msg = "Login failed";
      else if (typeof err === "string") msg = err;
      else if (err.message) msg = err.message;
      else if (err?.raw) msg = JSON.stringify(err.raw);
      else msg = JSON.stringify(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <div className="text-center mb-4">
          <div className="inline-block p-3 bg-green-100 rounded-xl mb-3">
            <svg
              className="h-8 w-8 text-green-600"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold">Mboga Fresh</h1>
          <p className="text-sm text-gray-600">Freshness You Can Trust.</p>
        </div>

        {info && <div className="mb-3 text-sm text-emerald-600">{info}</div>}
        {error && <div className="mb-3 text-sm text-red-600">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border p-2 rounded"
              disabled={loading}
            >
              <option value="buyer">Buyer</option>
              <option value="vendor">Vendor</option>
              <option value="farmer">Farmer</option>
              <option value="rider">Rider</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded text-white ${
              loading ? "bg-gray-400" : "bg-emerald-600"
            }`}
          >
            {loading ? "Signing in..." : "Log in"}
          </button>
        </form>

        <p className="text-sm mt-4 text-center">
          Don't have an account?{" "}
          <a href="/signup/buyer" className="text-emerald-600">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
