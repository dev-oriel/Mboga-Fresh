import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, unique: true, index: true },
    role: {
      type: String,
      enum: ["buyer", "vendor", "farmer", "rider", "admin"],
      default: "buyer",
    },
    name: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "suspended", "pending"],
      default: "pending",
    },
    isVerified: { type: Boolean, default: false },
    VerificationToken: String,
    VerificationTokenExpiresAt: Date,
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
