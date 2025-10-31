import Product from "../models/product.model.js";
import { User } from "../models/user.model.js";
import VendorProfile from "../models/vendorProfile.model.js";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";

const removeFile = (filePath) => {
  if (!filePath) return;
  const full = path.join(process.cwd(), filePath.replace(/^\//, ""));
  fs.unlink(full, (err) => {});
};

function escapeRegex(str = "") {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function enrichVendorDisplay(products = []) {
  if (!Array.isArray(products) || products.length === 0) return products;

  const objectIdCandidates = new Set();
  const stringCandidates = new Set();

  for (const p of products) {
    const v = p.vendorId;
    if (!v) continue;
    const s = String(v);
    if (mongoose.Types.ObjectId.isValid(s)) objectIdCandidates.add(s);
    else stringCandidates.add(s.toLowerCase());
  }

  const vendorProfileByUser = new Map();
  const vendorProfileById = new Map();
  const vendorProfileByLowerBusiness = new Map();
  const userById = new Map();

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

    const users = await User.find({ _id: { $in: ids } })
      .select("name")
      .lean();
    for (const u of users) userById.set(String(u._id), u);
  }

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

  return products.map((p) => {
    const copy = { ...p };
    try {
      if (copy.vendorName && String(copy.vendorName).trim()) {
        copy.vendorName = String(copy.vendorName).trim();
        return copy;
      }

      const vidRaw = copy.vendorId ? String(copy.vendorId) : "";

      if (vidRaw && mongoose.Types.ObjectId.isValid(vidRaw)) {
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
        const vp = vendorProfileByLowerBusiness.get(vidRaw.toLowerCase());
        if (vp && vp.businessName) {
          copy.vendorName = vp.businessName;
          return copy;
        }
      }

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

function buildFilterSafe({ q, category, vendorId } = {}) {
  const clauses = [];

  if (category) clauses.push({ category });

  if (q) {
    const re = new RegExp(String(q), "i");
    clauses.push({
      $or: [{ name: re }, { category: re }, { description: re }],
    });
  }

  if (
    vendorId !== undefined &&
    vendorId !== null &&
    String(vendorId).trim() !== ""
  ) {
    const raw = String(vendorId).trim();

    if (mongoose.Types.ObjectId.isValid(raw)) {
      clauses.push({
        $or: [
          { vendorId: raw },
          { vendorId: new mongoose.Types.ObjectId(raw) },
        ],
      });
    } else {
      clauses.push({
        $or: [
          { vendorId: raw },
          { vendorId: new RegExp(`^${escapeRegex(raw)}$`, "i") },
        ],
      });
    }
  }

  if (clauses.length === 0) return {};
  if (clauses.length === 1) return clauses[0];
  return { $and: clauses };
}

export const list = async (req, res) => {
  try {
    const { q, limit = 100, skip = 0, category, vendorId } = req.query;

    const filter = buildFilterSafe({ q, category, vendorId });

    console.debug("products.list filter:", JSON.stringify(filter));

    let products;
    try {
      products = await Product.find(filter)
        .sort({ createdAt: -1 })
        .skip(Number(skip))
        .limit(Math.min(1000, Number(limit)))
        .lean();
    } catch (dbErr) {
      console.error(
        "DB query failed in products.list. Filter:",
        JSON.stringify(filter),
        dbErr && dbErr.stack ? dbErr.stack : dbErr
      );
      return res.status(500).json({
        message: "Failed to fetch products",
        details: String(dbErr?.message || dbErr),
      });
    }

    const enriched = await enrichVendorDisplay(products);
    res.json(enriched);
  } catch (err) {
    console.error("products list error:", err && err.stack ? err.stack : err);
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
    console.error("products getOne error:", err && err.stack ? err.stack : err);
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

export const createOne = async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      unit, // MODIFIED
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
      unit, // MODIFIED
      status,
      description,
      vendorId: vendorId || (req.user ? String(req.user._id) : vendorId),
      imagePath,
    };

    try {
      const resolvedVendorId = doc.vendorId;
      if (
        resolvedVendorId &&
        mongoose.Types.ObjectId.isValid(String(resolvedVendorId))
      ) {
        let vp = await VendorProfile.findOne({ user: resolvedVendorId })
          .select("businessName")
          .lean();
        if (!vp)
          vp = await VendorProfile.findById(resolvedVendorId)
            .select("businessName")
            .lean();
        if (vp && vp.businessName) doc.vendorName = vp.businessName;
      } else if (doc.vendorId) {
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
      if (!doc.vendorName && req.user && req.user.name)
        doc.vendorName = req.user.name;
    } catch (e) {
      if (!doc.vendorName && req.user && req.user.name)
        doc.vendorName = req.user.name;
    }

    const product = await Product.create(doc);
    const [enriched] = await enrichVendorDisplay([product.toObject()]);
    res.status(201).json(enriched);
  } catch (err) {
    console.error(
      "products createOne error:",
      err && err.stack ? err.stack : err
    );
    res.status(500).json({ message: "Failed to create product" });
  }
};

export const updateOne = async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      unit, // MODIFIED
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
    if (unit !== undefined) product.unit = unit; // MODIFIED
    if (status !== undefined) product.status = status;
    if (description !== undefined) product.description = description;
    if (vendorId !== undefined) product.vendorId = vendorId;

    try {
      const resolvedVendorId = vendorId || product.vendorId;
      if (
        resolvedVendorId &&
        mongoose.Types.ObjectId.isValid(String(resolvedVendorId))
      ) {
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
    console.error(
      "products updateOne error:",
      err && err.stack ? err.stack : err
    );
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
    console.error(
      "products removeOne error:",
      err && err.stack ? err.stack : err
    );
    res.status(500).json({ message: "Failed to delete product" });
  }
};
