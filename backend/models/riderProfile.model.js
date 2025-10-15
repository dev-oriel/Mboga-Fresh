import mongoose from "mongoose";
const riderProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    idNumber: { type: String, required: true },
    vehicleType: {
      type: String,
      enum: ["motorbike", "bicycle", "truck", "van", "other"],
      required: true,
    },
    vehicleName: { type: String },
    idDocs: [{ path: String, originalName: String }],
    approved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("RiderProfile", riderProfileSchema);
