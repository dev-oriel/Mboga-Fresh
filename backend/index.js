import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import productsRoute from "./routes/products.route.js";
import profileRoutes from "./routes/profile.routes.js";
import bulkProductsRoute from "./routes/bulkProducts.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

// Serve static uploads
const uploadsPath = path.join(process.cwd(), "backend", "uploads");
app.use("/uploads", express.static(uploadsPath));

// Routes
app.get("/", (req, res) => res.send("Hello world kenya"));
app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoute);
app.use("/api/profile", profileRoutes);
app.use("/api/bulk-products", bulkProductsRoute);

// Connect DB and start server
connectDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
