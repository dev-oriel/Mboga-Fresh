// backend/controllers/products.controller.js
import Product from "../models/product.model.js";
import { User } from "../models/user.model.js";
import VendorProfile from "../models/vendorProfile.model.js";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";

const removeFile = (filePath) => {
  if (!filePath) return;
  // filePath expected like "/uploads/filename.ext"
  const full = path.join(process.cwd(), filePath.replace(/^\//, ""));
  fs.unlink(full, (err) => {
    // ignore errors
  });
};

function escapeRegex(str = "") {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Enrich products with vendor display name (prefer VendorProfile.businessName,
 * then User.name, then denormalized vendorName/vendor fields).
 * Handles vendorId that might be:
 *  - a User ObjectId (VendorProfile.user)
 *  - a VendorProfile ObjectId (VendorProfile._id)
 *  - a string slug/businessName
 */
async function enrichVendorDisplay(products = []) {
  if (!Array.isArray(products) || products.length === 0) return products;

  // collect candidates
  const objectIdCandidates = new Set();
  const stringCandidates = new Set();

  for (const p of products) {
    const v = p.vendorId;
    if (!v) continue;
    const s = String(v);
    if (mongoose.Types.ObjectId.isValid(s)) objectIdCandidates.add(s);
    else stringCandidates.add(s.toLowerCase());
  }

  // maps
  const vendorProfileByUser = new Map(); // userId -> VendorProfile
  const vendorProfileById = new Map(); // vendorProfileId -> VendorProfile
  const vendorProfileByLowerBusiness = new Map(); // lower(businessName) -> VendorProfile
  const userById = new Map(); // userId -> User

  // fetch vendor profiles by user or by _id if any
  if (objectIdCandidates.size > 0) {
    const ids = Array.from(objectIdCandidates);
    const profiles = await VendorProfile.find({
      $or: [{ user: { $in: ids } }, { _id: { $in: ids } }],
    })
      .select("user businessName")
      .lean();
    for (const vp of profiles) {
      if (vp.user) vendorProfileByUser.set(String(vp.user), vp);
      if (vp._id) vendorProfileById.set(String(vp._id), vp);
      if (vp.businessName)
        vendorProfileByLowerBusiness.set(
          String(vp.businessName).toLowerCase(),
          vp
        );
    }

    // fetch users for fallback display name when vendorId maps to a user id
    const users = await User.find({ _id: { $in: ids } })
      .select("name")
      .lean();
    for (const u of users) userById.set(String(u._id), u);
  }

  // For non-object string vendorId values (slugs or businessName strings),
  // attempt to find vendor profiles matching businessName case-insensitively.
  if (stringCandidates.size > 0) {
    const arr = Array.from(stringCandidates);
    const or = arr.map((v) => ({
      businessName: new RegExp(`^${escapeRegex(v)}$`, "i"),
    }));
    const matched = await VendorProfile.find({ $or: or })
      .select("user businessName")
      .lean();
    for (const vp of matched) {
      if (vp.user) vendorProfileByUser.set(String(vp.user), vp);
      if (vp._id) vendorProfileById.set(String(vp._id), vp);
      if (vp.businessName)
        vendorProfileByLowerBusiness.set(
          String(vp.businessName).toLowerCase(),
          vp
        );
    }
  }

  // Final mapping
  return products.map((p) => {
    const copy = { ...p };
    try {
      // priority:
      // 1) existing denormalized copy.vendorName
      // 2) VendorProfile.businessName (match by vendorProfile._id or vendorProfile.user)
      // 3) VendorProfile matched by businessName if vendorId was a string (non-ObjectId)
      // 4) User.name fallback
      // 5) copy.vendor or raw vendorId string
      if (copy.vendorName && String(copy.vendorName).trim()) {
        copy.vendorName = String(copy.vendorName).trim();
        return copy;
      }

      const vidRaw = copy.vendorId ? String(copy.vendorId) : "";

      if (vidRaw && mongoose.Types.ObjectId.isValid(vidRaw)) {
        // objectId path: try vendorProfileById, vendorProfileByUser, then User
        const vpById = vendorProfileById.get(vidRaw);
        if (vpById && vpById.businessName) {
          copy.vendorName = vpById.businessName;
          return copy;
        }
        const vpByUser = vendorProfileByUser.get(vidRaw);
        if (vpByUser && vpByUser.businessName) {
          copy.vendorName = vpByUser.businessName;
          return copy;
        }
        const u = userById.get(vidRaw);
        if (u && u.name) {
          copy.vendorName = u.name;
          return copy;
        }
      } else if (vidRaw) {
        // string path: try match by businessName case-insensitive
        const vp = vendorProfileByLowerBusiness.get(vidRaw.toLowerCase());
        if (vp && vp.businessName) {
          copy.vendorName = vp.businessName;
          return copy;
        }
      }

      // fallback to any vendor field or vendorId string
      copy.vendorName = (
        copy.vendorName ||
        copy.vendor ||
        (copy.vendorId ? String(copy.vendorId) : "") ||
        ""
      ).toString();
    } catch (err) {
      copy.vendorName =
        copy.vendorName ||
        copy.vendor ||
        (copy.vendorId ? String(copy.vendorId) : "");
    }
    return copy;
  });
}

export const list = async (req, res) => {
  try {
    const { q, limit = 100, skip = 0, category } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (q) {
      const re = new RegExp(q, "i");
      filter.$or = [{ name: re }, { category: re }, { description: re }];
    }

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Math.min(1000, Number(limit)))
      .lean();

    const enriched = await enrichVendorDisplay(products);
    res.json(enriched);
  } catch (err) {
    console.error("products list error:", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

export const getOne = async (req, res) => {
  try {
    const p = await Product.findById(req.params.id).lean();
    if (!p) return res.status(404).json({ message: "Product not found" });

    const [enriched] = await enrichVendorDisplay([p]);
    res.json(enriched);
  } catch (err) {
    console.error("products getOne error:", err);
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

    const file = req.file || (Array.isArray(req.files) ? req.files[0] : null);
    const imagePath = file ? `/uploads/${file.filename}` : "";

    const doc = {
      name,
      category,
      price: Number(price) || 0,
      priceLabel: priceLabel || `KSh ${Number(price) || 0}`,
      stock,
      status,
      description,
      vendorId: vendorId || (req.user ? String(req.user._id) : vendorId),
      imagePath,
    };

    // Try to denormalize vendorName using VendorProfile (prefer businessName), fallback to req.user.name
    try {
      const resolvedVendorId = doc.vendorId;
      if (
        resolvedVendorId &&
        mongoose.Types.ObjectId.isValid(String(resolvedVendorId))
      ) {
        // try VendorProfile by user or by _id
        let vp = await VendorProfile.findOne({ user: resolvedVendorId })
          .select("businessName")
          .lean();
        if (!vp)
          vp = await VendorProfile.findById(resolvedVendorId)
            .select("businessName")
            .lean();
        if (vp && vp.businessName) doc.vendorName = vp.businessName;
      } else if (doc.vendorId) {
        // vendorId is a string - try to match businessName case-insensitive
        const vp = await VendorProfile.findOne({
          businessName: new RegExp(
            `^${escapeRegex(String(doc.vendorId))}$`,
            "i"
          ),
        })
          .select("businessName")
          .lean();
        if (vp && vp.businessName) doc.vendorName = vp.businessName;
      }

      if (!doc.vendorName && req.user && req.user.name) {
        doc.vendorName = req.user.name;
      }
    } catch (e) {
      // ignore enrichment errors
      if (!doc.vendorName && req.user && req.user.name)
        doc.vendorName = req.user.name;
    }

    const product = await Product.create(doc);

    // return enriched version (ensures vendorName is present if possible)
    const [enriched] = await enrichVendorDisplay([product.toObject()]);
    res.status(201).json(enriched);
  } catch (err) {
    console.error("products createOne error:", err);
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

    const file = req.file || (Array.isArray(req.files) ? req.files[0] : null);
    if (file) {
      if (product.imagePath) removeFile(product.imagePath);
      product.imagePath = `/uploads/${file.filename}`;
    }

    if (name !== undefined) product.name = name;
    if (category !== undefined) product.category = category;
    if (price !== undefined) product.price = Number(price) || product.price;
    if (priceLabel !== undefined) product.priceLabel = priceLabel;
    if (stock !== undefined) product.stock = stock;
    if (status !== undefined) product.status = status;
    if (description !== undefined) product.description = description;
    if (vendorId !== undefined) product.vendorId = vendorId;

    // Try to keep denormalized vendorName in sync
    try {
      const resolvedVendorId = vendorId || product.vendorId;
      if (
        resolvedVendorId &&
        mongoose.Types.ObjectId.isValid(String(resolvedVendorId))
      ) {
        // try VendorProfile by user or by _id
        let vp = await VendorProfile.findOne({ user: resolvedVendorId })
          .select("businessName")
          .lean();
        if (!vp)
          vp = await VendorProfile.findById(resolvedVendorId)
            .select("businessName")
            .lean();
        if (vp && vp.businessName) product.vendorName = vp.businessName;
      } else if (resolvedVendorId) {
        const vp = await VendorProfile.findOne({
          businessName: new RegExp(
            `^${escapeRegex(String(resolvedVendorId))}$`,
            "i"
          ),
        })
          .select("businessName")
          .lean();
        if (vp && vp.businessName) product.vendorName = vp.businessName;
      }

      if (
        (!product.vendorName || product.vendorName.trim() === "") &&
        req.user &&
        req.user.name
      ) {
        product.vendorName = req.user.name;
      }
    } catch (e) {
      // ignore
      if (
        (!product.vendorName || product.vendorName.trim() === "") &&
        req.user &&
        req.user.name
      ) {
        product.vendorName = req.user.name;
      }
    }

    await product.save();

    const [enriched] = await enrichVendorDisplay([product.toObject()]);
    res.json(enriched);
  } catch (err) {
    console.error("products updateOne error:", err);
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
    console.error("products removeOne error:", err);
    res.status(500).json({ message: "Failed to delete product" });
  }
};
