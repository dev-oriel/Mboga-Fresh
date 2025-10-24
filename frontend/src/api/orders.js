// frontend/src/api/orders.js - CORRECTED (Removes axiosInstance dependency)

import axios from "axios"; // <-- Directly import base axios

const API_URL_BASE = `${
  import.meta.env.VITE_API_BASE || "http://localhost:5000"
}/api/orders`;

/**
 * Sends order data to the backend for logging and simulated payment.
 */
export async function placeOrderRequest(payload) {
  const res = await axios.post(API_URL_BASE, payload, {
    // CRUCIAL: Must include credentials for session/cookie auth
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
    withCredentials: true, // CRUCIAL
  });
  return res.data;
}

/**
 * Fetches details for a single order
 */
export const fetchOrderDetails = async (orderId) => {
  const response = await axios.get(`${API_URL_BASE}/${orderId}`, {
    withCredentials: true, // CRUCIAL
  });
  return response.data;
};
