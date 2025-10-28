import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // ... (omitted items, shippingAddress, totalAmount fields - unchanged) ...
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
      type: String,
      unique: true,
      sparse: true,
    },
    mpesaReceiptNumber: {
      type: String,
      unique: true,
      sparse: true,
    },

    mpesaTransactionDate: {
      type: String,
      sparse: true,
    },
    mpesaPhoneNumber: {
      type: String,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
