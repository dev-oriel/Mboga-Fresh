// backend/middleware/auth.middleware.js
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const secret = process.env.JWT_SECRET;

export const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.[process.env.COOKIE_NAME || "mbogafresh_token"];
    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });

    const payload = jwt.verify(token, secret);
    if (!payload?.id)
      return res.status(401).json({ success: false, message: "Invalid token" });

    const user = await User.findById(payload.id).select(
      "-password -VerificationToken -resetPasswordToken"
    );
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
  (roles = []) =>
  (req, res, next) => {
    if (!req.user)
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    if (!roles.includes(req.user.role))
      return res.status(403).json({ success: false, message: "Forbidden" });
    next();
  };
