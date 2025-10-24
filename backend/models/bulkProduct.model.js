import mongoose from "mongoose";

const BulkProductSchema = new mongoose.Schema(
  {
    // basic product info (supplier/bulk oriented)
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, default: 0 }, // price per unit (seller-defined)
    priceLabel: { type: String, default: "KSh 0" },
    quantity: { type: String, default: "" }, // e.g., "100 kg"
    status: {
      type: String,
      enum: ["In Stock", "Out of Stock"],
      default: "In Stock",
    },
    imagePath: { type: String, default: "" },
    description: { type: String, default: "" },

    // Ownership: set server-side from authenticated user
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    ownerRole: {
      type: String,
      enum: ["farmer", "vendor", "rider", "admin"],
      default: "farmer",
    },

    // linkage to vendor or marketplace flow
    vendorAssignedId: { type: String, default: "" },
    metadata: { type: Object, default: {} },
  },
  { timestamps: true }
);

// index to speed filtering by owner
BulkProductSchema.index({ ownerId: 1, createdAt: -1 });

export default mongoose.model("BulkProduct", BulkProductSchema);
