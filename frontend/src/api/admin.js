import axios from "axios";

const BASE_URL = `${
  import.meta.env.VITE_API_BASE || "http://localhost:5000"
}/api/admin`;

/**
 * Fetches all products (retail and bulk) for the Admin panel.
 * @param {string} type - 'all', 'retail', or 'bulk'
 * @param {string} q - search query
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
 * @param {string} id - Product ID
 * @param {string} type - 'Retail' or 'Bulk'
 * @param {boolean} isSuspended - true to suspend, false to activate
 */
export const updateProductStatus = async (id, type, isSuspended) => {
  // Note: The URL parameter 'type' should be lowercase for the backend path
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

// You can add other admin API functions here (e.g., fetchUsers, resolveDispute)
// For now, listAllProducts is enough for ProductManagement.jsx
