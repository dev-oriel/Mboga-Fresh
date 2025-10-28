import express from "express";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";

import {
  placeOrder,
  getBuyerOrders,
  getOrderDetailsById,
  getVendorOrders,
  updateOrderStatusAndNotifyRider,
  checkOrderStatus,
} from "../controllers/order.controller.js";

import {
  fetchAllAvailableTasks,
  fetchRiderAcceptedTasks,
  acceptDeliveryTask,
  confirmPickupByRider,
  confirmDeliveryByRider,
  getRiderEarningsAndHistory,
} from "../controllers/rider.controller.js";

import {
  markNotificationAsReadDb,
  deleteReadNotificationsDb,
  getNotifications,
} from "../controllers/notification.controller.js";

import { getTotalEscrowBalance } from "../controllers/admin.controller.js";

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
  requireRole(["buyer", "admin", "rider"]),
  getOrderDetailsById
);

// ------------------------------------
// 2. VENDOR SPECIFIC ROUTES (Order Management)
// ------------------------------------
router.get(
  "/vendor/my-orders",
  requireAuth,
  requireRole(["vendor", "admin"]),
  getVendorOrders
);

router.patch(
  "/vendor/order/:orderId/accept",
  requireAuth,
  requireRole(["vendor"]),
  updateOrderStatusAndNotifyRider
);

// ------------------------------------
// 3. NOTIFICATION MANAGEMENT ROUTES (NEW SECTION)
// ------------------------------------

router.get(
  "/notifications",
  requireAuth,
  requireRole(["buyer", "vendor", "rider", "admin"]),
  getNotifications
);

router.patch(
  "/notifications/:id/read",
  requireAuth,
  requireRole(["vendor", "rider", "admin", "buyer"]),
  markNotificationAsReadDb
);

router.delete(
  "/notifications/read",
  requireAuth,
  requireRole(["vendor", "rider", "admin", "buyer"]),
  deleteReadNotificationsDb
);

// ------------------------------------
// 4. RIDER SPECIFIC ROUTES
// ------------------------------------

router.get(
  "/rider/stats",
  requireAuth,
  requireRole(["rider"]),
  getRiderEarningsAndHistory
);

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

router.get(
  "/status/:orderId",
  requireAuth,
  requireRole(["buyer", "admin"]),
  checkOrderStatus
);

// ------------------------------------
// 5. ADMIN METRICS ROUTE
// ------------------------------------
router.get(
  "/escrow-balance",
  requireAuth,
  requireRole(["admin"]),
  getTotalEscrowBalance
);

export default router;
