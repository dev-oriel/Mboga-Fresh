// backend/routes/products.route.js
import express from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import {
  list,
  getOne,
  createOne,
  updateOne,
  removeOne,
} from "../controllers/products.controller.js";

const router = express.Router();

// ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "backend", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});

const allowedMime = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (allowedMime.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only image files are allowed"), false);
  },
});

router.get("/", list);
router.get("/:id", getOne);
router.post("/", upload.single("image"), createOne);
router.put("/:id", upload.single("image"), updateOne);
router.delete("/:id", removeOne);

export default router;
