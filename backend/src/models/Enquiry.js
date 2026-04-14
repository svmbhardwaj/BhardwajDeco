import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null
    },
    productName: { type: String, default: "General Enquiry" },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    message: { type: String, default: "" },
    isRead: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new"
    }
  },
  { timestamps: true }
);

enquirySchema.index({ createdAt: -1 });
enquirySchema.index({ isRead: 1, createdAt: -1 });
enquirySchema.index({ status: 1 });

export const Enquiry = mongoose.model("Enquiry", enquirySchema);
