import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }, // Price at the time of purchase
        vendor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        }, // The vendor/seller of this specific item
        image: { type: String, default: "" }, // Added missing field
      },
    ],
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },
    orderStatus: {
      type: String,
      enum: [
        "Processing", // 0. Initial/Payment Pending
        "New Order", // 1. Payment Confirmed / Awaiting Vendor Acceptance
        "QR Scanning", // 2. Accepted by Vendor / Awaiting Rider Pickup
        "In Delivery", // 3. Rider Picked Up / In Transit
        "Delivered", // 4. Final Delivery Confirmation
        "Cancelled",
      ],
      default: "Processing",
    },
    mpesaCheckoutRequestId: {
      type: String, // CRITICAL: Stores the ID needed to link the order to the callback
      unique: true,
      sparse: true, // Allows null values
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
