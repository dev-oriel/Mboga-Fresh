import Order from "../models/order.model.js";
import Notification from "../models/notification.model.js";
import mongoose from "mongoose";

// --- VENDOR NOTIFICATION HELPER (Must be defined or imported) ---
// Assuming createDbNotification is available globally or defined here:
const createDbNotification = async (recipientId, orderId, message) => {
  // NOTE: You MUST ensure this logic matches the helper function in your main controller file.
  const newNotification = new Notification({
    recipient: recipientId,
    type: "order",
    title: `Order Alert: #${orderId.toString().substring(18).toUpperCase()}`,
    message: message,
    relatedId: orderId,
  });
  await newNotification.save();
};
// -----------------------------------------------------------------

export const handleMpesaCallback = async (req, res) => {
  const callbackData = req.body;
  const {
    Body: { stkCallback },
  } = callbackData;

  console.log("--- RECEIVED MPESA CALLBACK ---");
  console.log(JSON.stringify(stkCallback, null, 2));

  const checkoutRequestId = stkCallback?.CheckoutRequestID;
  const resultCode = stkCallback?.ResultCode;
  const resultDesc = stkCallback?.ResultDesc;

  try {
    // 1. Find Order by the unique CheckoutRequestID (retrieves the full document)
    const order = await Order.findOne({
      mpesaCheckoutRequestId: checkoutRequestId,
    });

    if (!order) {
      console.warn(
        "Mpesa Callback: Order not found for CheckoutRequestID:",
        checkoutRequestId
      );
      return res.status(404).json({ message: "Order not found." });
    }

    // Helper to extract M-Pesa fields safely
    const getCallbackValue = (name) =>
      stkCallback.CallbackMetadata?.Item?.find((item) => item.Name === name)
        ?.Value;

    let paymentUpdate = {};

    if (resultCode === 0) {
      // SUCCESS: Define ONLY the fields that need to be ADDED/UPDATED.
      paymentUpdate = {
        paymentStatus: "Paid",
        orderStatus: "New Order",
        mpesaReceiptNumber: getCallbackValue("MpesaReceiptNumber"),
        mpesaTransactionDate: getCallbackValue("TransactionDate"),
        mpesaPhoneNumber: getCallbackValue("PhoneNumber"),
      };

      // 2. CRITICAL FIX: Atomic Update to PRESERVE ITEMS/ADDRESS/TOTALAMOUNT
      await Order.findByIdAndUpdate(
        order._id,
        { $set: paymentUpdate },
        { new: true }
      );

      // Notify Vendor (Uses original 'order' object data for the message)
      if (order.items && order.items.length > 0 && order.items[0].vendor) {
        const notificationMessage = `Payment confirmed! New Order #${order._id
          .toString()
          .substring(18)
          .toUpperCase()} is ready.`;
        await createDbNotification(
          order.items[0].vendor,
          order._id,
          notificationMessage
        );
      } else {
        console.warn(
          `[MpesaCallback] Payment OK, but missing vendor info for notification on Order ${order._id}`
        );
      }
    } else {
      // PAYMENT FAILURE
      paymentUpdate = {
        paymentStatus: "Failed",
        paymentFailureReason: resultDesc,
      };

      // Apply failure patch
      await Order.findByIdAndUpdate(
        order._id,
        { $set: paymentUpdate },
        { new: true }
      );

      // Handle Deletion on Failure
      if (order.orderStatus === "Processing") {
        console.warn(
          "M-Pesa Payment Failed. Deleting temporary Order ID:",
          order._id
        );
        await Order.deleteOne({ _id: order._id });
      }
    }

    // 3. Return status 200 response (MANDATORY for Daraja API)
    return res
      .status(200)
      .json({ message: "Callback processed successfully." });
  } catch (error) {
    console.error("Mpesa Callback Processing Error:", error);
    return res
      .status(200)
      .json({ message: "Internal server error during processing." });
  }
};
