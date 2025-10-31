const BASE = "";

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
  const res = await fetch(`${BASE}/api/products/list${qs}`, {
    // MODIFIED: was /api/products
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

// --- NEW FUNCTION ---
export async function fetchVendorFilters() {
  const res = await fetch(`${BASE}/api/vendors/filter-list`, {
    credentials: "include",
  });
  return handleResponse(res);
}
// --- END NEW FUNCTION ---

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
