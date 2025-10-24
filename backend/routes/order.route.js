// backend/routes/order.route.js - COMPLETE

import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  placeOrder,
  getBuyerOrders,
  getOrderDetailsById,
} from "../controllers/order.controller.js";

const router = express.Router();

// Route to place a new order (requires authentication)
router.post("/", requireAuth, placeOrder);

// Route to get a buyer's entire order history
router.get("/my-orders", requireAuth, getBuyerOrders);

// Route to get details for a specific order by ID (used for OrderDetails page)
router.get("/:orderId", requireAuth, getOrderDetailsById);

export default router;
