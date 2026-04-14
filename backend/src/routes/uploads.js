import express from "express";
import multer from "multer";
import { uploadImage, getAuthParams } from "../utils/imagekit.js";
import { verifyToken } from "../middleware/auth.js";
import { asyncHandler, apiError } from "../utils/helpers.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
      "image/svg+xml"
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, WebP, AVIF, and SVG images are allowed"), false);
    }
  }
});

/**
 * POST /api/uploads/image
 * Admin-only — upload a single image to ImageKit CDN.
 */
router.post(
  "/image",
  verifyToken,
  upload.single("image"),
  asyncHandler(async (req, res) => {
    if (!req.file) throw apiError(400, "Image file is required");

    const folder = req.body.folder || "/products";
    const result = await uploadImage(req.file.buffer, req.file.originalname, folder);

    res.json({ success: true, data: result });
  })
);

/**
 * POST /api/uploads/images
 * Admin-only — upload multiple images (up to 10).
 */
router.post(
  "/images",
  verifyToken,
  upload.array("images", 10),
  asyncHandler(async (req, res) => {
    if (!req.files || req.files.length === 0) {
      throw apiError(400, "At least one image file is required");
    }

    const folder = req.body.folder || "/products";
    const results = await Promise.all(
      req.files.map((file) => uploadImage(file.buffer, file.originalname, folder))
    );

    res.json({ success: true, data: results });
  })
);

/**
 * GET /api/uploads/auth
 * Admin-only — get ImageKit auth params for client-side uploads.
 */
router.get(
  "/auth",
  verifyToken,
  asyncHandler(async (_req, res) => {
    const params = getAuthParams();
    if (!params) throw apiError(503, "ImageKit not configured");

    res.json({ success: true, data: params });
  })
);

export default router;
