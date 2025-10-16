import express from "express";
import { User } from "../models/user.model.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

// Get user profile
router.get("/", requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user);
});

// Update profile (name, avatar)
router.put("/", requireAuth, async (req, res) => {
  const { name, avatar } = req.body;
  const updated = await User.findByIdAndUpdate(
    req.user.id,
    { name, avatar },
    { new: true }
  );
  res.json(updated);
});

// Add / update address
router.put("/addresses", requireAuth, async (req, res) => {
  const { addresses } = req.body;
  const user = await User.findById(req.user.id);
  user.addresses = addresses;
  await user.save();
  res.json(user.addresses);
});

// Add / update payment methods
router.put("/payment-methods", requireAuth, async (req, res) => {
  const { paymentMethods } = req.body;
  const user = await User.findById(req.user.id);
  user.paymentMethods = paymentMethods;
  await user.save();
  res.json(user.paymentMethods);
});

export default router;
