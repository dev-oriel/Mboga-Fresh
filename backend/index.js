import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";

const app = express();
const PORT = process.env.PORT || 5000;
dotenv.config();

app.use(express.json()); // allow parse for incoming requests : req.body
app.use(cookieParser()); // allow us to parse incoming cookies

app.get("/", (req, res) => {
  res.send("Hello world kenya");
});

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log(`server is running on http://localhost:${PORT} `);
});
