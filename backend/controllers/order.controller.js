// backend/controllers/order.controller.js - MODIFIED

import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import mongoose from "mongoose";

/**
 * Buyer places a new order.
 * This simulates a successful payment and creates the order record.
 */
export const placeOrder = async (req, res) => {
  const { items, shippingAddress } = req.body;
  const userId = req.user._id;

  if (!items || items.length === 0 || !shippingAddress) {
    return res.status(400).json({ message: "Missing order details." });
  }

  try {
    let totalAmount = 0;
    const processedItems = [];

    // 1. Validate items and calculate total amount (security check)
    for (const item of items) {
      // Validate MongoDB ObjectId (Fix from previous step)
      if (!mongoose.Types.ObjectId.isValid(item.product)) {
        return res
          .status(400)
          .json({ message: `Invalid Product ID format: ${item.product}` });
      }

      // Fetch product and explicitly select the vendor field
      const product = await Product.findById(item.product).select(
        "price vendorId name"
      ); // <-- MODIFIED: Use vendorId from Product model

      if (!product) {
        return res
          .status(404)
          .json({ message: `Product not found: ${item.product}` });
      }

      // The Product model uses 'vendorId' (type: String) but the Order model expects ObjectId.
      // We must use the Product's 'vendorId' field.
      if (!product.vendorId) {
        return res
          .status(500)
          .json({ message: `Product ${product.name} is missing a vendorId.` });
      }

      // Ensure vendorId is a valid ObjectId before saving to the Order (best practice, even if stored as string in Product)
      if (!mongoose.Types.ObjectId.isValid(product.vendorId)) {
        return res.status(500).json({
          message: `Vendor ID for product ${product.name} is invalid.`,
        });
      }

      const itemPrice = product.price;
      const itemTotal = itemPrice * item.quantity;
      totalAmount += itemTotal;

      processedItems.push({
        product: item.product,
        name: product.name,
        quantity: item.quantity,
        price: itemPrice,
        vendor: product.vendorId, // <-- CRUCIAL FIX: Assign the required vendor ID
      });
    }

    // Add a small shipping fee simulation
    const SHIPPING_FEE = 300;
    totalAmount += SHIPPING_FEE;

    // 2. Create the Order
    const newOrder = new Order({
      user: userId,
      items: processedItems,
      shippingAddress: shippingAddress,
      totalAmount: totalAmount,
      paymentStatus: "Paid",
      orderStatus: "Processing",
    });

    await newOrder.save();

    res.status(201).json({
      message: "Order placed successfully. Payment simulated as successful.",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("Order placement error:", error);
    // Log the detailed validation error structure for better debugging
    res.status(500).json({
      message: "Failed to place order due to validation issues.",
      details: error.message,
    });
  }
};

/**
 * Buyer views their order history.
 */
export const getBuyerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select("-items.vendor -items.product"); // Exclude redundant refs for history list

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order history." });
  }
};
