import express from "express";
import { listVendorsForFilter } from "../controllers/vendor.controller.js";

const router = express.Router();

// This route is public, for populating marketplace filters
router.get("/filter-list", listVendorsForFilter);

export default router;
