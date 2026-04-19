export function resolveApiBaseUrl(): string {
  // 1. Explicit env var always wins
  const configuredUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");
  if (configuredUrl) {
    return configuredUrl;
  }

  // 2. Browser: detect environment from hostname
  if (typeof window !== "undefined") {
    const { hostname } = window.location;

    // Local development → local backend
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:5000/api";
    }

    // Production / Vercel → use Render backend directly
    if (hostname.endsWith(".vercel.app") || hostname === "bhardwajdeco.vercel.app") {
      return "https://bhardwajdeco.onrender.com/api";
    }

    // Custom domain or any other → Next.js rewrite proxy
    return "/api";
  }

  // 3. Server-side (SSR) fallback → deployed backend
  return "https://bhardwajdeco.onrender.com/api";
}