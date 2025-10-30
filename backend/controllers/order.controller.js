import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import Notification from "../models/notification.model.js";
import DeliveryTask from "../models/deliveryTask.model.js";
import { initiateSTKPush } from "../services/daraja.service.js";
// FIX: Import the notification function from the correct controller
import { notifyAllAvailableRiders } from "./rider.controller.js";
import mongoose from "mongoose";

// --- VENDOR NOTIFICATION HELPER ---
const createDbNotification = async (recipientId, orderId, message) => {
  const newNotification = new Notification({
    recipient: recipientId,
    type: "order",
    title: `Order Alert: #${orderId.toString().substring(18).toUpperCase()}`,
    message: message,
    relatedId: orderId,
  });
  await newNotification.save();
};
// ------------------------------------

const placeOrder = async (req, res) => {
  const { items, shippingAddress, mpesaPhone } = req.body;
  const userId = req.user._id;

  if (!items || items.length === 0 || !shippingAddress || !mpesaPhone) {
    return res
      .status(400)
      .json({ message: "Missing order details or M-Pesa phone number." });
  }

  try {
    let totalAmount = 0;
    const processedItems = [];
    const uniqueVendorIds = new Set();

    for (const item of items) {
      if (!mongoose.Types.ObjectId.isValid(item.product)) {
        return res
          .status(400)
          .json({ message: `Invalid Product ID format: ${item.product}` });
      }
      const product = await Product.findById(item.product).select(
        "price vendorId name imagePath"
      );
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product not found: ${item.product}` });
      }
      if (
        !product.vendorId ||
        !mongoose.Types.ObjectId.isValid(product.vendorId)
      ) {
        return res.status(500).json({
          message: `Vendor ID for product ${product.name} is invalid or missing.`,
        });
      }

      const itemPrice = product.price;
      totalAmount += itemPrice * item.quantity;
      uniqueVendorIds.add(product.vendorId.toString());

      processedItems.push({
        product: item.product,
        name: product.name,
        quantity: item.quantity,
        price: itemPrice,
        vendor: product.vendorId,
        image: product.imagePath,
      });
    }

    const SHIPPING_FEE = 0;
    const finalTotal = totalAmount + SHIPPING_FEE;

    const newOrderId = new mongoose.Types.ObjectId();

    const mpesaResult = await initiateSTKPush(
      finalTotal,
      mpesaPhone,
      newOrderId.toString()
    );

    if (mpesaResult.responseCode !== "0") {
      return res.status(400).json({
        message:
          mpesaResult.customerMessage || "M-Pesa push failed to initiate.",
      });
    }

    const newOrder = new Order({
      _id: newOrderId,
      user: userId,
      items: processedItems,
      shippingAddress: shippingAddress,
      totalAmount: finalTotal,
      paymentStatus: "Pending",
      orderStatus: "Processing",
      mpesaCheckoutRequestId: mpesaResult.checkoutRequestId,
    });

    await newOrder.save();

    uniqueVendorIds.forEach((vendorIdString) => {
      createDbNotification(
        new mongoose.Types.ObjectId(vendorIdString),
        newOrder._id,
        `New potential order #${newOrder._id
          .toString()
          .substring(18)
          .toUpperCase()} received! Awaiting M-Pesa payment confirmation.`
      );
    });

    res.status(201).json({
      message: "M-Pesa STK Push initiated.",
      orderId: newOrder._id,
      checkoutRequestId: mpesaResult.checkoutRequestId,
    });
  } catch (error) {
    console.error("Order placement error:", error);
    res.status(500).json({
      message:
        error.message || "Failed to place order due to validation issues.",
      details: error.message,
    });
  }
};

const updateOrderStatusAndNotifyRider = async (req, res) => {
  const { orderId } = req.params;
  const vendorId = req.user._id;

  try {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid Order ID format." });
    }

    const order = await Order.findOne({
      _id: orderId,
      "items.vendor": vendorId,
    });

    if (!order) {
      return res
        .status(404)
        .json({ message: "Order not found or access denied." });
    }

    if (order.orderStatus !== "New Order") {
      return res.status(400).json({
        message: `Order status is already ${order.orderStatus}. Cannot accept.`,
      });
    }

    const pickupCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const buyerConfirmationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const newTask = await DeliveryTask.create({
      order: orderId,
      vendor: vendorId,
      status: "Awaiting Acceptance",
      pickupCode: pickupCode,
      buyerConfirmationCode: buyerConfirmationCode,
      deliveryAddress: order.shippingAddress,
    });

    await Order.findByIdAndUpdate(orderId, { orderStatus: "QR Scanning" });

    await createDbNotification(
      vendorId,
      orderId,
      `Order accepted. Status: Awaiting Rider Pickup (Code: ${pickupCode}).`
    );

    const vendorInfo =
      order.items && order.items.length > 0 ? order.items[0].vendor : vendorId;

    await notifyAllAvailableRiders(newTask._id, vendorInfo);

    res.json({
      message: `Order accepted and Delivery Task created.`,
      order: { ...order._doc, orderStatus: "QR Scanning" },
      task: newTask,
    });
  } catch (error) {
    console.error("Vendor order acceptance error:", error);
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: "Task already assigned for this order." });
    }
    res.status(500).json({ message: "Failed to accept order." });
  }
};

const getBuyerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select(
        "items totalAmount shippingAddress paymentStatus orderStatus createdAt mpesaReceiptNumber mpesaTransactionDate mpesaPhoneNumber"
      )
      .lean();

    res.json(orders);
  } catch (error) {
    console.error("Error fetching buyer orders:", error);
    res.status(500).json({ message: "Failed to fetch order history." });
  }
};

const getVendorOrders = async (req, res) => {
  const vendorId = req.user._id;

  try {
    const orders = await Order.find({ "items.vendor": vendorId })
      .sort({ createdAt: -1 })
      .select("-__v -updatedAt");
    res.json(orders);
  } catch (error) {
    console.error("Error fetching vendor orders:", error);
    res.status(500).json({ message: "Failed to fetch vendor orders." });
  }
};

const getOrderDetailsById = async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user._id;
  const userRole = req.user.role;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return res.status(400).json({ message: "Invalid Order ID format." });
  }

  try {
    const order = await Order.findById(orderId)
      .populate("items.vendor", "name businessName")
      .lean();

    if (!order) {
      console.warn(`[OrderAuth] 404: Order ID ${orderId} not found.`);
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    let isAuthorized = false;
    let taskDetails = null;

    // --- FIX: Fetch task details for ANY role associated with the order ---
    if (
      userRole === "rider" ||
      userRole === "buyer" ||
      userRole === "vendor" ||
      userRole === "admin"
    ) {
      taskDetails = await DeliveryTask.findOne({
        order: orderId,
      }).lean();
    }
    // --- END OF FIX ---

    // Check A: Buyer or Admin
    if (String(order.user) === String(userId) || userRole === "admin") {
      isAuthorized = true;
    }

    // Check B: Rider access via DeliveryTask
    if (userRole === "rider") {
      // We check taskDetails.rider *after* fetching the task
      if (taskDetails && String(taskDetails.rider) === String(userId)) {
        isAuthorized = true;
      }
    }

    // Check C: Vendor access
    if (userRole === "vendor") {
      const isVendorForOrder = order.items.some(
        (item) => String(item.vendor._id) === String(userId)
      );
      if (isVendorForOrder) {
        // Vendor is authorized if they are part of the order
        isAuthorized = true;
      }
    }

    if (isAuthorized) {
      console.log(
        `[OrderAuth] Access granted for User ${userId} (Role: ${userRole}) to Order ${orderId}.`
      );
      // Attach task details (if they exist) for all authorized roles
      return res.json({ ...order, task: taskDetails });
    } else {
      console.warn(
        `[OrderAuth] 403: Access denied for User ${userId} (Role: ${userRole}) to Order ${orderId}.`
      );
      return res.status(403).json({
        message: "Forbidden. You do not have permission to view this order.",
      });
    }
  } catch (error) {
    console.error(
      `[OrderAuth] Critical Server Error for Order ${orderId}:`,
      error
    );
    res.status(500).json({
      message: "Failed to fetch order details due to an internal server error.",
      details: error.message,
    });
  }
};

const checkOrderStatus = async (req, res) => {
  const { orderId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return res.status(400).json({ message: "Invalid Order ID format." });
  }

  try {
    const order = await Order.findById(orderId).select(
      "paymentStatus orderStatus paymentFailureReason"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.json({
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      paymentFailureReason: order.paymentFailureReason,
    });
  } catch (error) {
    console.error("Error checking order status:", error);
    res.status(500).json({ message: "Failed to check payment status." });
  }
};

// --- NEW FUNCTION TO GET PICKUP CODE ---
const getTaskForVendor = async (req, res) => {
  const { orderId } = req.params;
  const vendorId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return res.status(400).json({ message: "Invalid Order ID format." });
  }

  try {
    const task = await DeliveryTask.findOne({
      order: orderId,
      vendor: vendorId,
    }).select("pickupCode status"); // Only send what's needed

    if (!task) {
      return res
        .status(404)
        .json({ message: "Task not found for this order." });
    }

    res.json(task);
  } catch (error) {
    console.error("Error fetching task for vendor:", error);
    res.status(500).json({ message: "Failed to fetch task." });
  }
};

// --- FINAL EXPORTS (Core Functions ONLY) ---

export {
  placeOrder,
  updateOrderStatusAndNotifyRider,
  getBuyerOrders,
  getVendorOrders,
  getOrderDetailsById,
  checkOrderStatus,
  getTaskForVendor,
};
