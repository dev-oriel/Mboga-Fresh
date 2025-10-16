// backend/controllers/auth.controllers.js
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
// Use the environment cookie name (keeps things consistent)
const COOKIE_NAME = process.env.COOKIE_NAME || "mbogafresh_token";

/**
 * Cookie options:
 * - In production we want secure cookies (https)
 * - In development we keep secure:false so localhost HTTP still receives cookies.
 * - sameSite: 'lax' is compatible for many dev scenarios. If you use cross-site XHR and cookies
 *   are not being sent, consider using a Vite proxy (recommended) or adjust to sameSite:'none'
 *   with secure:true when running over HTTPS.
 */
const COOKIE_OPTIONS = (req) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // only true in prod
  sameSite: "lax",
  maxAge: parseDurationToMs(JWT_EXPIRES_IN),
  path: "/",
});

// small helper to convert '7d' etc -> ms (supports 'd' days, 'h' hours, 'm' minutes)
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
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });
    }

    const user = await User.findOne({ email }).lean();
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    if (user.role !== role) {
      return res.status(403).json({
        success: false,
        message: `Invalid role. This account is registered as '${user.role}'.`,
      });
    }

    const valid = await bcryptjs.compare(password, user.password);
    if (!valid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // create token
    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // set cookie using the consistent COOKIE_NAME and options
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
