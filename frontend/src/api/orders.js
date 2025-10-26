// frontend/src/api/orders.js

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

// --- BUYER / VENDOR FUNCTIONS ---

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
 * NOTE: This mocks the polling endpoint. The actual implementation relies on the Mpesa callback.
 */
export const checkPaymentStatus = async (orderId) => {
  // In a real system, this would call a dedicated backend route to check the DB.
  await new Promise((r) => setTimeout(r, 1000));
  return { status: "Paid" };
};

// --- RIDER FUNCTIONS ---

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
    {
      withCredentials: true,
    }
  );
  return res.data;
}

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

export async function confirmDelivery(orderId, buyerCode) {
  // <-- FIX: Add buyerCode parameter
  const res = await axios.patch(
    `${API_URL_BASE}/rider/delivery/confirm`,
    { orderId, buyerCode }, // <-- FIX: Pass buyerCode in body
    {
      withCredentials: true,
    }
  );
  return res.data;
}
