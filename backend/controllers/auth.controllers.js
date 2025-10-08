import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
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
  const { email, password, role } = req.body;
  
  try {
    if (!email || !password || !role) {
      return res.status(400).json({ 
        success: false, 
        message: "Email, password, and role are required" 
      });
    }

    // For testing without MongoDB - hardcoded test users
    const testUsers = {
      'vendor@test.com': {
        id: 'vendor_123',
        email: 'vendor@test.com',
        name: 'Test Vendor',
        role: 'vendor',
        phone: '+254123456789',
        status: 'active',
        password: 'password123' // In real app, this would be hashed
      },
      'buyer@test.com': {
        id: 'buyer_123',
        email: 'buyer@test.com',
        name: 'Test Buyer',
        role: 'buyer',
        phone: '+254987654321',
        status: 'active',
        password: 'password123'
      }
    };

    const user = testUsers[email];
    if (!user || user.role !== role) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid credentials or role mismatch" 
      });
    }

    // Check password (in real app, use bcrypt.compare)
    if (password !== user.password) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || "test-secret-key",
      { expiresIn: "7d" }
    );

    // Set HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({
      success: true,
      message: "Logout successful"
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};
