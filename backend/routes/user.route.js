import express from "express";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import { listUsers } from "../controllers/user.controller.js";

const router = express.Router();

// Only accessible by Admin role, requires authentication
router.get("/users", requireAuth, requireRole(["admin"]), listUsers);

export default router;
