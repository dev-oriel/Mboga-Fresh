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
