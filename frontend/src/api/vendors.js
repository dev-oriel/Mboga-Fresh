import axios from "axios"; // Added axios import

const API_URL_BASE = "/api";

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
  const res = await fetch(`${API_URL_BASE}/api/vendors`);
  return handleResponse(res);
}

export async function fetchVendor(id) {
  const res = await fetch(
    `${API_URL_BASE}/api/vendors/${encodeURIComponent(id)}`
  );
  return handleResponse(res);
}

export async function fetchCategories() {
  const res = await fetch(`${API_URL_BASE}/api/categories`);
  return handleResponse(res);
}

// --- NEW NOTIFICATION ACTIONS (Assumed Backend Endpoints) ---

/**
 * Marks a single notification as read.
 * @param {string} notificationId The ID of the notification to mark read.
 */
export async function markNotificationAsReadRequest(notificationId) {
  const url = `${API_URL_BASE}/notifications/${notificationId}/read`;
  const res = await axios.patch(url, {}, { withCredentials: true });
  return res.data;
}

/**
 * Deletes all notifications marked as read for the current user.
 */
export async function deleteReadNotificationsRequest() {
  const url = `${API_URL_BASE}/notifications/read`;
  const res = await axios.delete(url, { withCredentials: true });
  return res.data;
}
