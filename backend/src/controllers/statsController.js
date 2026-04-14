import { Product } from "../models/Product.js";
import { Enquiry } from "../models/Enquiry.js";
import { UpdatePost } from "../models/UpdatePost.js";
import { asyncHandler } from "../utils/helpers.js";

/**
 * GET /api/stats/dashboard
 * Admin-only — aggregated dashboard statistics.
 */
export const getDashboardStats = asyncHandler(async (req, res) => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    totalProducts,
    totalEnquiries,
    totalUpdates,
    unreadEnquiries,
    featuredProducts,
    recentEnquiries,
    enquiriesByStatus,
    productsByCategory,
    enquiriesLast30Days
  ] = await Promise.all([
    Product.countDocuments(),
    Enquiry.countDocuments(),
    UpdatePost.countDocuments(),
    Enquiry.countDocuments({ isRead: false }),
    Product.countDocuments({ isFeatured: true }),
    Enquiry.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name productName email phone status isRead createdAt")
      .lean(),
    Enquiry.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]),
    Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]),
    // Daily enquiry count for the last 30 days (for charts)
    Enquiry.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ])
  ]);

  // Format status breakdown into an object
  const statusBreakdown = {};
  for (const item of enquiriesByStatus) {
    statusBreakdown[item._id || "unknown"] = item.count;
  }

  // Format category breakdown into an object
  const categoryBreakdown = {};
  for (const item of productsByCategory) {
    categoryBreakdown[item._id] = item.count;
  }

  res.json({
    success: true,
    data: {
      overview: {
        totalProducts,
        totalEnquiries,
        totalUpdates,
        unreadEnquiries,
        featuredProducts
      },
      enquiries: {
        statusBreakdown,
        recentEnquiries,
        dailyTrend: enquiriesLast30Days
      },
      products: {
        categoryBreakdown
      }
    }
  });
});
