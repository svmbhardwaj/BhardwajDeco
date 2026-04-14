export function resolveApiBaseUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");
  if (configuredUrl) {
    return configuredUrl;
  }

  if (typeof window !== "undefined") {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      return "http://localhost:5000/api";
    }

    return `${window.location.origin}/_/backend/api`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/_/backend/api`;
  }

  return "http://localhost:5000/api";
}