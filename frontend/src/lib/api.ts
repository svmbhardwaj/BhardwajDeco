import { Enquiry, EnquiryPayload, Product, ProductCategory, ProductSpecification, UpdatePost } from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:5000/api";

const AUTH_TOKEN_KEY = "bhardwajdeco_admin_token";

type ApiListResponse<T> = {
  success: boolean;
  data: T[];
  pagination?: { total: number; page: number; limit: number; pages: number };
  filters?: unknown;
};

type ApiItemResponse<T> = {
  success: boolean;
  data: T;
  related?: T[];
};

type ApiActionResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
};

type BackendProduct = {
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
  specifications?: Partial<ProductSpecification>;
  heroImage: string;
  gallery?: string[];
  isFeatured: boolean;
  price?: string;
  createdAt: string;
};

type BackendUpdate = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  type?: UpdatePost["type"];
  coverImage: string;
  publishedAt: string;
};

type BackendEnquiry = {
  _id: string;
  productId?: string;
  productName?: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  isRead: boolean;
  createdAt: string;
};

type DashboardStatsResponse = {
  success: boolean;
  data: {
    overview: {
      totalProducts: number;
      totalEnquiries: number;
      totalUpdates: number;
      unreadEnquiries: number;
      featuredProducts: number;
    };
    enquiries: {
      statusBreakdown: Record<string, number>;
      recentEnquiries: BackendEnquiry[];
      dailyTrend: Array<{ _id: string; count: number }>;
    };
    products: {
      categoryBreakdown: Record<string, number>;
    };
  };
};

type AdminProfileResponse = {
  success: boolean;
  admin: {
    id: string;
    email: string;
    lastLogin: string | null;
  };
};

function getAuthToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(AUTH_TOKEN_KEY) || "";
}

export function setAuthToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuthToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function hasAuthToken(): boolean {
  return Boolean(getAuthToken());
}

async function apiRequest<T>(path: string, options: RequestInit = {}, requiresAuth = false): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  if (requiresAuth) {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Admin sign-in required.");
    }
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers
    });
  } catch {
    throw new Error("Unable to connect to server. Please start backend API on port 5000.");
  }

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload?.message || "Request failed.");
  }

  return payload as T;
}

function normalizeProduct(product: BackendProduct): Product {
  const specifications = product.specifications || {};
  return {
    _id: String(product._id),
    name: product.name || "",
    slug: product.slug || "",
    category: product.category as ProductCategory,
    textureType: product.textureType || "",
    color: product.color || "",
    finish: product.finish || "",
    description: product.description || "",
    shortDescription: product.shortDescription || "",
    features: product.features || [],
    specifications: {
      dimensions: specifications.dimensions || "",
      thickness: specifications.thickness || "",
      material: specifications.material || "",
      weight: specifications.weight || "",
      application: specifications.application || "",
      warranty: specifications.warranty || ""
    } as ProductSpecification,
    heroImage: product.heroImage || "",
    gallery: product.gallery || [],
    isFeatured: Boolean(product.isFeatured),
    price: product.price || "",
    createdAt: product.createdAt || new Date().toISOString()
  };
}

function normalizeUpdate(update: BackendUpdate): UpdatePost {
  return {
    _id: String(update._id),
    title: update.title || "",
    slug: update.slug || "",
    excerpt: update.excerpt || "",
    content: update.content || "",
    type: update.type || "general",
    coverImage: update.coverImage || "",
    publishedAt: update.publishedAt || new Date().toISOString()
  };
}

function normalizeEnquiry(enquiry: BackendEnquiry): Enquiry {
  return {
    _id: String(enquiry._id),
    productId: enquiry.productId ? String(enquiry.productId) : "",
    productName: enquiry.productName || "General Enquiry",
    name: enquiry.name || "",
    email: enquiry.email || "",
    phone: enquiry.phone || "",
    message: enquiry.message || "",
    isRead: Boolean(enquiry.isRead),
    createdAt: enquiry.createdAt || new Date().toISOString()
  };
}

export async function loginAdmin(email: string, password: string) {
  const response = await apiRequest<{ success: boolean; token: string; admin: { email: string; lastLogin: string } }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });

  if (!response.token) {
    throw new Error("Login failed.");
  }

  setAuthToken(response.token);
  return response;
}

export async function fetchProducts() {
  const response = await apiRequest<ApiListResponse<BackendProduct>>("/products");
  return response.data.map(normalizeProduct);
}

export async function fetchProductBySlug(slug: string) {
  const response = await apiRequest<ApiItemResponse<BackendProduct>>(`/products/${slug}`);
  return {
    product: normalizeProduct(response.data),
    related: (response.related || []).map(normalizeProduct)
  };
}

export async function fetchUpdates() {
  const response = await apiRequest<ApiListResponse<BackendUpdate>>("/updates");
  return response.data.map(normalizeUpdate);
}

export async function fetchUpdateBySlug(slug: string) {
  const response = await apiRequest<ApiItemResponse<BackendUpdate>>(`/updates/${slug}`);
  return normalizeUpdate(response.data);
}

export async function fetchDashboardStats() {
  return apiRequest<DashboardStatsResponse>("/stats/dashboard", {}, true);
}

export async function fetchAdminProfile() {
  return apiRequest<AdminProfileResponse>("/auth/me", {}, true);
}

export async function fetchAdminEnquiries() {
  const response = await apiRequest<ApiListResponse<BackendEnquiry>>("/enquiries", {}, true);
  return response.data.map(normalizeEnquiry);
}

export async function createProduct(payload: Omit<Product, "_id" | "createdAt">) {
  const response = await apiRequest<ApiItemResponse<BackendProduct>>("/products", {
    method: "POST",
    body: JSON.stringify(payload)
  }, true);
  return normalizeProduct(response.data);
}

export async function updateProduct(id: string, payload: Partial<Product>) {
  const response = await apiRequest<ApiItemResponse<BackendProduct>>(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  }, true);
  return normalizeProduct(response.data);
}

export async function deleteProduct(id: string) {
  await apiRequest<ApiActionResponse<null>>(`/products/${id}`, {
    method: "DELETE"
  }, true);
}

export async function createUpdate(payload: Omit<UpdatePost, "_id" | "publishedAt">) {
  const response = await apiRequest<ApiItemResponse<BackendUpdate>>("/updates", {
    method: "POST",
    body: JSON.stringify(payload)
  }, true);
  return normalizeUpdate(response.data);
}

export async function updateUpdate(id: string, payload: Partial<UpdatePost>) {
  const response = await apiRequest<ApiItemResponse<BackendUpdate>>(`/updates/${id}`,
    {
    method: "PUT",
    body: JSON.stringify(payload)
  }, true);
  return normalizeUpdate(response.data);
}

export async function deleteUpdate(id: string) {
  await apiRequest<ApiActionResponse<null>>(`/updates/${id}`, {
    method: "DELETE"
  }, true);
}

export async function markEnquiryRead(id: string) {
  const response = await apiRequest<ApiItemResponse<BackendEnquiry>>(`/enquiries/${id}/read`, {
    method: "PATCH"
  }, true);
  return normalizeEnquiry(response.data);
}

export async function deleteEnquiry(id: string) {
  await apiRequest<ApiActionResponse<null>>(`/enquiries/${id}`, {
    method: "DELETE"
  }, true);
}

export async function submitEnquiryRequest(payload: EnquiryPayload) {
  return apiRequest<ApiActionResponse<{ id: string; productName: string; createdAt: string }>>("/enquiries", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}