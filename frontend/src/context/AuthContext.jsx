// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { loginApi, me, logoutApi } from "../api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // try to fetch current user (optional endpoint)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await me();
        if (mounted) setUser(data.user ?? null);
      } catch (err) {
        // not logged in or endpoint missing
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoadingUser(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  const login = async (email, password) => {
    const res = await loginApi({ email, password });
    setUser(res.user || null);
    return res;
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (err) {
      // ignore
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loadingUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
