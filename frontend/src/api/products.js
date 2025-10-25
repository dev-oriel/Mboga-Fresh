// frontend/src/api/products.js

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

function buildQueryString(params = {}) {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && String(v) !== ""
  );
  if (entries.length === 0) return "";
  return (
    "?" +
    entries
      .map(
        ([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`
      )
      .join("&")
  );
}

async function handleResponse(res) {
  if (res.ok) {
    const text = await res.text();
    try {
      return text ? JSON.parse(text) : {};
    } catch {
      return text;
    }
  }
  const text = await res.text();
  throw new Error(text || "API error");
}

/**
 * fetchProducts(params)
 */
export async function fetchProducts(params = {}) {
  const qs = buildQueryString(params);
  const res = await fetch(`${BASE}/api/products${qs}`, {
    credentials: "include",
  });
  return handleResponse(res);
}

export async function fetchProduct(id) {
  const res = await fetch(`${BASE}/api/products/${encodeURIComponent(id)}`, {
    credentials: "include",
  });
  return handleResponse(res);
}

export async function createProduct(formData) {
  const res = await fetch(`${BASE}/api/products`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  return handleResponse(res);
}

export async function updateProduct(id, formData) {
  const res = await fetch(`${BASE}/api/products/${encodeURIComponent(id)}`, {
    method: "PUT",
    credentials: "include",
    body: formData,
  });
  return handleResponse(res);
}

export async function deleteProduct(id) {
  const res = await fetch(`${BASE}/api/products/${encodeURIComponent(id)}`, {
    method: "DELETE",
    credentials: "include",
  });
  return handleResponse(res);
}
