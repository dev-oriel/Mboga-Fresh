import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
  label: { type: String, required: true },
  details: { type: String, required: true },
  isPrimary: { type: Boolean, default: false },
});

const PaymentMethodSchema = new mongoose.Schema({
  type: { type: String, default: "M-Pesa" },
  number: { type: String, required: true },
  primary: { type: Boolean, default: false },
});

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
    avatar: { type: String, default: "" },
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

    // New: arrays for profile data
    addresses: [AddressSchema],
    paymentMethods: [PaymentMethodSchema],
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
