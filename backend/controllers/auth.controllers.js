import bcryptjs from "bcryptjs";
import crypto from "crypto";
import dotenv from "dotenv";

import { User } from "../models/user.model.js";

dotenv.config();

export const signup = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    if (!email || !password || !name) {
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
      password: hashedPassword,
      name,
      VerificationToken,
      VerificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    await user.save();
    // jwt
    generateTokenAndSetCookie(res, user._id);

    sendVerificationEmail(user.email, VerificationToken);

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