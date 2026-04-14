import express from "express";
import { login, getProfile, changePassword } from "../controllers/authController.js";
import { verifyToken } from "../middleware/auth.js";
import { validateLogin } from "../middleware/validate.js";

const router = express.Router();

// POST /api/auth/login — Authenticate admin
router.post("/login", validateLogin, login);

// GET /api/auth/me — Get current admin profile (protected)
router.get("/me", verifyToken, getProfile);

// PUT /api/auth/change-password — Change admin password (protected)
router.put("/change-password", verifyToken, changePassword);

export default router;
