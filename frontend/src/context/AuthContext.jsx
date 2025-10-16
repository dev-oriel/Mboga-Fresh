// frontend/src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { loginRequest, meRequest, logoutRequest } from "../api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // try to get session on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await meRequest();
        if (mounted && res?.success) setUser(res.user);
      } catch (err) {
        setUser(null);
      } finally {
        if (mounted) setLoadingAuth(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  // login: returns server response or throws
  const login = async (email, password, role) => {
    const res = await loginRequest(email, password, role);
    if (res?.success) {
      setUser(res.user);
      return res;
    }
    throw res;
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loadingAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
