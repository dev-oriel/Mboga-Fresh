import mongoose from "mongoose";

// --- Subdocument Schema for Order Items ---
const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// --- Subdocument Schema for Shipping Address ---
const shippingAddressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // --- MISSING FIELDS (NOW ADDED) ---
    items: [orderItemSchema],
    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    // --- END OF FIX ---

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
    paymentFailureReason: {
      type: String, // Store M-Pesa failure messages
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

// Indexing for common queries
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ "items.vendor": 1, createdAt: -1 });

const Order = mongoose.model("Order", orderSchema);

export default Order;
