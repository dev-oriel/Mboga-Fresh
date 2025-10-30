import mongoose from "mongoose";

const DeliveryTaskSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true, // One task per order
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: [
        "Awaiting Acceptance",
        "Accepted/Awaiting Pickup",
        "In Transit",
        "Delivered",
        "Cancelled",
      ],
      default: "Awaiting Acceptance",
    },
    pickupCode: {
      type: String,
      required: true,
    },

    buyerConfirmationCode: {
      type: String,
      required: true,
    },

    deliveryAddress: {
      type: Object,
      required: true,
    },
    deliveryFee: {
      type: Number,
      default: 210,
    },
  },
  {
    timestamps: true,
  }
);

// Index to quickly find tasks assigned to a specific rider
DeliveryTaskSchema.index({ rider: 1, status: 1 });
DeliveryTaskSchema.index({ order: 1 });

const DeliveryTask = mongoose.model("DeliveryTask", DeliveryTaskSchema);
export default DeliveryTask;
