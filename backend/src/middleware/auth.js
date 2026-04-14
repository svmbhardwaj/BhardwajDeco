import jwt from "jsonwebtoken";
import { Admin } from "../models/Admin.js";
import { env } from "../config/env.js";

/**
 * Middleware: Verify JWT token from Authorization header.
 * Attaches the admin document to `req.admin` on success.
 */
export async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access denied. No token provided."
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, env.jwtSecret);

    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({
        message: "Access denied. Admin account not found."
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token." });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired. Please login again." });
    }
    next(error);
  }
}
