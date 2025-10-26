// backend/routes/order.route.js - MODIFIED

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
  fetchRiderAcceptedTasks,
  confirmPickupByRider,
  confirmDeliveryByRider,
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
  requireRole(["buyer", "admin", "rider"]), // <--- FIX 2: ADDED 'rider' ROLE HERE
  getOrderDetailsById
);

// ------------------------------------
// 2. VENDOR SPECIFIC ROUTES (UNCHANGED)
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
// 3. RIDER SPECIFIC ROUTES (UNCHANGED)
// ------------------------------------
router.get(
  "/rider/tasks/available",
  requireAuth,
  requireRole(["rider"]),
  fetchAllAvailableTasks
);
router.get(
  "/rider/tasks/accepted",
  requireAuth,
  requireRole(["rider"]),
  fetchRiderAcceptedTasks
);
router.patch(
  "/rider/tasks/:taskId/accept",
  requireAuth,
  requireRole(["rider"]),
  acceptDeliveryTask
);

router.patch(
  "/rider/pickup/confirm",
  requireAuth,
  requireRole(["rider"]),
  confirmPickupByRider
);
router.patch(
  "/rider/delivery/confirm",
  requireAuth,
  requireRole(["rider"]),
  confirmDeliveryByRider
);

// ------------------------------------
// 4. ADMIN METRICS ROUTE (UNCHANGED)
// ------------------------------------
router.get(
  "/escrow-balance",
  requireAuth,
  requireRole(["admin"]),
  getTotalEscrowBalance
);

export default router;
