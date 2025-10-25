// frontend/src/api/bulkProducts.js

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
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return text;
  }
}

function qs(obj = {}) {
  const s = new URLSearchParams();
  Object.entries(obj || {}).forEach(([k, v]) => {
    if (typeof v !== "undefined" && v !== null) s.set(k, String(v));
  });
  const q = s.toString();
  return q ? `?${q}` : "";
}

export async function fetchBulkProducts(params = {}) {
  const url = `${BASE}/api/bulk-products${qs(params)}`;
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw await res.text();
  return handleResponse(res);
}

export async function fetchBulkProduct(id) {
  const res = await fetch(
    `${BASE}/api/bulk-products/${encodeURIComponent(id)}`,
    { credentials: "include" }
  );
  if (!res.ok) throw await res.text();
  return handleResponse(res);
}

export async function createBulkProduct(formData) {
  const res = await fetch(`${BASE}/api/bulk-products`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  if (!res.ok) throw await res.text();
  return handleResponse(res);
}

export async function updateBulkProduct(id, formData) {
  const res = await fetch(
    `${BASE}/api/bulk-products/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      credentials: "include",
      body: formData,
    }
  );
  if (!res.ok) throw await res.text();
  return handleResponse(res);
}

export async function deleteBulkProduct(id) {
  const res = await fetch(
    `${BASE}/api/bulk-products/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );
  if (!res.ok) throw await res.text();
  return handleResponse(res);
}
