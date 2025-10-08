import bcryptjs from "bcryptjs";
import dotenv from "dotenv";

import { User } from "../models/user.model.js";

dotenv.config();

export const signup = async (req, res) => {
  const { email, password, name, phone, role } = req.body;
  try {
    if (!email || !password || !name || !phone || !role) {
      throw new Error("All fields are required");
    }

    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "user already exist" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const VerificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const user = new User({
      email,
      phone,
      role,
      password: hashedPassword,
      name,
      VerificationToken,
      VerificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    await user.save();

    res.status(201).json({
      sucess: true,
      message: "User Created successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
export const login = async (req, res) => {
  res.send("login route");
};
