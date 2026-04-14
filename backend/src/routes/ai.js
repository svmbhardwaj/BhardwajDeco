import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { enhanceDescription } from "../services/aiEnhancer.js";

const router = express.Router();

/**
 * POST /api/ai/enhance-description
 * Admin-only — enhance a product description using AI.
 */
router.post("/enhance-description", verifyToken, async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Text is required for enhancement"
      });
    }

    if (text.length > 5000) {
      return res.status(400).json({
        success: false,
        message: "Text must be under 5000 characters"
      });
    }

    const result = await enhanceDescription(text);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
});

export default router;
