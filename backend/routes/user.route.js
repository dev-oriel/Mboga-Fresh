import express from "express";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import { listUsers, getUserStats } from "../controllers/user.controller.js";
import {
  listAllProducts,
  updateProductStatus,
} from "../controllers/admin.product.controller.js";
import {
  getTotalEscrowBalance,
  listAllOrders,
} from "../controllers/order.controller.js"; // IMPORT listAllOrders

const router = express.Router();

// User and Product Management Routes (Existing)
router.get("/users", requireAuth, requireRole(["admin"]), listUsers);
router.get("/stats", requireAuth, requireRole(["admin"]), getUserStats);
router.get("/products", requireAuth, requireRole(["admin"]), listAllProducts);
router.patch(
  "/products/:type/:id/status",
  requireAuth,
  requireRole(["admin"]),
  updateProductStatus
);

// ORDER MANAGEMENT ROUTE (NEW)
router.get("/orders", requireAuth, requireRole(["admin"]), listAllOrders);

// ESCROW METRICS ROUTE (Existing)
router.get(
  "/escrow-balance",
  requireAuth,
  requireRole(["admin"]),
  getTotalEscrowBalance
);

export default router;
