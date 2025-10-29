const API_URL_BASE = "/api/auth";

async function handleResponse(res) {
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = text;
  }

  if (res.ok) {
    // Return parsed JSON (or raw text) directly
    return typeof data === "object" ? data : { data };
  } // Normalize error object so callers can read `.message`

  if (typeof data === "object") {
    throw {
      message: data.message || data.error || JSON.stringify(data),
      status: res.status,
      details: data.details,
      raw: data,
    };
  } else {
    throw {
      message: data || "API error",
      status: res.status,
      raw: data,
    };
  }
}

export async function loginRequest(email, password, role = "buyer") {
  const res = await fetch(`${API_URL_BASE}/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, role }),
  });
  return handleResponse(res);
}

export async function meRequest() {
  const res = await fetch(`${API_URL_BASE}/me`, {
    credentials: "include",
  });
  return handleResponse(res);
}

export async function logoutRequest() {
  const res = await fetch(`${API_URL_BASE}/logout`, {
    method: "POST",
    credentials: "include",
  });
  return handleResponse(res);
}

// JSON signup (no files)
export async function signupJson(payload) {
  const res = await fetch(`${API_URL_BASE}/signup`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

// FormData signup (files). DO NOT set Content-Type header.
export async function signupWithFormData(formData) {
  const res = await fetch(`${API_URL_BASE}/signup`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  return handleResponse(res);
}

/* Backwards-compatible aliases */
export const signupRequest = signupJson;
export const signupBuyer = signupJson;
