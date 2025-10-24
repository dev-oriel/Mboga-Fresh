import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  placeOrder,
  getBuyerOrders,
  getOrderDetailsById,
  getVendorOrders,
  getVendorNotifications,
  updateOrderStatusAndNotifyRider,
  fetchAllAvailableTasks,
  acceptDeliveryTask,
} from "../controllers/order.controller.js";

const router = express.Router();

// Buyer Routes
router.post("/", requireAuth, placeOrder);
router.get("/my-orders", requireAuth, getBuyerOrders);
router.get("/:orderId", requireAuth, getOrderDetailsById);

// Vendor Specific Routes
router.get("/vendor/my-orders", requireAuth, getVendorOrders);
router.get("/vendor/notifications", requireAuth, getVendorNotifications);
router.patch(
  "/vendor/order/:orderId/accept",
  requireAuth,
  updateOrderStatusAndNotifyRider
);

// NEW RIDER ROUTES (Protected)
router.get("/rider/tasks/available", requireAuth, fetchAllAvailableTasks); // List all available jobs
router.patch("/rider/tasks/:taskId/accept", requireAuth, acceptDeliveryTask); // Rider accepts a job

export default router;
