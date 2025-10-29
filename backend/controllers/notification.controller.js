import Notification from "../models/notification.model.js";

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    res.json(notifications);
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve notifications.",
    });
  }
};

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

// --- FINAL EXPORTS ---
export {
  getNotifications,
  markNotificationAsReadDb,
  deleteReadNotificationsDb,
};
