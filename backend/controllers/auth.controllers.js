// backend/controllers/auth.controllers.js
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import { User } from "../models/user.model.js";
import VendorProfile from "../models/vendorProfile.model.js";
import FarmerProfile from "../models/farmerProfile.model.js";
import RiderProfile from "../models/riderProfile.model.js";
import { schemasByRole } from "../validators/signup.validators.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";
const COOKIE_NAME = process.env.COOKIE_NAME || "mbogafresh_token";
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || "15m";

/** helper to read uploaded file info */
const uploadedFilesInfo = (req) => {
  if (!req.files || !Array.isArray(req.files)) return [];
  return req.files.map((f) => ({
    path: `/uploads/${f.filename}`,
    originalName: f.originalname,
  }));
};

export const signup = async (req, res) => {
  try {
    // Accept JSON bodies and multipart/form-data (multer will populate req.body & req.files)
    const body = req.body || {};
    // default role: buyer if not provided by client
    const roleRequested = (body.role || "buyer").toLowerCase();
    if (!["buyer", "vendor", "farmer", "rider"].includes(roleRequested)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    // validate input with Joi schema for the role
    const schema = schemasByRole[roleRequested];
    const { error, value } = schema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Validation failed",
          details: error.details,
        });
    }

    // uniqueness checks
    if (await User.findOne({ email: value.email }))
      return res
        .status(400)
        .json({ success: false, message: "Email already in use" });
    if (await User.findOne({ phone: value.phone }))
      return res
        .status(400)
        .json({ success: false, message: "Phone already in use" });

    const hashed = await bcryptjs.hash(value.password, 10);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const status = roleRequested === "buyer" ? "active" : "pending";
    const user = await User.create({
      email: value.email,
      password: hashed,
      phone: value.phone,
      name: value.name,
      role: roleRequested,
      status,
      VerificationToken: verificationToken,
      VerificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    // create role profile for non-buyers
    const files = uploadedFilesInfo(req);
    if (roleRequested === "vendor") {
      await VendorProfile.create({
        user: user._id,
        businessName: value.businessName,
        ownerName: value.ownerName,
        location: value.location,
        docs: files,
      });
    } else if (roleRequested === "farmer") {
      await FarmerProfile.create({
        user: user._id,
        farmName: value.farmName,
        contactPerson: value.contactPerson,
        location: value.location,
        produceTypes: value.produceTypes || [],
        docs: files,
      });
    } else if (roleRequested === "rider") {
      await RiderProfile.create({
        user: user._id,
        idNumber: value.idNumber,
        vehicleType: value.vehicleType,
        vehicleName: value.vehicleName || "",
        idDocs: files,
      });
    }

    // do NOT auto-login vendor/farmer/rider (pending verification). Buyers are active.
    const safe = user.toObject();
    delete safe.password;
    delete safe.VerificationToken;
    return res.status(201).json({
      success: true,
      message:
        roleRequested === "buyer"
          ? "Account created"
          : "Account created (pending verification)",
      user: safe,
    });
  } catch (err) {
    console.error("signup error:", err);
    return res.status(500).json({ success: false, message: "Signup failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

    const ok = await bcryptjs.compare(password, user.password);
    if (!ok)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

    // optionally prevent login for pending vendor/farmer/rider, but here we allow login but keep status checks on protected endpoints
    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES,
    });
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    const safe = user.toObject();
    delete safe.password;
    return res.json({ success: true, message: "Logged in", user: safe });
  } catch (err) {
    console.error("login error", err);
    return res.status(500).json({ success: false, message: "Login failed" });
  }
};
