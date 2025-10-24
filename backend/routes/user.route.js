import express from "express";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import { listUsers, getUserStats } from "../controllers/user.controller.js";
import {
  listAllProducts,
  updateProductStatus,
} from "../controllers/admin.product.controller.js";
// FIX: We need to ensure getTotalEscrowBalance is imported correctly.
// Since it is defined in order.controller.js, we import it from there.
import { getTotalEscrowBalance } from "../controllers/order.controller.js";

const router = express.Router();

// User Management Route (Existing)
router.get("/users", requireAuth, requireRole(["admin"]), listUsers);

// User Statistics Route (Existing)
router.get("/stats", requireAuth, requireRole(["admin"]), getUserStats);

// Product Management Routes (Existing)
router.get("/products", requireAuth, requireRole(["admin"]), listAllProducts);
router.patch(
  "/products/:type/:id/status",
  requireAuth,
  requireRole(["admin"]),
  updateProductStatus
);

// ESCROW METRICS ROUTE (FINAL WORKING ENDPOINT)
router.get(
  "/escrow-balance", // This route is under /api/admin
  requireAuth,
  requireRole(["admin"]),
  getTotalEscrowBalance // <-- Function execution
);

export default router;
