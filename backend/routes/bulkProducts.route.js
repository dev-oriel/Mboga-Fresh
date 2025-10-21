// backend/routes/bulkProducts.route.js
import express from "express";
import { uploadAny } from "../middleware/multerUpload.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import {
  list,
  getOne,
  createOne,
  updateOne,
  removeOne,
} from "../controllers/bulkProducts.controller.js";

const router = express.Router();

// Public list (but supports ownerId query)
router.get("/", list);
router.get("/:id", getOne);

// Protected create/update/delete — only authenticated users (farmers) or admin
// Use uploadAny to allow file upload; multer.any() will place file on req.file (depending on implementation)
router.post(
  "/",
  requireAuth,
  requireRole(["farmer", "admin"]),
  uploadAny,
  createOne
);
router.put(
  "/:id",
  requireAuth,
  requireRole(["farmer", "admin"]),
  uploadAny,
  updateOne
);
router.delete("/:id", requireAuth, requireRole(["farmer", "admin"]), removeOne);

export default router;
