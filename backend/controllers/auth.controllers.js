// backend/controllers/auth.controllers.js
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const COOKIE_NAME = "token";
const COOKIE_OPTIONS = (req) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", 
  sameSite: "lax",
  maxAge: parseDurationToMs(JWT_EXPIRES_IN),
  path: "/",
});

// small helper to convert '7d' etc -> ms (supports 'd' days, 'h' hours, default ms number)
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
        .json({ success: false, message: "user already exist" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const VerificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const user = new User({
      email,
      phone,
      role,
      password: hashedPassword,
      name,
      VerificationToken,
      VerificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "User Created successfully",
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

    // Prevent role spoofing: requested role must match stored role
    if (user.role !== role) {
      return res.status(403).json({
        success: false,
        message: `Invalid role. This account is registered as '${user.role}'.`,
      });
    }

    // password compare
    const valid = await bcryptjs.compare(password, user.password);
    if (!valid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // create token
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
    const token = req.cookies?.token;
    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });

    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      // invalid token -> clear cookie
      res.clearCookie(COOKIE_NAME);
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
  // clear cookie
  res.clearCookie(COOKIE_NAME, { path: "/" });
  res.json({ success: true, message: "Logged out" });
};
