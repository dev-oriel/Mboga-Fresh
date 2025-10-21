// backend/controllers/bulkProducts.controller.js
import BulkProduct from "../models/bulkProduct.model.js";
import fs from "fs";
import path from "path";
import Joi from "joi";

const removeFile = (filePath) => {
  if (!filePath) return;
  const full = path.join(process.cwd(), filePath.replace(/^\//, ""));
  fs.unlink(full, (err) => {});
};

const createSchema = Joi.object({
  name: Joi.string().min(2).required(),
  category: Joi.string().required(),
  price: Joi.number().min(0).required(),
  priceLabel: Joi.string().allow("").optional(),
  quantity: Joi.string().allow("").optional(),
  status: Joi.string().valid("In Stock", "Out of Stock").optional(),
  description: Joi.string().allow("").optional(),
  vendorAssignedId: Joi.string().allow("").optional(),
});

const updateSchema = Joi.object({
  name: Joi.string().min(2).optional(),
  category: Joi.string().optional(),
  price: Joi.number().min(0).optional(),
  priceLabel: Joi.string().allow("").optional(),
  quantity: Joi.string().allow("").optional(),
  status: Joi.string().valid("In Stock", "Out of Stock").optional(),
  description: Joi.string().allow("").optional(),
  vendorAssignedId: Joi.string().allow("").optional(),
});

// Helper to pick uploaded file (handles multer.single -> req.file and multer.any -> req.files[])
function firstUploadedFile(req) {
  if (req.file) return req.file;
  if (Array.isArray(req.files) && req.files.length > 0) return req.files[0];
  return null;
}

// list bulk products: supports ?ownerId=...&q=...&limit=&skip=
export const list = async (req, res) => {
  try {
    const { ownerId, q, limit = 50, skip = 0 } = req.query;
    const filter = {};
    if (ownerId) filter.ownerId = ownerId;
    if (q) {
      filter.$or = [
        { name: new RegExp(q, "i") },
        { category: new RegExp(q, "i") },
      ];
    }

    // populate ownerId with only the name field
    const items = await BulkProduct.find(filter)
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Math.min(1000, Number(limit)))
      .populate("ownerId", "name"); // <--- populate owner name

    // convert mongoose docs to plain objects and add ownerName convenience field
    const payload = items.map((doc) => {
      const obj = doc.toObject ? doc.toObject() : doc;
      obj.ownerName =
        obj.ownerId && obj.ownerId.name ? obj.ownerId.name : undefined;
      return obj;
    });

    res.json(payload);
  } catch (err) {
    console.error("bulk list error:", err);
    res.status(500).json({ message: "Failed to fetch bulk products" });
  }
};

export const getOne = async (req, res) => {
  try {
    const p = await BulkProduct.findById(req.params.id)
      .populate("ownerId", "name")
      .lean();
    if (!p) return res.status(404).json({ message: "Bulk product not found" });
    // attach ownerName convenience field
    const payload = {
      ...p,
      ownerName: p.ownerId && p.ownerId.name ? p.ownerId.name : undefined,
    };
    res.json(payload);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch bulk product" });
  }
};

// create: requires authentication; owner set from req.user
export const createOne = async (req, res) => {
  try {
    if (!req.user)
      return res.status(401).json({ message: "Authentication required" });

    const payload = {
      name: req.body.name,
      category: req.body.category,
      price: Number(req.body.price || 0),
      priceLabel: req.body.priceLabel || `KSh ${Number(req.body.price || 0)}`,
      quantity: req.body.quantity || req.body.stock || "",
      status: req.body.status || "In Stock",
      description: req.body.description || "",
      vendorAssignedId: req.body.vendorAssignedId || "",
    };

    const { error } = createSchema.validate(payload);
    if (error) return res.status(400).json({ message: error.message });

    const uploaded = firstUploadedFile(req);
    if (uploaded) {
      payload.imagePath = `/uploads/${uploaded.filename}`;
    }

    payload.ownerId = req.user._id;
    payload.ownerRole = req.user.role || "farmer";

    const created = await BulkProduct.create(payload);
    res.status(201).json(created);
  } catch (err) {
    console.error("create bulk error:", err);
    res.status(500).json({ message: "Failed to create bulk product" });
  }
};

// update: only owner or admin may update
export const updateOne = async (req, res) => {
  try {
    const product = await BulkProduct.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Bulk product not found" });

    if (!req.user)
      return res.status(401).json({ message: "Authentication required" });
    const isOwner = String(product.ownerId) === String(req.user._id);
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Forbidden — not owner" });
    }

    const payload = {
      name: req.body.name,
      category: req.body.category,
      price:
        typeof req.body.price !== "undefined"
          ? Number(req.body.price)
          : undefined,
      priceLabel: req.body.priceLabel,
      quantity: req.body.quantity || req.body.stock,
      status: req.body.status,
      description: req.body.description,
      vendorAssignedId: req.body.vendorAssignedId,
    };

    const { error } = updateSchema.validate(payload);
    if (error) return res.status(400).json({ message: error.message });

    const uploaded = firstUploadedFile(req);
    if (uploaded) {
      if (product.imagePath) removeFile(product.imagePath);
      product.imagePath = `/uploads/${uploaded.filename}`;
    }

    for (const key of Object.keys(payload)) {
      if (typeof payload[key] !== "undefined") product[key] = payload[key];
    }

    await product.save();
    res.json(product);
  } catch (err) {
    console.error("update bulk error:", err);
    res.status(500).json({ message: "Failed to update bulk product" });
  }
};

export const removeOne = async (req, res) => {
  try {
    const product = await BulkProduct.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Bulk product not found" });

    if (!req.user)
      return res.status(401).json({ message: "Authentication required" });
    const isOwner = String(product.ownerId) === String(req.user._id);
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Forbidden — not owner" });
    }

    if (product.imagePath) removeFile(product.imagePath);
    await product.deleteOne();
    res.json({ message: "Bulk product deleted" });
  } catch (err) {
    console.error("delete bulk error:", err);
    res.status(500).json({ message: "Failed to delete bulk product" });
  }
};
