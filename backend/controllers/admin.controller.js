import Order from "../models/order.model.js";
import mongoose from "mongoose";

const getTotalEscrowBalance = async (req, res) => {
  try {
    const ordersInEscrow = await Order.find({
      orderStatus: { $nin: ["Delivered", "Cancelled"] },
    }).select("totalAmount");

    const totalEscrow = ordersInEscrow.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    res.json({ totalEscrow: totalEscrow });
  } catch (error) {
    console.error("Error fetching total escrow balance:", error);
    res.status(500).json({ message: "Failed to calculate escrow balance." });
  }
};

const listAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      // Populate user (buyer) name for display and select only essential fields
      .populate("user", "name phone")
      .sort({ createdAt: -1 })
      .select("-__v -updatedAt")
      .lean();

    res.json(orders);
  } catch (error) {
    console.error("Error fetching all orders for admin:", error);
    res.status(500).json({ message: "Failed to fetch all orders." });
  }
};

const listAllTransactions = async (req, res) => {
  try {
    const paidOrders = await Order.find({ paymentStatus: "Paid" })
      .populate("user", "name phone")
      .sort({ createdAt: -1 })
      .select(
        "user totalAmount orderStatus mpesaReceiptNumber mpesaTransactionDate mpesaPhoneNumber createdAt items"
      )
      .lean();

    // Map data to create a flat transaction view
    const transactions = paidOrders.map((order) => {
      // CRITICAL FIX 1: Robustly convert totalAmount to a number, defaulting to 0.
      const safeAmount = Number(order.totalAmount) || 0;

      // FIX 2: Ensure order.items is an array for safety checks
      const safeItems = Array.isArray(order.items) ? order.items : [];

      // Extract and format transaction date/time for precise display
      const mpesaDateCode = String(order.mpesaTransactionDate || "");
      let transactionDate;

      if (mpesaDateCode.length === 14) {
        const year = mpesaDateCode.substring(0, 4);
        const month = mpesaDateCode.substring(4, 6);
        const day = mpesaDateCode.substring(6, 8);
        const hour = mpesaDateCode.substring(8, 10);
        const minute = mpesaDateCode.substring(10, 12);

        transactionDate = new Date(
          `${year}-${month}-${day}T${hour}:${minute}:00`
        );
      } else {
        transactionDate = new Date(order.createdAt);
      }

      // Format date and time using Date object properties
      const formattedDate = transactionDate.toLocaleDateString("en-KE", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      const formattedTime = transactionDate.toLocaleTimeString("en-KE", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      return {
        id: order._id,
        buyerName: order.user?.name || "N/A",
        amount: safeAmount,
        transactionDate: formattedDate,
        transactionTime: formattedTime,
        mpesaCode: order.mpesaReceiptNumber || "N/A",
        phone: order.mpesaPhoneNumber || order.user?.phone || "N/A",
        status: order.orderStatus,
      };
    });

    res.json(transactions);
  } catch (error) {
    console.error(
      "Error fetching all transactions for admin: CRASH DETECTED",
      error
    );
    res.status(500).json({
      message:
        "Internal Server Error during transaction processing. See server logs.",
      details: error.message,
    });
  }
};

// --- FINAL EXPORTS ---
export { getTotalEscrowBalance, listAllOrders, listAllTransactions };
