export type ProductCategory = "laminates" | "wall-cladding" | "soft-stone" | "louvers-panels";

export interface ProductSpecification {
  dimensions: string;
  thickness: string;
  material?: string;
  weight?: string;
  application?: string;
  warranty?: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  textureType?: string;
  color?: string;
  finish: string;
  description: string;
  shortDescription?: string;
  features?: string[];
  specifications?: ProductSpecification;
  heroImage: string;
  gallery: string[];
  isFeatured: boolean;
  price?: string;
  createdAt: string;
}

export interface UpdatePost {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  type?: "price-update" | "new-arrival" | "market-trend" | "general";
  coverImage: string;
  publishedAt: string;
}

export interface Enquiry {
  _id: string;
  productId: string;
  productName: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface EnquiryPayload {
  productId: string;
  productName: string;
  name: string;
  email: string;
  phone: string;
  message: string;
}
