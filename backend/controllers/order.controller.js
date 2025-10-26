// backend/controllers/order.controller.js - FINAL STABLE VERSION

import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import Notification from "../models/notification.model.js";
import DeliveryTask from "../models/deliveryTask.model.js";
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
  const { items, shippingAddress } = req.body;
  const userId = req.user._id;

  if (!items || items.length === 0 || !shippingAddress) {
    return res.status(400).json({ message: "Missing order details." });
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
      const itemTotal = itemPrice * item.quantity;
      totalAmount += itemTotal;
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

    const SHIPPING_FEE = 210;
    totalAmount += SHIPPING_FEE;

    const newOrder = new Order({
      user: userId,
      items: processedItems,
      shippingAddress: shippingAddress,
      totalAmount: totalAmount,
      paymentStatus: "Paid",
      orderStatus: "Processing",
    });

    await newOrder.save();

    // --- VENDOR NOTIFICATION LOGIC (PERMANENT DB WRITE) ---
    uniqueVendorIds.forEach((vendorIdString) => {
      createDbNotification(
        new mongoose.Types.ObjectId(vendorIdString),
        newOrder._id,
        `New Order #${newOrder._id
          .toString()
          .substring(18)
          .toUpperCase()} received! Tap to Accept.`
      );
    });
    // -------------------------------------------------------

    res.status(201).json({
      message: "Order placed successfully. Payment simulated as successful.",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("Order placement error:", error);
    res.status(500).json({
      message: "Failed to place order due to validation issues.",
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

    if (order.orderStatus !== "Processing") {
      return res.status(400).json({
        message: `Order status is already ${order.orderStatus}. Cannot accept.`,
      });
    }

    // 1. Generate unique pickup code (for Rider to scan)
    const pickupCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    // Generate Buyer Confirmation Code (6 digits)
    const buyerConfirmationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // 2. Create the permanent Delivery Task for the Rider pool
    const newTask = await DeliveryTask.create({
      order: orderId,
      vendor: vendorId,
      status: "Awaiting Acceptance",
      pickupCode: pickupCode,
      buyerConfirmationCode: buyerConfirmationCode, // <-- NEW FIELD
      deliveryAddress: order.shippingAddress,
    });

    // 3. Update Order Status to Awaiting Pickup/QR Scanning
    const newStatus = "QR Scanning";
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus: newStatus },
      { new: true }
    );

    // 4. Notify Vendor of successful Task creation
    await createDbNotification(
      vendorId,
      orderId,
      `Order #${orderId
        .toString()
        .substring(18)
        .toUpperCase()} accepted. Status: Awaiting Rider Pickup.`
    );

    res.json({
      message: `Order accepted and Delivery Task created.`,
      order: updatedOrder,
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
      .select("-__v -updatedAt");

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
  try {
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid order ID format." });
    }

    const order = await Order.findOne({ _id: orderId, user: req.user._id });

    if (!order) {
      return res.status(404).json({
        message: "Order not found or you don't have permission to view it.",
      });
    }

    res.json(order);
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({ message: "Failed to fetch order details." });
  }
};

const getVendorNotifications = async (req, res) => {
  const vendorId = req.user._id;

  try {
    const notifications = await Notification.find({ recipient: vendorId })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(
      notifications.map((n) => ({
        id: n._id,
        type: n.type,
        title: n.title,
        message: n.message,
        icon: "Package",
        isRead: n.isRead,
        timestamp: n.createdAt,
        relatedId: n.relatedId,
      }))
    );
  } catch (error) {
    console.error("Error fetching DB notifications:", error);
    res.status(500).json({ message: "Failed to fetch notifications." });
  }
};

const fetchAllAvailableTasks = async (req, res) => {
  try {
    const tasks = await DeliveryTask.find({ status: "Awaiting Acceptance" })
      .populate("vendor", "name businessName")
      .populate("order", "totalAmount")
      .sort({ createdAt: 1 })
      .lean();

    res.json(
      tasks.map((task) => ({
        id: task._id,
        orderId: task.order._id,
        totalAmount: task.order.totalAmount,
        vendorName: task.vendor.businessName || task.vendor.name,
        pickupAddress:
          task.deliveryAddress.street + ", " + task.deliveryAddress.city,
        deliveryFee: task.deliveryFee,
        createdAt: task.createdAt,
      }))
    );
  } catch (error) {
    console.error("Error fetching available tasks:", error);
    res.status(500).json({ message: "Failed to fetch available tasks." });
  }
};

const fetchRiderAcceptedTasks = async (req, res) => {
  const riderId = req.user._id;

  try {
    const tasks = await DeliveryTask.find({
      rider: riderId,
      status: { $in: ["Accepted/Awaiting Pickup", "In Transit"] },
    })
      .populate("vendor", "name businessName")
      .populate("order", "totalAmount")
      .sort({ createdAt: 1 })
      .lean();

    res.json(
      tasks.map((task) => ({
        id: task._id,
        orderId: task.order._id,
        totalAmount: task.order.totalAmount,
        vendorName: task.vendor.businessName || task.vendor.name,
        pickupAddress:
          task.deliveryAddress.street + ", " + task.deliveryAddress.city,
        deliveryAddress:
          task.deliveryAddress.street + ", " + task.deliveryAddress.city, // Full address
        deliveryFee: task.deliveryFee,
        createdAt: task.createdAt,
        status: task.status,
        pickupCode: task.pickupCode,
        isAssigned: true,
        // Include Buyer code for Rider's Confirmation Screen (for debugging)
        buyerConfirmationCode: task.buyerConfirmationCode,
      }))
    );
  } catch (error) {
    console.error("Error fetching accepted tasks:", error);
    res.status(500).json({ message: "Failed to fetch accepted tasks." });
  }
};

const acceptDeliveryTask = async (req, res) => {
  const { taskId } = req.params;
  const riderId = req.user._id;

  try {
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: "Invalid Task ID format." });
    }

    const task = await DeliveryTask.findOneAndUpdate(
      { _id: taskId, status: "Awaiting Acceptance", rider: null },
      { $set: { rider: riderId, status: "Accepted/Awaiting Pickup" } },
      { new: true }
    );

    if (!task) {
      return res
        .status(409)
        .json({ message: "Task already accepted or does not exist." });
    }

    await createDbNotification(
      task.vendor,
      task.order,
      `Rider has accepted task for Order #${task.order
        .toString()
        .substring(18)
        .toUpperCase()}.`
    );

    res.json({ message: "Task accepted successfully. Proceed to pickup." });
  } catch (error) {
    console.error("Rider task acceptance error:", error);
    res.status(500).json({ message: "Failed to accept delivery task." });
  }
};

const confirmPickupByRider = async (req, res) => {
  const { orderId, pickupCode } = req.body;
  const riderId = req.user._id;

  try {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid Order ID format." });
    }

    const task = await DeliveryTask.findOne({
      order: orderId,
      rider: riderId,
      pickupCode: pickupCode,
      status: "Accepted/Awaiting Pickup",
    });

    if (!task) {
      return res
        .status(401)
        .json({ message: "Invalid scan or task not ready for pickup." });
    }

    task.status = "In Transit";
    await task.save();

    await Order.findByIdAndUpdate(orderId, { orderStatus: "Shipped" });

    await createDbNotification(
      task.vendor,
      orderId,
      `Order #${orderId
        .toString()
        .substring(18)
        .toUpperCase()} has been picked up and is In Transit.`
    );

    res.json({ message: "Pickup confirmed. Delivery is now in transit." });
  } catch (error) {
    console.error("Rider pickup confirmation error:", error);
    res.status(500).json({ message: "Failed to confirm pickup." });
  }
};

const confirmDeliveryByRider = async (req, res) => {
  const { orderId, buyerCode } = req.body; // <-- NEW: Now accepts buyerCode
  const riderId = req.user._id;

  try {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid Order ID format." });
    }

    // CRITICAL FIX: Find task by buyerConfirmationCode as well
    const task = await DeliveryTask.findOneAndUpdate(
      {
        order: orderId,
        rider: riderId,
        buyerConfirmationCode: buyerCode, // <--- VERIFY BUYER CODE
        status: "In Transit",
      },
      { $set: { status: "Delivered" } },
      { new: true }
    );

    if (!task) {
      return res
        .status(401)
        .json({ message: "Invalid Delivery Code or task not in transit." });
    }

    await Order.findByIdAndUpdate(orderId, { orderStatus: "Delivered" });

    await createDbNotification(
      task.vendor,
      orderId,
      `Order #${orderId
        .toString()
        .substring(18)
        .toUpperCase()} has been successfully delivered and funds released from escrow.`
    );

    res.json({ message: "Delivery confirmed. Escrow funds released." });
  } catch (error) {
    console.error("Rider final delivery confirmation error:", error);
    res.status(500).json({ message: "Failed to confirm final delivery." });
  }
};

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

// ---------------------------------------------------------------------
// FINAL CONSOLIDATED EXPORTS
// ---------------------------------------------------------------------
export {
  placeOrder,
  getBuyerOrders,
  getVendorOrders,
  getOrderDetailsById,
  getVendorNotifications,
  updateOrderStatusAndNotifyRider,
  fetchAllAvailableTasks,
  fetchRiderAcceptedTasks,
  acceptDeliveryTask,
  confirmPickupByRider,
  confirmDeliveryByRider,
  getTotalEscrowBalance,
};
