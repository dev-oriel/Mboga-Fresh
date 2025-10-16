// frontend/src/api/vendors.js
const BASE = import.meta.env.VITE_API_BASE || "";

async function handleResponse(res) {
  if (res.ok) return res.json();
  const text = await res.text();
  try {
    return Promise.reject(JSON.parse(text));
  } catch {
    return Promise.reject({ message: text || "API error" });
  }
}

export async function fetchVendors() {
  const res = await fetch(`${BASE}/api/vendors`);
  return handleResponse(res);
}

export async function fetchVendor(id) {
  const res = await fetch(`${BASE}/api/vendors/${encodeURIComponent(id)}`);
  return handleResponse(res);
}

export async function fetchCategories() {
  const res = await fetch(`${BASE}/api/categories`);
  return handleResponse(res);
}
