// backend/controllers/user.controller.js - MODIFIED listUsers FUNCTION

import { User } from "../models/user.model.js";
import VendorProfile from "../models/vendorProfile.model.js";
import RiderProfile from "../models/riderProfile.model.js";
import FarmerProfile from "../models/farmerProfile.model.js";

/**
 * Maps frontend role filter to backend logic (kept for reference, not directly used in the modified listUsers)
 */
const ROLE_MODEL_MAP = {
  sellers: {
    model: VendorProfile,
    joinField: "user",
    select: "businessName location",
  },
  suppliers: {
    model: FarmerProfile,
    joinField: "user",
    select: "farmName contactPerson location produceTypes",
  },
  riders: {
    model: RiderProfile,
    joinField: "user",
    select: "vehicleType zone",
  },
};

/**
 * Fetches and returns all users, optionally filtered by role and query (for Admin UI).
 */
export const listUsers = async (req, res) => {
  // role is now the singular role key: 'buyer', 'vendor', 'farmer', 'rider', 'admin'
  const { role: roleFilter, q } = req.query;
  const filter = {};

  // 1. Apply Role Filter (if provided and not 'all')
  if (roleFilter && roleFilter !== "all") {
    filter.role = roleFilter; // Use the singular role key directly
  }

  // 2. Apply Search Query (on name, email, phone)
  if (q) {
    const regex = new RegExp(q, "i");
    const searchFilter = {
      $or: [{ name: regex }, { email: regex }, { phone: regex }],
    };

    // Combine role filter and search filter
    Object.assign(filter, searchFilter);
  }

  try {
    // Fetch users, excluding sensitive data
    let users = await User.find(filter)
      .select(
        "-password -VerificationToken -VerificationTokenExpiresAt -resetPasswordToken -resetPasswordExpiresAt"
      )
      .lean();

    // 3. Flatten and Enhance Data
    const enhancedUsers = await Promise.all(
      users.map(async (user) => {
        let extraData = {};
        const roleKey = user.role + "s";

        if (ROLE_MODEL_MAP[roleKey]) {
          const { model } = ROLE_MODEL_MAP[roleKey];
          const profile = await model.findOne({ user: user._id }).lean();
          if (profile) {
            extraData = {
              location: profile.location || profile.zone,
              vehicle: profile.vehicleType,
              produce: profile.produceTypes
                ? profile.produceTypes.join(", ")
                : undefined,
              businessName: profile.businessName,
            };
          }
        }

        // Format data to match frontend expectations
        return {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          status: user.status.charAt(0).toUpperCase() + user.status.slice(1),
          enabled: user.status === "active" || user.status === "online",
          __role: user.role + "s", // Pass back as plural for frontend distinction (e.g., 'buyers')
          // Mocked statistics (will be replaced by aggregation later)
          orders: 0,
          escrow: "KES 0",
          sales: "KES 0",
          rating: 0,
          ...extraData,
        };
      })
    );

    res.json(enhancedUsers);
  } catch (err) {
    console.error("Error fetching users for admin:", err);
    res.status(500).json({ message: "Failed to fetch user list" });
  }
};
export const getUserStats = async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
    const sixtyDaysAgo = new Date(now.setDate(now.getDate() - 60));

    // 1. Total Counts (All Time)
    const totalUsers = await User.countDocuments();

    // 2. Counts by Role (for the pie chart or role breakdown)
    const roleCounts = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]);

    // 3. Growth Calculation (Users created in the last 30 days vs previous 30 days)

    // Count users created in the LAST 30 DAYS
    const currentPeriodCount = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    // Count users created in the PREVIOUS 30 DAYS (30 to 60 days ago)
    const previousPeriodCount = await User.countDocuments({
      createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo },
    });

    let percentageChange = 0;
    if (previousPeriodCount > 0) {
      percentageChange =
        ((currentPeriodCount - previousPeriodCount) / previousPeriodCount) *
        100;
    } else if (currentPeriodCount > 0) {
      // If previous period was zero but current is > 0, treat as 100% growth
      percentageChange = 100;
    }

    const stats = {
      totalUsers: totalUsers,
      roleCounts: roleCounts.map((item) => ({
        role: item._id,
        count: item.count,
      })),
      percentageChange: parseFloat(percentageChange.toFixed(2)),
      currentPeriodCount: currentPeriodCount,
    };

    res.json(stats);
  } catch (error) {
    console.error("User Stats Error:", error);
    res.status(500).json({ message: "Failed to fetch user statistics." });
  }
};
