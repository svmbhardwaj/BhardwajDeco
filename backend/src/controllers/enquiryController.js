import { Enquiry } from "../models/Enquiry.js";
import { sendCustomerConfirmation, sendAdminNotification } from "../services/mailer.js";
import { asyncHandler, apiError } from "../utils/helpers.js";

/**
 * GET /api/enquiries
 * Admin-only — list all enquiries with filtering & pagination.
 */
export const getEnquiries = asyncHandler(async (req, res) => {
  const { status, isRead, limit = 50, page = 1 } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (isRead !== undefined) filter.isRead = isRead === "true";

  const parsedLimit = Math.min(Number(limit) || 50, 100);
  const parsedPage = Math.max(Number(page) || 1, 1);
  const skip = (parsedPage - 1) * parsedLimit;

  const [enquiries, total, unreadCount] = await Promise.all([
    Enquiry.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parsedLimit)
      .lean(),
    Enquiry.countDocuments(filter),
    Enquiry.countDocuments({ isRead: false })
  ]);

  res.json({
    success: true,
    data: enquiries,
    unreadCount,
    pagination: {
      page: parsedPage,
      limit: parsedLimit,
      total,
      pages: Math.ceil(total / parsedLimit)
    }
  });
});

/**
 * POST /api/enquiries
 * Public — submit a new enquiry.
 * Triggers:
 *   1. Confirmation email to customer (via Brevo)
 *   2. Notification email to admin (via Brevo)
 */
export const submitEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.create({
    ...req.body,
    productId: req.body.productId || null,
    productName: req.body.productName?.trim() || "General Enquiry"
  });

  // Fire-and-forget email notifications (don't block the response)
  Promise.allSettled([
    sendCustomerConfirmation(enquiry),
    sendAdminNotification(enquiry)
  ]).catch((err) => {
    console.error("Email notification error:", err.message);
  });

  res.status(201).json({
    success: true,
    message: "Thank you! Your enquiry has been submitted. Check your email for confirmation.",
    data: {
      id: enquiry._id,
      productName: enquiry.productName,
      createdAt: enquiry.createdAt
    }
  });
});

/**
 * PATCH /api/enquiries/:id/read
 * Admin-only — mark an enquiry as read.
 */
export const markEnquiryRead = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.findByIdAndUpdate(
    req.params.id,
    { isRead: true },
    { new: true }
  );

  if (!enquiry) throw apiError(404, "Enquiry not found");

  res.json({ success: true, data: enquiry });
});

/**
 * PATCH /api/enquiries/:id/status
 * Admin-only — update enquiry status.
 */
export const updateEnquiryStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ["new", "contacted", "closed"];

  if (!validStatuses.includes(status)) {
    throw apiError(400, `Status must be one of: ${validStatuses.join(", ")}`);
  }

  // If moving to "contacted", also mark as read
  const update = { status };
  if (status === "contacted" || status === "closed") {
    update.isRead = true;
  }

  const enquiry = await Enquiry.findByIdAndUpdate(
    req.params.id,
    update,
    { new: true }
  );

  if (!enquiry) throw apiError(404, "Enquiry not found");

  res.json({ success: true, data: enquiry });
});

/**
 * DELETE /api/enquiries/:id
 * Admin-only — delete an enquiry.
 */
export const deleteEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
  if (!enquiry) throw apiError(404, "Enquiry not found");

  res.json({ success: true, message: "Enquiry deleted" });
});
