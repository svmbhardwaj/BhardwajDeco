import slugify from "slugify";
import { UpdatePost } from "../models/UpdatePost.js";
import { asyncHandler, apiError } from "../utils/helpers.js";

/**
 * GET /api/updates
 * Public — list all updates with pagination & type filtering.
 */
export const getUpdates = asyncHandler(async (req, res) => {
  const { type, limit = 20, page = 1 } = req.query;

  const filter = {};
  if (type && type !== "all") filter.type = type;

  const parsedLimit = Math.min(Number(limit) || 20, 50);
  const parsedPage = Math.max(Number(page) || 1, 1);
  const skip = (parsedPage - 1) * parsedLimit;

  const [updates, total] = await Promise.all([
    UpdatePost.find(filter)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(parsedLimit)
      .lean(),
    UpdatePost.countDocuments(filter)
  ]);

  res.json({
    success: true,
    data: updates,
    pagination: {
      page: parsedPage,
      limit: parsedLimit,
      total,
      pages: Math.ceil(total / parsedLimit)
    }
  });
});

/**
 * GET /api/updates/:slug
 * Public — get a single update by slug.
 */
export const getUpdateBySlug = asyncHandler(async (req, res) => {
  const update = await UpdatePost.findOne({ slug: req.params.slug }).lean();
  if (!update) throw apiError(404, "Update not found");

  res.json({ success: true, data: update });
});

/**
 * POST /api/updates
 * Admin-only — create a new update post.
 */
export const createUpdate = asyncHandler(async (req, res) => {
  // Auto-generate slug from title if not provided
  if (!req.body.slug && req.body.title) {
    req.body.slug = slugify(req.body.title, { lower: true, strict: true });
  }

  const update = await UpdatePost.create(req.body);

  res.status(201).json({
    success: true,
    data: update
  });
});

/**
 * PUT /api/updates/:id
 * Admin-only — update an existing update post.
 */
export const updateUpdate = asyncHandler(async (req, res) => {
  if (req.body.title && !req.body.slug) {
    req.body.slug = slugify(req.body.title, { lower: true, strict: true });
  }

  const update = await UpdatePost.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!update) throw apiError(404, "Update not found");

  res.json({ success: true, data: update });
});

/**
 * DELETE /api/updates/:id
 * Admin-only — delete an update post.
 */
export const deleteUpdate = asyncHandler(async (req, res) => {
  const update = await UpdatePost.findByIdAndDelete(req.params.id);
  if (!update) throw apiError(404, "Update not found");

  res.json({ success: true, message: "Update deleted" });
});
