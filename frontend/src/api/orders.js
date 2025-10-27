import axios from "axios";

// Dynamic Base URL Resolver
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
const API_URL_BASE = `${BASE}/api/orders`;

// --- BUYER / VENDOR FUNCTIONS (Remains Unchanged) ---

/**
 * Sends order data to the backend, which now INITIATES STK PUSH.
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
 * Checks the payment status of an order via its ID.
 */
export const checkPaymentStatus = async (orderId) => {
  const res = await axios.get(`${API_URL_BASE}/status/${orderId}`, {
    withCredentials: true,
  });
  // Returns { paymentStatus: 'Paid'/'Pending'/'Failed', failureReason: '...' }
  return res.data;
};

// --- VENDOR FUNCTIONS (Remains Unchanged) ---

export async function fetchVendorOrders() {
  const res = await axios.get(`${API_URL_BASE}/vendor/my-orders`, {
    withCredentials: true,
  });
  return res.data;
}

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

// --- RIDER FUNCTIONS (Finalizing the confirmation logic) ---

export async function fetchAllAvailableTasks() {
  const res = await axios.get(`${API_URL_BASE}/rider/tasks/available`, {
    withCredentials: true,
  });
  return res.data;
}

export async function fetchRiderAcceptedTasks() {
  const res = await axios.get(`${API_URL_BASE}/rider/tasks/accepted`, {
    withCredentials: true,
  });
  return res.data;
}

export async function acceptRiderTask(taskId) {
  const res = await axios.patch(
    `${API_URL_BASE}/rider/tasks/${taskId}/accept`,
    {},
    { withCredentials: true }
  );
  return res.data;
}

/**
 * Confirms pickup using the Vendor-provided pickup code.
 */
export async function confirmPickup(orderId, pickupCode) {
  const res = await axios.patch(
    `${API_URL_BASE}/rider/pickup/confirm`,
    { orderId, pickupCode },
    { withCredentials: true }
  );
  return res.data;
}

/**
 * Confirms final delivery using the Buyer's secret code.
 */
export async function confirmDelivery(orderId, buyerCode) {
  const res = await axios.patch(
    `${API_URL_BASE}/rider/delivery/confirm`,
    { orderId, buyerCode }, // CRITICAL: Pass buyerCode
    { withCredentials: true }
  );
  return res.data;
}
