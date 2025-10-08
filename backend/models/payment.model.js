import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'in_escrow', 'released', 'refunded'],
        default: 'pending'
    },
    escrowDate: {
        type: Date
    },
    releaseDate: {
        type: Date
    },
    paymentMethod: {
        type: String,
        enum: ['mpesa', 'bank_transfer', 'cash'],
        default: 'mpesa'
    },
    transactionId: {
        type: String,
        unique: true
    }
}, {
    timestamps: true
});

export const Payment = mongoose.model("Payment", paymentSchema);