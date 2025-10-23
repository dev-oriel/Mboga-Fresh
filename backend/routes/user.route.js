import express from "express";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import { listUsers, getUserStats } from "../controllers/user.controller.js";
import {
  listAllProducts,
  updateProductStatus,
} from "../controllers/admin.product.controller.js";

const router = express.Router();

// User Management Route (Existing)
router.get("/users", requireAuth, requireRole(["admin"]), listUsers);

// User Statistics Route
router.get("/stats", requireAuth, requireRole(["admin"]), getUserStats);

// Product Management Route
router.get("/products", requireAuth, requireRole(["admin"]), listAllProducts);
router.patch(
  "/products/:type/:id/status",
  requireAuth,
  requireRole(["admin"]),
  updateProductStatus
);

export default router;
