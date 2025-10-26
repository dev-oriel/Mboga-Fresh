// frontend/src/api/orders.js

import axios from "axios";

const getBaseUrl = () => {
  const currentHost = window.location.hostname;
  const API_PORT = 5000; // Dynamically resolves the host to ensure compatibility on both localhost and 192.168.x.x

  if (currentHost === "localhost" || currentHost === "127.0.0.1") {
    return `http://localhost:${API_PORT}`;
  } else {
    return `http://${currentHost}:${API_PORT}`;
  }
};

const BASE = getBaseUrl();
const API_URL_BASE = `${BASE}/api/orders`;

// --- BUYER / VENDOR FUNCTIONS ---

/**
 * Sends order data to the backend for logging and simulated payment.
 */
export async function placeOrderRequest(payload) {
  const res = await axios.post(API_URL_BASE, payload, {
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
}

/**
 * Fetches the currently authenticated buyer's order history.
 */
export async function fetchBuyerOrders() {
  const res = await axios.get(`${API_URL_BASE}/my-orders`, {
    withCredentials: true,
  });
  return res.data;
}

/**
 * Fetch vendor-specific orders
 */
export async function fetchVendorOrders() {
  const res = await axios.get(`${API_URL_BASE}/vendor/my-orders`, {
    withCredentials: true,
  });
  return res.data;
}

/**
 * Fetch vendor notifications
 */
export async function fetchVendorNotifications() {
  const res = await axios.get(`${API_URL_BASE}/vendor/notifications`, {
    withCredentials: true,
  });
  return res.data;
}

export const fetchOrderDetails = async (orderId) => {
  const response = await axios.get(`${API_URL_BASE}/${orderId}`, {
    withCredentials: true,
  });
  return response.data;
};

// --- RIDER FUNCTIONS ---

/**
 * Fetches all available (unaccepted) delivery tasks
 */
export async function fetchAllAvailableTasks() {
  const res = await axios.get(`${API_URL_BASE}/rider/tasks/available`, {
    withCredentials: true,
  });
  return res.data;
}

/**
 * Fetches tasks currently assigned to the logged-in rider.
 */
export async function fetchRiderAcceptedTasks() {
  // <-- CORRECT EXPORT
  const res = await axios.get(`${API_URL_BASE}/rider/tasks/accepted`, {
    withCredentials: true,
  });
  return res.data;
}

/**
 * Rider accepts a task
 */
export async function acceptRiderTask(taskId) {
  const res = await axios.patch(
    `${API_URL_BASE}/rider/tasks/${taskId}/accept`,
    {},
    {
      withCredentials: true,
    }
  );
  return res.data;
}

/**
 * Rider confirms pickup (Vendor Scan)
 */
export async function confirmPickup(orderId, pickupCode) {
  const res = await axios.patch(
    `${API_URL_BASE}/rider/pickup/confirm`,
    { orderId, pickupCode },
    {
      withCredentials: true,
    }
  );
  return res.data;
}

/**
 * Rider confirms final delivery (Buyer Scan)
 */
export async function confirmDelivery(orderId) {
  const res = await axios.patch(
    `${API_URL_BASE}/rider/delivery/confirm`,
    { orderId },
    {
      withCredentials: true,
    }
  );
  return res.data;
}
