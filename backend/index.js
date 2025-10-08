import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import vendorRoutes from "./routes/vendor.route.js";

const app = express();
const PORT = process.env.PORT || 5000;
dotenv.config();

// CORS configuration for frontend-backend communication
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"], // Vite dev server ports
  credentials: true
}));

app.use(express.json()); // allow parse for incoming requests : req.body
app.use(cookieParser()); // allow us to parse incoming cookies

app.get("/", (req, res) => {
  res.send("Hello world kenya");
});

app.use("/api/auth", authRoutes);
app.use("/api/vendor", vendorRoutes);

app.listen(PORT, () => {
  // connectDB(); // Commented out for testing without MongoDB
  console.log(`server is running on http://localhost:${PORT} `);
  console.log(`Vendor API available at: http://localhost:${PORT}/api/vendor/vendor_123/dashboard`);
  console.log(`\n🔐 Test Credentials:`);
  console.log(`   Vendor: vendor@test.com / password123`);
  console.log(`   Buyer:  buyer@test.com / password123`);
});
