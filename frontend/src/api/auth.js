// frontend/src/api/auth.js
const BASE = import.meta.env.VITE_API_BASE || "";

async function handleResponse(res) {
  if (res.ok) return res.json();
  const text = await res.text().catch(() => "");
  // try JSON parse
  try {
    return Promise.reject(JSON.parse(text));
  } catch (e) {
    return Promise.reject({ message: text || "API error" });
  }
}

/** Signup: role-aware. Use JSON for buyer; FormData for others. */
export async function signup(payload, isFormData = false) {
  const opts = {
    method: "POST",
    body: isFormData ? payload : JSON.stringify(payload),
    headers: isFormData ? undefined : { "Content-Type": "application/json" },
    // signup does not need credentials unless backend sets cookie on signup
    credentials: "include",
  };
  const res = await fetch(`${BASE}/api/auth/signup`, opts);
  return handleResponse(res);
}

export async function loginApi({ email, password }) {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });
  return handleResponse(res);
}

export async function me() {
  const res = await fetch(`${BASE}/api/auth/me`, { credentials: "include" });
  return handleResponse(res);
}

export async function logoutApi() {
  const res = await fetch(`${BASE}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  return handleResponse(res);
}
