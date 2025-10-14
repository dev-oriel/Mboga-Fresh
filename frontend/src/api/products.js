const BASE = import.meta.env.VITE_API_BASE || "";

async function handleResponse(res) {
  if (res.ok) return res.json();
  const text = await res.text();
  throw new Error(text || "API error");
}

export async function fetchProducts() {
  const res = await fetch(`${BASE}/api/products`);
  return handleResponse(res);
}

export async function fetchProduct(id) {
  const res = await fetch(`${BASE}/api/products/${encodeURIComponent(id)}`);
  return handleResponse(res);
}

export async function createProduct(formData) {
  const res = await fetch(`${BASE}/api/products`, {
    method: "POST",
    body: formData,
  });
  return handleResponse(res);
}

export async function updateProduct(id, formData) {
  const res = await fetch(`${BASE}/api/products/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: formData,
  });
  return handleResponse(res);
}

export async function deleteProduct(id) {
  const res = await fetch(`${BASE}/api/products/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  return handleResponse(res);
}
