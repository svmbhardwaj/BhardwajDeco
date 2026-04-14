import express from "express";
import { getDashboardStats } from "../controllers/statsController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// GET /api/stats/dashboard — Admin dashboard analytics
router.get("/dashboard", verifyToken, getDashboardStats);

export default router;
