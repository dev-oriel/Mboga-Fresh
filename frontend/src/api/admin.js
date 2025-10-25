// frontend/src/api/admin.js

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
const BASE_URL = `${BASE}/api/admin`;

/**
 * Fetches all products (retail and bulk) for the Admin panel.
 */
export const fetchAdminProducts = async (type = "all", q = "") => {
  const response = await axios.get(`${BASE_URL}/products`, {
    params: { type, q },
    withCredentials: true,
  });
  return response.data;
};

/**
 * Updates the status (Suspended/In Stock) of a specific product.
 */
export const updateProductStatus = async (id, type, isSuspended) => {
  const urlType = type.toLowerCase();

  const response = await axios.patch(
    `${BASE_URL}/products/${urlType}/${id}/status`,
    {
      isSuspended,
    },
    {
      withCredentials: true,
    }
  );
  return response.data;
};
