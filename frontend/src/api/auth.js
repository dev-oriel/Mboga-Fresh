// src/api/auth.js
const BASE = import.meta.env.VITE_API_BASE || "";

async function handleResponse(res) {
  if (res.ok) return res.json();
  const text = await res.text();
  // try parse JSON error
  try {
    return Promise.reject(JSON.parse(text));
  } catch {
    return Promise.reject({ message: text || "API error" });
  }
}

export async function signupBuyer(payload) {
  const res = await fetch(`${BASE}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function signupWithFormData(formData) {
  const res = await fetch(`${BASE}/api/auth/signup`, {
    method: "POST",
    body: formData,
  });
  return handleResponse(res);
}

export async function loginApi({ email, password }) {
  // include credentials to allow httpOnly cookie to be set
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
}

export async function me() {
  const res = await fetch(`${BASE}/api/auth/me`, {
    credentials: "include",
  });
  return handleResponse(res);
}

export async function logoutApi() {
  const res = await fetch(`${BASE}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  return handleResponse(res);
}
