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

export const placeOrder = async (req, res) => {
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

export const updateOrderStatusAndNotifyRider = async (req, res) => {
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

    // 1. Generate unique pickup code (used for QR scanning)
    const pickupCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    // 2. Create the permanent Delivery Task for the Rider pool
    const newTask = await DeliveryTask.create({
      order: orderId,
      vendor: vendorId,
      status: "Awaiting Acceptance",
      pickupCode: pickupCode,
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

export const getBuyerOrders = async (req, res) => {
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

export const getVendorOrders = async (req, res) => {
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

export const getOrderDetailsById = async (req, res) => {
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

export const getVendorNotifications = async (req, res) => {
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

export const fetchAllAvailableTasks = async (req, res) => {
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

export const acceptDeliveryTask = async (req, res) => {
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

export const getTotalEscrowBalance = async (req, res) => {
  try {
    // Find orders that are NOT Delivered and NOT Cancelled
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
