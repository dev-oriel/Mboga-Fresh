import axios from "axios";

const BASE_URL = `${
  import.meta.env.VITE_API_BASE || "http://localhost:5000"
}/api/orders`;

/**
 * Sends order data to the backend for logging and simulated payment.
 * @param {object} payload - { items: [{product, quantity}], shippingAddress: {...} }
 */
export async function placeOrderRequest(payload) {
  const res = await axios.post(BASE_URL, payload, {
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
}

/**
 * Fetches the currently authenticated buyer's order history.
 */
export async function fetchBuyerOrders() {
  const res = await axios.get(`${BASE_URL}/my-orders`, {
    withCredentials: true,
  });
  return res.data;
}
