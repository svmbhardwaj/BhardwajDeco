import express from "express";
import {
  getUpdates,
  getUpdateBySlug,
  createUpdate,
  updateUpdate,
  deleteUpdate
} from "../controllers/updateController.js";
import { verifyToken } from "../middleware/auth.js";
import { validateUpdate } from "../middleware/validate.js";

const router = express.Router();

// ─── Public Routes ───
router.get("/", getUpdates);
router.get("/:slug", getUpdateBySlug);

// ─── Admin-Only Routes ───
router.post("/", verifyToken, validateUpdate, createUpdate);
router.put("/:id", verifyToken, validateUpdate, updateUpdate);
router.delete("/:id", verifyToken, deleteUpdate);

export default router;
