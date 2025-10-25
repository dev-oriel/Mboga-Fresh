// frontend/src/api/vendors.js

// Dynamic Base URL Resolver (Pasted into each file for independence)
const getBaseUrl = () => {
  const currentHost = window.location.hostname;
  const API_PORT = 5000;

  if (currentHost === "localhost" || currentHost === "127.0.0.1") {
    return `http://localhost:${API_PORT}`;
  } else {
    return `http://${currentHost}:${API_PORT}`;
  }
};

const BASE = getBaseUrl();

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
