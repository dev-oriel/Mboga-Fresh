import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import Notification from "../models/notification.model.js";
import DeliveryTask from "../models/deliveryTask.model.js";
import { initiateSTKPush } from "../services/daraja.service.js";
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

    const SHIPPING_FEE = 1;
    const finalTotal = totalAmount + SHIPPING_FEE;

    const newOrderId = new mongoose.Types.ObjectId();

    // 1. Initiate M-Pesa STK Push
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

    // 2. ONLY CREATE THE ORDER TEMPORARILY WITH PENDING STATUS
    const newOrder = new Order({
      _id: newOrderId,
      user: userId,
      items: processedItems,
      shippingAddress: shippingAddress,
      totalAmount: finalTotal,
      paymentStatus: "Pending", // Payment is still pending confirmation
      orderStatus: "Processing", // Initial state before payment confirmation
      mpesaCheckoutRequestId: mpesaResult.checkoutRequestId,
    });

    await newOrder.save();

    // Send initial notifications (optional, but kept from original flow)
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

    // FIX 1: Check against the correct preceding status
    if (order.orderStatus !== "New Order") {
      return res.status(400).json({
        message: `Order status is already ${order.orderStatus}. Cannot accept.`,
      });
    }

    const pickupCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const buyerConfirmationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // FIX 2: Create the DeliveryTask with the Vendor's pickup code
    const newTask = await DeliveryTask.create({
      order: orderId,
      vendor: vendorId,
      status: "Awaiting Acceptance",
      pickupCode: pickupCode,
      buyerConfirmationCode: buyerConfirmationCode,
      deliveryAddress: order.shippingAddress,
    });

    // FIX 3: Set new Order Status
    const newStatus = "QR Scanning";
    await Order.findByIdAndUpdate(orderId, { orderStatus: newStatus });

    await createDbNotification(
      vendorId,
      orderId,
      `Order accepted. Status: Awaiting Rider Pickup (Code: ${pickupCode}).`
    );

    res.json({
      message: `Order accepted and Delivery Task created.`,
      order: { ...order._doc, orderStatus: newStatus },
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
  const { orderId } = req.params;
  const userId = req.user._id;
  const userRole = req.user.role;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return res.status(400).json({ message: "Invalid Order ID format." });
  }

  try {
    // 1. Find the order
    const order = await Order.findById(orderId).lean();

    if (!order) {
      // Note: Since this is likely the failing path, this console.log will now confirm if the failure happens *before* or *during* this check.
      console.warn(`[OrderAuth] 404: Order ID ${orderId} not found.`);
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    // --- 2. Authorization Logic (Robust Check) ---

    let isAuthorized = false;

    // Check A: Buyer or Admin
    if (String(order.user) === String(userId) || userRole === "admin") {
      isAuthorized = true;
    }

    // Check B: Rider access via DeliveryTask (CRITICAL PATH)
    if (userRole === "rider") {
      // We only need to check if a task exists linking THIS user (rider) to THIS order
      const task = await DeliveryTask.findOne({
        order: orderId,
        rider: userId,
      }).lean();

      if (task) {
        isAuthorized = true;
      }
    }

    // Check C: Vendor access
    if (userRole === "vendor") {
      const isVendorForOrder = order.items.some(
        (item) => String(item.vendor) === String(userId)
      );
      if (isVendorForOrder) {
        isAuthorized = true;
      }
    }

    if (isAuthorized) {
      console.log(
        `[OrderAuth] Access granted for User ${userId} (Role: ${userRole}) to Order ${orderId}.`
      );
      // If the rider is authorized, send the order data.
      return res.json(order);
    } else {
      console.warn(
        `[OrderAuth] 403: Access denied for User ${userId} (Role: ${userRole}) to Order ${orderId}.`
      );
      return res.status(403).json({
        message: "Forbidden. You do not have permission to view this order.",
      });
    }
  } catch (error) {
    // Log unexpected server/database errors deeply
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

const getVendorNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
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

// --- NEW/MODIFIED NOTIFICATION MANAGEMENT ENDPOINTS ---

const markNotificationAsReadDb = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findOneAndUpdate(
      { _id: id, recipient: req.user._id },
      { $set: { isRead: true } },
      { new: true }
    );
    res.json({ success: true, message: "Notification marked as read." });
  } catch (error) {
    console.error("Mark read error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark notification as read.",
    });
  }
};

const deleteReadNotificationsDb = async (req, res) => {
  try {
    const result = await Notification.deleteMany({
      recipient: req.user._id,
      isRead: true,
    });
    res.json({
      success: true,
      message: `${result.deletedCount} notifications deleted.`,
    });
  } catch (error) {
    console.error("Delete read error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete read notifications.",
    });
  }
};

// --- END NEW/MODIFIED NOTIFICATION MANAGEMENT ENDPOINTS ---

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
          task.deliveryAddress.street + ", " + task.deliveryAddress.city,
        deliveryFee: task.deliveryFee,
        createdAt: task.createdAt,
        status: task.status,
        pickupCode: task.pickupCode,
        isAssigned: true,
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

    // FIX 1: Set Task Status
    task.status = "In Transit";
    await task.save();

    // FIX 2: Set Order Status
    await Order.findByIdAndUpdate(orderId, { orderStatus: "In Delivery" });

    await createDbNotification(
      task.vendor,
      orderId,
      `Order #${orderId
        .toString()
        .substring(18)
        .toUpperCase()} has been picked up and is In Delivery.`
    );

    res.json({ message: "Pickup confirmed. Delivery is now in transit." });
  } catch (error) {
    console.error("Rider pickup confirmation error:", error);
    res.status(500).json({ message: "Failed to confirm pickup." });
  }
};

const confirmDeliveryByRider = async (req, res) => {
  const { orderId, buyerCode } = req.body; // CRITICAL: Now expects buyerCode
  const riderId = req.user._id;

  try {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid Order ID format." });
    }

    const task = await DeliveryTask.findOneAndUpdate(
      {
        order: orderId,
        rider: riderId,
        buyerConfirmationCode: buyerCode, // CRITICAL: Use buyerCode for validation
        status: "In Transit",
      },
      { $set: { status: "Delivered" } },
      { new: true }
    );

    if (!task) {
      return res
        .status(401)
        .json({ message: "Invalid Buyer Code or task not in transit." });
    }

    // FIX: Set Order Status to Delivered (Order Complete)
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

const handleMpesaCallback = async (req, res) => {
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
    // 1. Find Order by the unique CheckoutRequestID
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

    if (resultCode === 0) {
      // PAYMENT SUCCESS: Update order status to PAID and next ORDER status to 'New Order'
      const orderUpdate = {
        paymentStatus: "Paid",
        orderStatus: "New Order", // FIX: Ready for vendor action
        mpesaReceiptNumber: stkCallback.CallbackMetadata.Item.find(
          (i) => i.Name === "MpesaReceiptNumber"
        )?.Value,
      };
      await Order.findByIdAndUpdate(order._id, orderUpdate);

      // Notify Vendor of confirmed payment
      const notificationMessage = `Payment confirmed! New Order #${order._id
        .toString()
        .substring(18)
        .toUpperCase()} is ready for your acceptance.`;

      await createDbNotification(
        order.items[0].vendor,
        order._id,
        notificationMessage
      );
    } else {
      // PAYMENT FAILURE
      console.warn("M-Pesa Payment Failed. Deleting Order ID:", order._id);

      // FIX: Delete the order entirely on failure (if it's still in the processing state)
      if (order.orderStatus === "Processing") {
        await Order.deleteOne({ _id: order._id });
      } else {
        // If already moved past initial state, just mark as failed and log reason
        await Order.findByIdAndUpdate(order._id, {
          paymentStatus: "Failed",
          paymentFailureReason: resultDesc,
        });
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
const getRiderEarningsAndHistory = async (req, res) => {
  const riderId = req.user._id;

  try {
    // Find all tasks completed by the current rider
    const completedTasks = await DeliveryTask.find({
      rider: riderId,
      status: "Delivered", // Tasks marked as delivered
    })
      .populate("order", "totalAmount") // Populate the order amount (or calculate fee)
      .sort({ createdAt: -1 })
      .lean();

    // Calculate total lifetime earnings
    const totalEarnings = completedTasks.reduce((sum, task) => {
      // Assuming deliveryFee is the rider's earning, if not zero.
      const earning = task.deliveryFee || 0;
      return sum + earning;
    }, 0);

    // Return summary stats and the list of recent tasks
    res.json({
      totalEarnings: totalEarnings,
      completedCount: completedTasks.length,
      recentDeliveries: completedTasks.slice(0, 5).map((task) => ({
        id: task.order._id,
        customer: task.deliveryAddress.street || task.order._id.substring(18),
        location: task.deliveryAddress.city,
        earnings: task.deliveryFee,
        status: "Delivered",
        date: task.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching rider earnings:", error);
    res.status(500).json({ message: "Failed to fetch rider earnings data." });
  }
};
const listAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      // Populate user (buyer) name for display and select only essential fields
      .populate("user", "name phone")
      .sort({ createdAt: -1 })
      .select("-__v -updatedAt")
      .lean(); // Use .lean() for faster read operations

    res.json(orders);
  } catch (error) {
    console.error("Error fetching all orders for admin:", error);
    res.status(500).json({ message: "Failed to fetch all orders." });
  }
};
const listAllTransactions = async (req, res) => {
  try {
    const paidOrders = await Order.find({ paymentStatus: "Paid" })
      .populate("user", "name") // Populate buyer name
      .sort({ createdAt: -1 })
      .select("user totalAmount orderStatus mpesaReceiptNumber createdAt") // Include mpesaReceiptNumber
      .lean();

    // Map data to create a flat transaction view
    const transactions = paidOrders.map((order) => ({
      id: order._id,
      buyerName: order.user?.name || "N/A",
      // Vendor name is simplified: often the first vendor in the item list.
      // For true multi-vendor, this would require complex population or pre-aggregation.
      sellerName: order.items[0]?.vendorName || "Multiple Vendors",
      amount: order.totalAmount,
      date: order.createdAt,
      status: order.orderStatus,
      // CRITICAL: Expose the Mpesa code as 'mpesaCode'
      mpesaCode: order.mpesaReceiptNumber || "N/A",
    }));

    res.json(transactions);
  } catch (error) {
    console.error("Error fetching all transactions for admin:", error);
    res.status(500).json({ message: "Failed to fetch transaction list." });
  }
};
// ---------------------------------------------------------------------
// FINAL CONSOLIDATED EXPORTS
// ---------------------------------------------------------------------
export {
  placeOrder,
  handleMpesaCallback,
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
  checkOrderStatus,
  markNotificationAsReadDb,
  deleteReadNotificationsDb,
  getRiderEarningsAndHistory,
  listAllOrders,
  listAllTransactions,
};
