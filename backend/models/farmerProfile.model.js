import mongoose from "mongoose";
const farmerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    farmName: { type: String, required: true },
    contactPerson: { type: String, required: true },
    location: { type: String, required: true },
    produceTypes: [String],
    docs: [{ path: String, originalName: String }],
  },
  { timestamps: true }
);

export default mongoose.model("FarmerProfile", farmerProfileSchema);
