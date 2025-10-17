// backend/routes/profile.routes.js
import express from "express";
import { User } from "../models/user.model.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

// Get user profile (no password)
router.get("/", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    return res.json(user);
  } catch (err) {
    console.error("Profile GET error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch profile" });
  }
});

// Update profile (name, avatar, email, phone, address)
// Returns the updated user (password removed)
router.put("/", requireAuth, async (req, res) => {
  const { name, avatar, email, phone, address } = req.body;

  try {
    const updates = {};
    if (typeof name !== "undefined") updates.name = name;
    if (typeof avatar !== "undefined") updates.avatar = avatar;
    if (typeof email !== "undefined") updates.email = email;
    if (typeof phone !== "undefined") updates.phone = phone;

    let user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
    }).select("-password");

    // If an `address` convenience field is provided, upsert it into addresses as the primary address.
    if (typeof address !== "undefined") {
      // Ensure addresses array exists
      user.addresses = user.addresses || [];

      // Find existing primary address
      const primaryIndex = user.addresses.findIndex((a) => a.isPrimary);
      if (primaryIndex >= 0) {
        user.addresses[primaryIndex].details = address;
      } else {
        user.addresses.unshift({
          label: "Primary",
          details: address,
          isPrimary: true,
        });
      }

      await user.save();
      user = await User.findById(req.user.id).select("-password");
    }

    return res.json(user);
  } catch (err) {
    console.error("Profile update error:", err);
    return res
      .status(400)
      .json({ success: false, message: "Failed to update profile" });
  }
});

// Add / update addresses array
router.put("/addresses", requireAuth, async (req, res) => {
  try {
    const { addresses } = req.body;
    const user = await User.findById(req.user.id);
    user.addresses = addresses;
    await user.save();
    return res.json(user.addresses);
  } catch (err) {
    console.error("Addresses update error:", err);
    return res
      .status(400)
      .json({ success: false, message: "Failed to update addresses" });
  }
});

// Add / update payment methods array
router.put("/payment-methods", requireAuth, async (req, res) => {
  try {
    const { paymentMethods } = req.body;
    const user = await User.findById(req.user.id);
    user.paymentMethods = paymentMethods;
    await user.save();
    return res.json(user.paymentMethods);
  } catch (err) {
    console.error("Payment methods update error:", err);
    return res
      .status(400)
      .json({ success: false, message: "Failed to update payment methods" });
  }
});

export default router;
