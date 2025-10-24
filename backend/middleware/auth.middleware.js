import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = process.env.COOKIE_NAME || "mbogafresh_token";

// Verify JWT token and attach user to request
export const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.[COOKIE_NAME];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }

    const payload = jwt.verify(token, SECRET);
    if (!payload?.id) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const user = await User.findById(payload.id).select("-password");
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    // Development-friendly: allow 'pending' while developing, but still block 'suspended'.
    // In production require 'active' for stricter controls.
    if (user.status === "suspended") {
      return res
        .status(403)
        .json({ success: false, message: "Account inactive or suspended" });
    }

    if (process.env.NODE_ENV === "production" && user.status !== "active") {
      return res
        .status(403)
        .json({ success: false, message: "Account inactive or suspended" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err?.message || err);
    return res
      .status(401)
      .json({ success: false, message: "Authentication failed" });
  }
};

// Role-based access control middleware
export const requireRole =
  (allowedRoles = []) =>
  (req, res, next) => {
    if (!req.user)
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });

    if (!allowedRoles.includes(req.user.role))
      return res.status(403).json({
        success: false,
        message: "Forbidden — insufficient privileges",
      });

    next();
  };
