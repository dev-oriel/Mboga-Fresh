// backend/routes/payment.route.js (NEW FILE)

import express from "express";
import { handleMpesaCallback } from "../controllers/order.controller.js"; // Assuming handleMpesaCallback is moved here
import { requireAuth } from "../middleware/auth.middleware.js"; // Reusing auth for potential future routes

const router = express.Router();

// Public endpoint required by Safaricom API for payment confirmation
router.post("/mpesa/callback", handleMpesaCallback);

// Future endpoints for polling status or token generation could go here
// router.get('/mpesa/status/:checkoutId', requireAuth, checkPaymentStatus);

export default router;
