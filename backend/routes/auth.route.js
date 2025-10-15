// backend/routes/auth.route.js
import express from "express";
import { signup, login } from "../controllers/auth.controllers.js";
import { uploadAny } from "../middleware/multerUpload.js";

const router = express.Router();

// Use uploadAny middleware to allow file uploads from vendor/rider signups.
// If you don't want upload support in signup, remove uploadAny and accept only JSON.
router.post("/signup", uploadAny, signup);
router.post("/login", login);
export default router;
