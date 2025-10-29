import axios from "axios";

const API_URL_BASE = "/api/orders";

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

// --- NEW VENDOR FUNCTION ---
/**
 * Fetches the delivery task (for pickupCode) for a specific order.
 * (Vendor-only)
 */
export async function fetchVendorTask(orderId) {
  const res = await axios.get(`${API_URL_BASE}/vendor/task/${orderId}`, {
    withCredentials: true,
  });
  return res.data; // Returns { pickupCode, status }
}
// --- END NEW FUNCTION ---

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
export async function markNotificationAsRead(notificationId) {
  // Hitting the PATCH /api/orders/notifications/:id/read endpoint
  const url = `${API_URL_BASE}/notifications/${notificationId}/read`;
  const res = await axios.patch(url, {}, { withCredentials: true });
  return res.data;
}
export async function fetchRiderStats() {
  const res = await axios.get(`${API_URL_BASE}/rider/stats`, {
    withCredentials: true,
  });
  return res.data;
}
export async function deleteReadNotifications() {
  // Hitting the DELETE /api/orders/notifications/read endpoint
  const url = `${API_URL_BASE}/notifications/read`;
  const res = await axios.delete(url, { withCredentials: true });
  return res.data;
}
