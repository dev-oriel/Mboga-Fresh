import mongoose from "mongoose";

const vendorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    businessName: { type: String, required: true },
    ownerName: { type: String, required: true },
    location: { type: String, required: true },
    docs: [{ path: String, originalName: String }],
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    verifiedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("VendorProfile", vendorProfileSchema);
