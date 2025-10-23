// backend/routes/order.route.js

import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { placeOrder, getBuyerOrders } from "../controllers/order.controller.js";

const router = express.Router();

// Route to place a new order (requires authentication)
router.post("/", requireAuth, placeOrder);

// Route to get a buyer's order history
router.get("/my-orders", requireAuth, getBuyerOrders);

export default router;
