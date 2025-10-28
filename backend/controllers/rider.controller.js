import Order from "../models/order.model.js";
import DeliveryTask from "../models/deliveryTask.model.js";
import Notification from "../models/notification.model.js";
import mongoose from "mongoose";

// --- VENDOR NOTIFICATION HELPER (RE-DEFINED/IMPORTED) ---
// NOTE: Must match the helper function in your main controller file.
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
// -----------------------------------------------------------------

// ALL FUNCTIONS BELOW ARE TRANSFERRED FROM order.controller.js

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
      .sort({ createdAt: -1 })
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

    task.status = "In Transit";
    await task.save();

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
  const { orderId, buyerCode } = req.body;
  const riderId = req.user._id;

  try {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid Order ID format." });
    }

    const task = await DeliveryTask.findOneAndUpdate(
      {
        order: orderId,
        rider: riderId,
        buyerConfirmationCode: buyerCode,
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

// --- FINAL EXPORTS ---
export {
  fetchAllAvailableTasks,
  fetchRiderAcceptedTasks,
  acceptDeliveryTask,
  confirmPickupByRider,
  confirmDeliveryByRider,
  getRiderEarningsAndHistory,
  getVendorNotifications,
};
