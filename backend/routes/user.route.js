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
  listAllTransactions,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/users", requireAuth, requireRole(["admin"]), listUsers);
router.get("/stats", requireAuth, requireRole(["admin"]), getUserStats);
router.get("/products", requireAuth, requireRole(["admin"]), listAllProducts);
router.patch(
  "/products/:type/:id/status",
  requireAuth,
  requireRole(["admin"]),
  updateProductStatus
);

router.get("/orders", requireAuth, requireRole(["admin"]), listAllOrders);

router.get(
  "/transactions",
  requireAuth,
  requireRole(["admin"]),
  listAllTransactions
);
router.get(
  "/escrow-balance",
  requireAuth,
  requireRole(["admin"]),
  getTotalEscrowBalance
);
export default router;
