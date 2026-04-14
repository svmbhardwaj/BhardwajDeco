"use client";

import { Enquiry, EnquiryPayload, Product, UpdatePost } from "./types";
import { DEMO_PRODUCTS, DEMO_UPDATES } from "./seed-data";

const PRODUCTS_KEY = "bhardwajdeco_products";
const UPDATES_KEY = "bhardwajdeco_updates";
const ENQUIRIES_KEY = "bhardwajdeco_enquiries";
const SEEDED_KEY = "bhardwajdeco_seeded";

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

// ─── Initialization ───
export function ensureSeeded(): void {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(SEEDED_KEY)) return;

  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(DEMO_PRODUCTS));
  localStorage.setItem(UPDATES_KEY, JSON.stringify(DEMO_UPDATES));
  localStorage.setItem(ENQUIRIES_KEY, JSON.stringify([]));
  localStorage.setItem(SEEDED_KEY, "true");
}

// ─── Products ───
export function getProducts(): Product[] {
  ensureSeeded();
  try {
    return JSON.parse(localStorage.getItem(PRODUCTS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function getProductBySlug(slug: string): Product | null {
  const products = getProducts();
  return products.find((p) => p.slug === slug) || null;
}

export function getProductById(id: string): Product | null {
  const products = getProducts();
  return products.find((p) => p._id === id) || null;
}

export function getFeaturedProducts(): Product[] {
  return getProducts().filter((p) => p.isFeatured);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === "all") return getProducts();
  return getProducts().filter((p) => p.category === category);
}

export function createProduct(data: Omit<Product, "_id" | "createdAt">): Product {
  const products = getProducts();
  const newProduct: Product = {
    ...data,
    _id: generateId(),
    createdAt: new Date().toISOString()
  };
  products.unshift(newProduct);
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  return newProduct;
}

export function updateProduct(id: string, data: Partial<Product>): Product | null {
  const products = getProducts();
  const index = products.findIndex((p) => p._id === id);
  if (index === -1) return null;

  products[index] = { ...products[index], ...data };
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  return products[index];
}

export function deleteProduct(id: string): boolean {
  const products = getProducts();
  const filtered = products.filter((p) => p._id !== id);
  if (filtered.length === products.length) return false;
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(filtered));
  return true;
}

// ─── Updates ───
export function getUpdates(): UpdatePost[] {
  ensureSeeded();
  try {
    return JSON.parse(localStorage.getItem(UPDATES_KEY) || "[]");
  } catch {
    return [];
  }
}

export function getUpdateBySlug(slug: string): UpdatePost | null {
  const updates = getUpdates();
  return updates.find((u) => u.slug === slug) || null;
}

export function createUpdate(data: Omit<UpdatePost, "_id" | "publishedAt">): UpdatePost {
  const updates = getUpdates();
  const newUpdate: UpdatePost = {
    ...data,
    _id: generateId(),
    publishedAt: new Date().toISOString()
  };
  updates.unshift(newUpdate);
  localStorage.setItem(UPDATES_KEY, JSON.stringify(updates));
  return newUpdate;
}

export function updateUpdate(id: string, data: Partial<UpdatePost>): UpdatePost | null {
  const updates = getUpdates();
  const index = updates.findIndex((u) => u._id === id);
  if (index === -1) return null;

  updates[index] = { ...updates[index], ...data };
  localStorage.setItem(UPDATES_KEY, JSON.stringify(updates));
  return updates[index];
}

export function deleteUpdate(id: string): boolean {
  const updates = getUpdates();
  const filtered = updates.filter((u) => u._id !== id);
  if (filtered.length === updates.length) return false;
  localStorage.setItem(UPDATES_KEY, JSON.stringify(filtered));
  return true;
}

// ─── Enquiries ───
export function getEnquiries(): Enquiry[] {
  ensureSeeded();
  try {
    return JSON.parse(localStorage.getItem(ENQUIRIES_KEY) || "[]");
  } catch {
    return [];
  }
}

export function submitEnquiry(payload: EnquiryPayload): Enquiry {
  const enquiries = getEnquiries();
  const newEnquiry: Enquiry = {
    ...payload,
    _id: generateId(),
    isRead: false,
    createdAt: new Date().toISOString()
  };
  enquiries.unshift(newEnquiry);
  localStorage.setItem(ENQUIRIES_KEY, JSON.stringify(enquiries));
  return newEnquiry;
}

export function markEnquiryRead(id: string): void {
  const enquiries = getEnquiries();
  const index = enquiries.findIndex((e) => e._id === id);
  if (index === -1) return;
  enquiries[index].isRead = true;
  localStorage.setItem(ENQUIRIES_KEY, JSON.stringify(enquiries));
}

export function deleteEnquiry(id: string): boolean {
  const enquiries = getEnquiries();
  const filtered = enquiries.filter((e) => e._id !== id);
  if (filtered.length === enquiries.length) return false;
  localStorage.setItem(ENQUIRIES_KEY, JSON.stringify(filtered));
  return true;
}

// ─── Image Helpers ───
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─── Stats ───
export function getStats() {
  return {
    totalProducts: getProducts().length,
    totalUpdates: getUpdates().length,
    totalEnquiries: getEnquiries().length,
    unreadEnquiries: getEnquiries().filter((e) => !e.isRead).length,
    featuredProducts: getFeaturedProducts().length
  };
}
