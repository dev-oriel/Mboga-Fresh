import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, default: 0 },
    priceLabel: { type: String, default: "KSh 0" },
    stock: { type: String, default: "" },
    status: {
      type: String,
      enum: ["In Stock", "Out of Stock"],
      default: "In Stock",
    },
    imagePath: { type: String, default: "" }, // server relative URL: /uploads/filename
    description: { type: String, default: "" },
    vendorId: { type: String, default: "" }, // optional vendor reference for future auth
  },
  { timestamps: true }
);

export default mongoose.model("Product", ProductSchema);
