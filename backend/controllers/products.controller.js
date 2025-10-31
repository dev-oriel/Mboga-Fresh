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

async function buildFilterSafe({
  q,
  category,
  vendorId,
  minPrice,
  maxPrice,
  status,
  location,
} = {}) {
  const clauses = [];

  if (category) {
    clauses.push({ category: new RegExp(`^${escapeRegex(category)}$`, "i") });
  }
  if (status) clauses.push({ status });

  if (minPrice || maxPrice) {
    const priceClause = {};
    if (minPrice && Number(minPrice) > 0) priceClause.$gte = Number(minPrice);
    if (maxPrice && Number(maxPrice) > 0) priceClause.$lte = Number(maxPrice);
    if (Object.keys(priceClause).length > 0) {
      clauses.push({ price: priceClause });
    }
  }

  if (q) {
    const re = new RegExp(String(q), "i");
    clauses.push({
      $or: [{ name: re }, { category: re }, { description: re }],
    });
  }

  let vendorIdsFromLocation = null;

  if (location && location !== "All Locations") {
    const vendors = await VendorProfile.find({
      location: new RegExp(`^${escapeRegex(location)}$`, "i"),
    })
      .select("_id user")
      .lean();

    vendorIdsFromLocation = new Set();
    vendors.forEach((v) => {
      vendorIdsFromLocation.add(String(v._id));
      if (v.user) vendorIdsFromLocation.add(String(v.user));
    });

    if (vendorIdsFromLocation.size === 0) {
      clauses.push({ _id: new mongoose.Types.ObjectId() });
    }
  }

  if (vendorId) {
    const raw = String(vendorId).trim();
    const vendorOrClause = [];

    // MODIFIED: Check against user.id OR user._id
    if (mongoose.Types.ObjectId.isValid(raw)) {
      vendorOrClause.push({ vendorId: raw });
      vendorOrClause.push({ vendorId: new mongoose.Types.ObjectId(raw) });
    } else {
      vendorOrClause.push({ vendorId: raw });
    }

    if (vendorIdsFromLocation) {
      if (vendorIdsFromLocation.has(raw)) {
        clauses.push({ $or: vendorOrClause });
      } else {
        clauses.push({ _id: new mongoose.Types.ObjectId() });
      }
    } else {
      clauses.push({ $or: vendorOrClause });
    }
  } else if (vendorIdsFromLocation) {
    const vendorIdArray = Array.from(vendorIdsFromLocation).flatMap((id) => {
      if (mongoose.Types.ObjectId.isValid(id)) {
        return [id, new mongoose.Types.ObjectId(id)];
      }
      return [id];
    });
    clauses.push({ vendorId: { $in: vendorIdArray } });
  }

  if (clauses.length === 0) return {};
  if (clauses.length === 1) return clauses[0];
  return { $and: clauses };
}

export const list = async (req, res) => {
  try {
    // MODIFIED: Added page and limit
    const {
      q,
      limit = 12, // Default to 12 products per page
      page = 1, // Default to page 1
      skip, // We will let 'page' override 'skip'
      category,
      vendorId,
      minPrice,
      maxPrice,
      status,
      location,
      sortBy,
    } = req.query;

    const limitNum = Number(limit);
    const pageNum = Number(page);
    // Calculate skip based on page and limit
    const skipNum = skip ? Number(skip) : (pageNum - 1) * limitNum;

    const filter = await buildFilterSafe({
      q,
      category,
      vendorId,
      minPrice,
      maxPrice,
      status,
      location,
    });

    console.debug("products.list filter:", JSON.stringify(filter));

    let sort = { createdAt: -1 };
    if (sortBy === "price-asc") {
      sort = { price: 1 };
    } else if (sortBy === "price-desc") {
      sort = { price: -1 };
    }

    let products;
    let totalProducts = 0;
    try {
      // MODIFIED: Run two queries in parallel
      [totalProducts, products] = await Promise.all([
        Product.countDocuments(filter), // 1. Get total count
        Product.find(filter) // 2. Get paginated products
          .sort(sort)
          .skip(skipNum)
          .limit(limitNum)
          .lean(),
      ]);
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

    const totalPages = Math.ceil(totalProducts / limitNum) || 1;
    const enriched = await enrichVendorDisplay(products);

    // MODIFIED: Return a pagination object
    res.json({
      products: enriched,
      totalPages,
      currentPage: pageNum,
      totalProducts,
    });
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
    const { name, category, price, unit, status, description, vendorId } =
      req.body;

    const file = req.file || (Array.isArray(req.files) ? req.files[0] : null);
    const imagePath = file ? `/uploads/${file.filename}` : "";

    const doc = {
      name,
      category,
      price: Number(price) || 0,
      unit,
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
    const { name, category, price, unit, status, description, vendorId } =
      req.body;
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
    if (unit !== undefined) product.unit = unit;
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
