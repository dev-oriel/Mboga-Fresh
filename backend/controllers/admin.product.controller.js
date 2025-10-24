import Product from "../models/product.model.js";
import BulkProduct from "../models/bulkProduct.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

/**
fetch all users and map them by ID for denormalization (needed for Admin UI)
 */
const getUserMap = async () => {
  const users = await User.find({
    role: { $in: ["vendor", "farmer", "admin"] },
  })
    .select("name role")
    .lean();

  // Map { UserId: { name, role } }
  return new Map(
    users.map((u) => [String(u._id), { name: u.name, role: u.role }])
  );
};

/**
 * Fetches and merges both Retail and Bulk product listings for Admin view.
 */
export const listAllProducts = async (req, res) => {
  const { type = "all", q } = req.query; // type can be 'all', 'retail', or 'bulk'
  const filter = {};
  const regex = q ? new RegExp(q, "i") : null;

  // Fetch all relevant users for enriching product data
  const userMap = await getUserMap();

  const fetchItems = async (model, isBulk = false) => {
    const itemFilter = { ...filter };

    // Apply search query to name/description/category
    if (regex) {
      itemFilter.$or = [
        { name: regex },
        { description: regex },
        { category: regex },
      ];
    }

    let items = await model.find(itemFilter).exec();

    // Enrich the items with owner/vendor information
    return items.map((item) => {
      const ownerId = item.vendorId || item.ownerId;
      const ownerInfo = userMap.get(String(ownerId)) || {};

      // Determine visibility/suspend status for the frontend toggle
      const isSuspended = item.status === "Suspended";

      return {
        id: item._id,
        name: item.name,
        category: item.category,
        priceLabel: item.priceLabel,
        stock: item.stock || item.quantity,
        status: item.status,
        type: isBulk ? "Bulk" : "Retail",
        imagePath: item.imagePath,
        ownerId: ownerId,
        ownerName: ownerInfo.name || "N/A",
        ownerRole: ownerInfo.role || "unknown",
        // Admin control fields
        isSuspended: isSuspended, // Boolean state for the toggle
      };
    });
  };

  let allItems = [];

  try {
    if (type === "all" || type === "retail") {
      const retailItems = await fetchItems(Product, false);
      allItems.push(...retailItems);
    }

    if (type === "all" || type === "bulk") {
      const bulkItems = await fetchItems(BulkProduct, true);
      allItems.push(...bulkItems);
    }

    // Sort by creation date (newest first)
    allItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(allItems);
  } catch (error) {
    console.error("Admin Product Fetch Error:", error);
    res.status(500).json({ message: "Failed to fetch product listings." });
  }
};

/**
 * Admin action to suspend/activate a product by modifying its status field.
 */
export const updateProductStatus = async (req, res) => {
  const { id, type } = req.params;
  const { isSuspended } = req.body; // Expecting boolean true/false

  if (!id || !type) {
    return res
      .status(400)
      .json({ message: "Product ID and Type are required." });
  }

  const Model =
    type.toLowerCase() === "retail"
      ? Product
      : type.toLowerCase() === "bulk"
      ? BulkProduct
      : null;

  if (!Model) {
    return res.status(400).json({ message: "Invalid product type specified." });
  }

  try {
    const newStatus = isSuspended ? "Suspended" : "In Stock"; // Simple status toggle

    const updatedProduct = await Model.findByIdAndUpdate(
      id,
      { status: newStatus },
      { new: true, select: "name status ownerId" }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.json({
      success: true,
      message: `${updatedProduct.name} status updated to ${newStatus}.`,
      newStatus: newStatus,
    });
  } catch (error) {
    console.error("Admin Update Status Error:", error);
    res.status(500).json({ message: "Failed to update product status." });
  }
};
