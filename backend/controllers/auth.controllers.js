import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const COOKIE_NAME = process.env.COOKIE_NAME || "mbogafresh_token";

const COOKIE_OPTIONS = (req) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // only true in prod
  sameSite: "lax",
  maxAge: parseDurationToMs(JWT_EXPIRES_IN),
  path: "/",
});
function getRoleAvatarUrl(role) {
  const roleKey = (role || "unknown").toLowerCase();
  const map = {
    buyer:
      "https://img.icons8.com/material-outlined/96/00A85E/shopping-basket.png",
    vendor: "https://img.icons8.com/material-outlined/96/00A85E/shop.png",
    farmer:
      "https://img.icons8.com/material-outlined/96/00A85E/potted-plant.png",
    rider: "https://img.icons8.com/material-outlined/96/00A85E/motorcycle.png",
    admin:
      "https://img.icons8.com/material-outlined/96/00A85E/admin-settings-male.png",
    unknown: "https://img.icons8.com/material-outlined/96/00A85E/user.png",
  };
  return map[roleKey] || map.unknown;
}

function parseDurationToMs(value) {
  if (!value) return undefined;
  if (typeof value === "number") return value;
  const match = /^(\d+)([dhm])$/.exec(value);
  if (!match) return undefined;
  const n = Number(match[1]);
  const unit = match[2];
  if (unit === "d") return n * 24 * 60 * 60 * 1000;
  if (unit === "h") return n * 60 * 60 * 1000;
  if (unit === "m") return n * 60 * 1000;
  return undefined;
}

export const signup = async (req, res) => {
  const { email, password, name, phone, role } = req.body;
  try {
    if (!email || !password || !name || !phone || !role) {
      throw new Error("All fields are required");
    }

    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const VerificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // For development convenience we mark new users active so "requireAuth" won't block them.
    // In production you may want 'pending' and an email verification step.
    const user = new User({
      email,
      phone,
      role,
      password: hashedPassword,
      name,
      VerificationToken,
      VerificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
      status: process.env.NODE_ENV === "production" ? "pending" : "active",
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    // We explicitly exclude 'role' from destructuring, as we will find the user regardless of role.
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" }); // MODIFIED MESSAGE
    }

    // 1. Find user by email (regardless of role)
    const user = await User.findOne({ email }).lean();
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // 2. Validate password
    const valid = await bcryptjs.compare(password, user.password);
    if (!valid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // 3. REMOVED: Previous code had a block to check if the provided role matched the user's role.
    // We are now REMOVING this role-specific check to allow any user to log in.

    // 4. Create token with the user's *actual* role from the database
    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // set cookie
    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS(req));

    // don't send password back
    const { password: _p, ...userSafe } = user;
    return res.json({ success: true, message: "Logged in", user: userSafe });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Login failed" });
  }
};

export const me = async (req, res) => {
  try {
    const token = req.cookies?.[COOKIE_NAME];
    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });

    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      // invalid token -> clear cookie using COOKIE_NAME
      res.clearCookie(COOKIE_NAME, { path: "/" });
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const user = await User.findById(payload.id).lean();
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const { password: _p, ...userSafe } = user;
    res.json({ success: true, user: userSafe });
  } catch (err) {
    console.error("me error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch user" });
  }
};

export const logout = async (req, res) => {
  const COOKIE_NAME_LOCAL = process.env.COOKIE_NAME || COOKIE_NAME;
  res.clearCookie(COOKIE_NAME_LOCAL, { path: "/" });
  res.json({ success: true, message: "Logged out" });
};

export const createAdminAccount = async (req, res) => {
  const { email, password, name = "Admin", phone = "0000000000" } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    // Security Check 1: Do not allow creation if an admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      return res
        .status(403)
        .json({ success: false, message: "An admin account already exists." });
    }

    // Security Check 2: Do not allow creation if user already exists
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res.status(400).json({
        success: false,
        message: "A user account with this email already exists.",
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const admin = new User({
      email,
      phone,
      role: "admin",
      password: hashedPassword,
      name,
      status: "active",
      isVerified: true,
    });

    await admin.save();

    res.status(201).json({
      success: true,
      message: `Admin account '${admin.email}' created successfully.`,
    });
  } catch (error) {
    console.error("Admin account creation failed:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create admin account." });
  }
};
