import axios from "axios"; // Added axios import

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
const API_URL_BASE = `${BASE}/api`; // Base URL for notifications, profiles, etc.

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
