import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ["laminates", "wall-cladding", "soft-stone", "louvers-panels"]
    },
    textureType: { type: String, default: "" },
    color: { type: String, default: "" },
    finish: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    shortDescription: { type: String, default: "" },
    features: { type: [String], default: [] },
    specifications: {
      dimensions: { type: String, default: "600x2400mm" },
      thickness: { type: String, default: "4mm" },
      material: { type: String, default: "" },
      weight: { type: String, default: "" },
      application: { type: String, default: "" },
      warranty: { type: String, default: "" }
    },
    heroImage: { type: String, required: true },
    gallery: { type: [String], default: [] },
    isFeatured: { type: Boolean, default: false },
    price: { type: String, default: "" }
  },
  { timestamps: true }
);

productSchema.index({ category: 1, finish: 1, createdAt: -1 });
productSchema.index({ isFeatured: 1, createdAt: -1 });
productSchema.index({ name: "text", description: "text" });

export const Product = mongoose.model("Product", productSchema);
