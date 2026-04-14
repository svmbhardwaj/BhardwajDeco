import { body, validationResult } from "express-validator";

/**
 * Middleware factory: runs validation chains and returns 400 if any fail.
 */
function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((e) => ({
        field: e.path,
        message: e.msg
      }))
    });
  }
  next();
}

// ─── Product Validation ───
export const validateProduct = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ max: 200 })
    .withMessage("Name must be under 200 characters"),
  body("slug")
    .trim()
    .notEmpty()
    .withMessage("Slug is required")
    .matches(/^[a-z0-9-]+$/)
    .withMessage("Slug must contain only lowercase letters, numbers, and hyphens"),
  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isIn(["laminates", "wall-cladding", "soft-stone", "louvers-panels"])
    .withMessage("Invalid category"),
  body("finish")
    .trim()
    .notEmpty()
    .withMessage("Finish type is required"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 5000 })
    .withMessage("Description must be under 5000 characters"),
  body("heroImage")
    .trim()
    .notEmpty()
    .withMessage("Hero image URL is required"),
  handleValidation
];

// ─── Enquiry Validation ───
export const validateEnquiry = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Your name is required")
    .isLength({ max: 100 })
    .withMessage("Name must be under 100 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .isLength({ min: 10, max: 15 })
    .withMessage("Phone number must be 10-15 digits"),
  body("productId")
    .optional({ nullable: true })
    .trim()
    .isMongoId()
    .withMessage("Product ID must be a valid ObjectId"),
  body("productName")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 200 })
    .withMessage("Product name must be under 200 characters"),
  body("message")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Message must be under 2000 characters"),
  handleValidation
];

// ─── Login Validation ───
export const validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  handleValidation
];

// ─── Update Post Validation ───
export const validateUpdate = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 300 })
    .withMessage("Title must be under 300 characters"),
  body("slug")
    .trim()
    .notEmpty()
    .withMessage("Slug is required")
    .matches(/^[a-z0-9-]+$/)
    .withMessage("Slug must contain only lowercase letters, numbers, and hyphens"),
  body("excerpt")
    .trim()
    .notEmpty()
    .withMessage("Excerpt is required")
    .isLength({ max: 500 })
    .withMessage("Excerpt must be under 500 characters"),
  body("coverImage")
    .trim()
    .notEmpty()
    .withMessage("Cover image URL is required"),
  handleValidation
];
