// backend/middleware/auth.middleware.js
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = process.env.COOKIE_NAME || "mbogafresh_token";

export const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.[COOKIE_NAME];
    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });

    const payload = jwt.verify(token, SECRET);
    if (!payload?.id)
      return res.status(401).json({ success: false, message: "Invalid token" });

    const user = await User.findById(payload.id).select("-password");
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: "Authentication failed" });
  }
};

export const requireRole =
  (allowed = []) =>
  (req, res, next) => {
    if (!req.user)
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    if (!allowed.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden — insufficient privileges",
      });
    }
    next();
  };
