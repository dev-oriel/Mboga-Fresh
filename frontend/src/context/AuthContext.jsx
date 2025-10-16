// frontend/src/context/AuthContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { loginRequest, meRequest, logoutRequest } from "../api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true); // initial me fetch
  const [authBusy, setAuthBusy] = useState(false); // login/logout flows
  const [error, setError] = useState(null);

  // helper to normalize `me` responses into a user object or null
  const _normalizeMe = (res) => {
    // many backends return { success: true, user: {...} }
    // or return user directly. tolerate both shapes.
    const payload = res?.user ?? res?.data ?? res;
    // if payload contains wrapper like { success: false, message: '...' } treat as unauth
    if (payload && payload.success === false) return null;
    // payload might be a user object (has email/_id/name)
    if (
      payload &&
      (payload.email ||
        payload.id ||
        payload._id ||
        payload.name ||
        payload.fullName)
    ) {
      return payload.user ? payload.user : payload;
    }
    return null;
  };

  const refresh = useCallback(async () => {
    setLoadingAuth(true);
    try {
      const res = await meRequest();
      const u = _normalizeMe(res);
      setUser(u);
      setError(null);
      return u;
    } catch (err) {
      // on error, clear user (not authenticated)
      setUser(null);
      // preserve error for debugging if needed
      setError(err?.message || String(err));
      return null;
    } finally {
      setLoadingAuth(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!mounted) return;
      await refresh();
    })();
    return () => {
      mounted = false;
    };
  }, [refresh]);

  // login: call loginRequest then call /me to get canonical user profile
  const login = async (email, password, role = "buyer") => {
    setAuthBusy(true);
    try {
      const res = await loginRequest(email, password, role);
      // If loginRequest returned success wrapper, but to be safe call /me for canonical profile
      const canonical = await refresh();
      setAuthBusy(false);
      // return shape similar to old behaviour (so callers expecting res?.success still work)
      return res;
    } catch (err) {
      setAuthBusy(false);
      // ensure thrown error has `.message`
      if (!err || (typeof err === "object" && !err.message)) {
        throw { message: String(err) };
      }
      throw err;
    }
  };

  const logout = async () => {
    setAuthBusy(true);
    try {
      await logoutRequest();
    } catch (err) {
      // ignore network errors but log if necessary
      // console.warn("logout error", err);
    } finally {
      setUser(null);
      setAuthBusy(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        refresh,
        loadingAuth,
        authBusy,
        authError: error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
