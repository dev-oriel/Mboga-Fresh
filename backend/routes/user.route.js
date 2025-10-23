import express from "express";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import { listUsers } from "../controllers/user.controller.js";
import {
  listAllProducts,
  updateProductStatus,
} from "../controllers/admin.product.controller.js"; // <-- NEW IMPORT updateProductStatus

const router = express.Router();

// User Management Route (Existing)
router.get("/users", requireAuth, requireRole(["admin"]), listUsers);

// Product Management Route (NEW)
router.get("/products", requireAuth, requireRole(["admin"]), listAllProducts);
router.patch(
  "/products/:type/:id/status",
  requireAuth,
  requireRole(["admin"]),
  updateProductStatus
); // <-- NEW PATCH/PUT ROUTE

export default router;
