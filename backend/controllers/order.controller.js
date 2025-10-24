// backend/controllers/order.controller.js - FINAL VERSION

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
      // Validate MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(item.product)) {
        return res
          .status(400)
          .json({ message: `Invalid Product ID format: ${item.product}` });
      }

      // Fetch product and explicitly select the required fields, including imagePath
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

      processedItems.push({
        product: item.product,
        name: product.name,
        quantity: item.quantity,
        price: itemPrice,
        vendor: product.vendorId,
        image: product.imagePath, // CRITICAL FIX: Use the correct field name
      });
    }

    // Add a small shipping fee simulation
    const SHIPPING_FEE = 210;
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
      .select("-__v -updatedAt");

    res.json(orders);
  } catch (error) {
    console.error("Error fetching buyer orders:", error);
    res.status(500).json({ message: "Failed to fetch order history." });
  }
};

/**
 * Get details for a specific order by ID.
 */
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
