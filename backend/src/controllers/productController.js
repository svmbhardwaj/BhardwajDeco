import slugify from "slugify";
import { Product } from "../models/Product.js";
import { asyncHandler, apiError } from "../utils/helpers.js";

/**
 * GET /api/products
 * Public — list products with powerful filtering, search, and pagination.
 */
export const getProducts = asyncHandler(async (req, res) => {
  const {
    category,
    finish,
    featured,
    search,
    sort = "-createdAt",
    limit = 50,
    page = 1
  } = req.query;

  const filter = {};

  if (category && category !== "all") filter.category = category;
  if (finish && finish !== "all" && finish !== "all finishes") filter.finish = finish;
  if (featured === "true") filter.isFeatured = true;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { textureType: { $regex: search, $options: "i" } },
      { color: { $regex: search, $options: "i" } }
    ];
  }

  // Parse sort: "-createdAt" → { createdAt: -1 }, "name" → { name: 1 }
  const sortObj = {};
  const sortFields = sort.split(",");
  for (const field of sortFields) {
    if (field.startsWith("-")) {
      sortObj[field.substring(1)] = -1;
    } else {
      sortObj[field] = 1;
    }
  }

  const parsedLimit = Math.min(Number(limit) || 50, 100);
  const parsedPage = Math.max(Number(page) || 1, 1);
  const skip = (parsedPage - 1) * parsedLimit;

  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(parsedLimit)
      .lean(),
    Product.countDocuments(filter)
  ]);

  // Extract unique filter options for the frontend
  const categories = await Product.distinct("category");
  const finishes = await Product.distinct("finish");

  res.set("X-Total-Count", String(total));
  res.json({
    success: true,
    data: products,
    filters: { categories, finishes },
    pagination: {
      page: parsedPage,
      limit: parsedLimit,
      total,
      pages: Math.ceil(total / parsedLimit)
    }
  });
});

/**
 * GET /api/products/:slug
 * Public — get a single product by slug with related products.
 */
export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }).lean();
  if (!product) throw apiError(404, "Product not found");

  // Fetch 4 related products from the same category (excluding current)
  const related = await Product.find({
    category: product.category,
    _id: { $ne: product._id }
  })
    .sort({ isFeatured: -1, createdAt: -1 })
    .limit(4)
    .select("name slug heroImage category finish price")
    .lean();

  res.json({
    success: true,
    data: product,
    related
  });
});

/**
 * POST /api/products
 * Admin-only — create a new product. Auto-generates slug if not provided.
 */
export const createProduct = asyncHandler(async (req, res) => {
  // Auto-generate slug from name if not provided
  if (!req.body.slug && req.body.name) {
    req.body.slug = slugify(req.body.name, { lower: true, strict: true });
  }

  // Check for duplicate slug
  const existing = await Product.findOne({ slug: req.body.slug });
  if (existing) {
    // Append a unique suffix
    req.body.slug = `${req.body.slug}-${Date.now().toString(36)}`;
  }

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    data: product
  });
});

/**
 * PUT /api/products/:id
 * Admin-only — update a product by ID.
 */
export const updateProduct = asyncHandler(async (req, res) => {
  // Re-generate slug if name changed and no slug explicitly provided
  if (req.body.name && !req.body.slug) {
    req.body.slug = slugify(req.body.name, { lower: true, strict: true });
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!product) throw apiError(404, "Product not found");

  res.json({ success: true, data: product });
});

/**
 * DELETE /api/products/:id
 * Admin-only — delete a product by ID.
 */
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw apiError(404, "Product not found");

  res.json({ success: true, message: "Product deleted" });
});
