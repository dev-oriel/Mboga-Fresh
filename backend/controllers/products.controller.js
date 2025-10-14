// backend/controllers/products.controller.js
import Product from "../models/product.model.js";
import fs from "fs";
import path from "path";

const removeFile = (filePath) => {
  if (!filePath) return;
  // filePath is expected like "/uploads/filename.ext"
  const full = path.join(process.cwd(), filePath.replace(/^\//, ""));
  fs.unlink(full, (err) => {
    // ignore errors
  });
};

export const list = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

export const getOne = async (req, res) => {
  try {
    const p = await Product.findById(req.params.id).lean();
    if (!p) return res.status(404).json({ message: "Product not found" });
    res.json(p);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

export const createOne = async (req, res) => {
  try {
    const {
      name,
      category,
      priceLabel,
      price,
      stock,
      status,
      description,
      vendorId,
    } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";
    const product = await Product.create({
      name,
      category,
      price: Number(price) || 0,
      priceLabel: priceLabel || `KSh ${Number(price) || 0}`,
      stock,
      status,
      description,
      vendorId,
      imagePath,
    });
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create product" });
  }
};

export const updateOne = async (req, res) => {
  try {
    const {
      name,
      category,
      priceLabel,
      price,
      stock,
      status,
      description,
      vendorId,
    } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (req.file) {
      // remove old
      if (product.imagePath) removeFile(product.imagePath);
      product.imagePath = `/uploads/${req.file.filename}`;
    }

    if (name !== undefined) product.name = name;
    if (category !== undefined) product.category = category;
    if (price !== undefined) product.price = Number(price) || product.price;
    if (priceLabel !== undefined) product.priceLabel = priceLabel;
    if (stock !== undefined) product.stock = stock;
    if (status !== undefined) product.status = status;
    if (description !== undefined) product.description = description;
    if (vendorId !== undefined) product.vendorId = vendorId;

    await product.save();
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update product" });
  }
};

export const removeOne = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.imagePath) removeFile(product.imagePath);
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete product" });
  }
};
