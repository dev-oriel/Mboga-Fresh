import express from "express";

import {
  login,
  logout,
  signup,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
} from "../controllers/auth.controllers.js";

const router = express.Router();
router.post("/signup", signup);