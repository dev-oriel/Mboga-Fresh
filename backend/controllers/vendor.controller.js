import VendorProfile from "../models/vendorProfile.model.js";

// Get a list of vendors and unique locations for filtering
export const listVendorsForFilter = async (req, res) => {
  try {
    const vendors = await VendorProfile.find({}).select("businessName").lean();

    // Get all unique, non-empty locations from the profiles
    const locations = await VendorProfile.distinct("location");

    res.json({
      vendors,
      locations: locations.filter(Boolean), // Filter out any null/empty locations
    });
  } catch (err) {
    console.error("vendor listVendors error:", err?.stack || err);
    res.status(500).json({ message: "Failed to fetch vendor data" });
  }
};
