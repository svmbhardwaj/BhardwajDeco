import express from "express";
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";
import { verifyToken } from "../middleware/auth.js";
import { validateProduct } from "../middleware/validate.js";

const router = express.Router();

// ─── Public Routes ───
router.get("/", getProducts);
router.get("/:slug", getProductBySlug);

// ─── Admin-Only Routes ───
router.post("/", verifyToken, validateProduct, createProduct);
router.put("/:id", verifyToken, validateProduct, updateProduct);
router.delete("/:id", verifyToken, deleteProduct);

export default router;
