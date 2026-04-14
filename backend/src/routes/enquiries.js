import express from "express";
import {
  getEnquiries,
  submitEnquiry,
  markEnquiryRead,
  updateEnquiryStatus,
  deleteEnquiry
} from "../controllers/enquiryController.js";
import { verifyToken } from "../middleware/auth.js";
import { validateEnquiry } from "../middleware/validate.js";

const router = express.Router();

// ─── Public Route ───
router.post("/", validateEnquiry, submitEnquiry);

// ─── Admin-Only Routes ───
router.get("/", verifyToken, getEnquiries);
router.patch("/:id/read", verifyToken, markEnquiryRead);
router.patch("/:id/status", verifyToken, updateEnquiryStatus);
router.delete("/:id", verifyToken, deleteEnquiry);

export default router;
