import mongoose from "mongoose";

const updatePostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    excerpt: { type: String, required: true },
    content: { type: String, default: "" },
    type: {
      type: String,
      enum: ["price-update", "new-arrival", "market-trend", "general"],
      default: "general"
    },
    coverImage: { type: String, required: true },
    publishedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

updatePostSchema.index({ publishedAt: -1 });

export const UpdatePost = mongoose.model("UpdatePost", updatePostSchema);
