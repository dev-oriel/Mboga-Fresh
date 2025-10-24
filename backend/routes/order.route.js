// backend/routes/order.route.js - FINAL AND SECURE

import express from "express";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import {
  placeOrder,
  getBuyerOrders,
  getOrderDetailsById,
  getVendorOrders,
  getVendorNotifications,
  updateOrderStatusAndNotifyRider,
  fetchAllAvailableTasks,
  getTotalEscrowBalance, 
  acceptDeliveryTask,
} from "../controllers/order.controller.js";

const router = express.Router();

// ------------------------------------
// 1. BUYER ROUTES
// ------------------------------------
router.post("/", requireAuth, requireRole(["buyer"]), placeOrder);
router.get(
  "/my-orders",
  requireAuth,
  requireRole(["buyer", "admin"]),
  getBuyerOrders
);
router.get(
  "/:orderId",
  requireAuth,
  requireRole(["buyer", "admin"]),
  getOrderDetailsById
);

// ------------------------------------
// 2. VENDOR SPECIFIC ROUTES
// ------------------------------------
router.get(
  "/vendor/my-orders",
  requireAuth,
  requireRole(["vendor", "admin"]),
  getVendorOrders
);
router.get(
  "/vendor/notifications",
  requireAuth,
  requireRole(["vendor", "admin"]),
  getVendorNotifications
);

router.patch(
  "/vendor/order/:orderId/accept",
  requireAuth,
  requireRole(["vendor"]),
  updateOrderStatusAndNotifyRider
);

// ------------------------------------
// 3. RIDER SPECIFIC ROUTES
// ------------------------------------
router.get(
  "/rider/tasks/available",
  requireAuth,
  requireRole(["rider"]),
  fetchAllAvailableTasks
);
router.patch(
  "/rider/tasks/:taskId/accept",
  requireAuth,
  requireRole(["rider"]),
  acceptDeliveryTask
);

// ------------------------------------
// REMOVED: ADMIN METRICS ROUTE
// This route belongs ONLY in user.route.js (mounted under /api/admin)
// ------------------------------------

export default router;
