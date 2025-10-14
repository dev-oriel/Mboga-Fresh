// backend/index.js
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import productsRoute from "./routes/products.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// middlewares
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS - dev-friendly: set CLIENT_URL in .env to your front-end URL when ready
const client = process.env.CLIENT_URL || "*";
app.use(cors({ origin: client === "*" ? "*" : client, credentials: true }));

// serve uploads (images)
const uploadsPath = path.join(process.cwd(), "backend", "uploads");
app.use("/uploads", express.static(uploadsPath));

// routes
app.get("/", (req, res) => {
  res.send("Hello world kenya");
});
app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoute);

// connect DB then start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
