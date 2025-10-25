// frontend/src/api/orders.js

import axios from "axios";

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
const API_URL_BASE = `${BASE}/api/orders`;

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

// NEW: Fetch vendor-specific orders
export async function fetchVendorOrders() {
  const res = await axios.get(`${API_URL_BASE}/vendor/my-orders`, {
    withCredentials: true,
  });
  return res.data;
}

// NEW: Fetch vendor notifications
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
