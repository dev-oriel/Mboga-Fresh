import express from "express";

import { signup, login } from "../controllers/auth.controllers.js";

const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);
router.get("/login", login);
export default router;
