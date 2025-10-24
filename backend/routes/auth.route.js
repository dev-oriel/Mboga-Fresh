import express from "express";
import {
  signup,
  login,
  me,
  logout,
  createAdminAccount,
} from "../controllers/auth.controllers.js";
import { uploadAny } from "../middleware/multerUpload.js";

const router = express.Router();

// Public routes
router.post("/signup", uploadAny, signup);
router.post("/login", login);
router.get("/me", me);
router.post("/logout", logout);

// DEV/ADMIN SETUP ROUTE: Temporarily allows creation of the first admin account
router.post("/setup-admin", createAdminAccount);

export default router;
