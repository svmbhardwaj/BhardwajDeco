import jwt from "jsonwebtoken";
import { Admin } from "../models/Admin.js";
import { env } from "../config/env.js";
import { asyncHandler, apiError } from "../utils/helpers.js";

/**
 * POST /api/auth/login
 * Authenticate admin and return JWT token.
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find admin and explicitly select password field
  const admin = await Admin.findOne({ email }).select("+password");
  if (!admin) throw apiError(401, "Invalid email or password");

  // Verify password
  const isMatch = await admin.comparePassword(password);
  if (!isMatch) throw apiError(401, "Invalid email or password");

  // Update last login timestamp
  admin.lastLogin = new Date();
  await admin.save();

  // Generate JWT
  const token = jwt.sign(
    { id: admin._id, email: admin.email },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );

  res.json({
    success: true,
    token,
    admin: {
      id: admin._id,
      email: admin.email,
      lastLogin: admin.lastLogin
    }
  });
});

/**
 * GET /api/auth/me
 * Return current admin profile (requires token).
 */
export const getProfile = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    admin: {
      id: req.admin._id,
      email: req.admin.email,
      lastLogin: req.admin.lastLogin
    }
  });
});

/**
 * PUT /api/auth/change-password
 * Admin-only — change the admin password.
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw apiError(400, "Current password and new password are required");
  }
  if (newPassword.length < 8) {
    throw apiError(400, "New password must be at least 8 characters");
  }

  const admin = await Admin.findById(req.admin._id).select("+password");
  const isMatch = await admin.comparePassword(currentPassword);
  if (!isMatch) throw apiError(401, "Current password is incorrect");

  admin.password = newPassword;
  await admin.save(); // pre-save hook will hash it

  res.json({
    success: true,
    message: "Password changed successfully"
  });
});
