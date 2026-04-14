export const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:5000/api";

export const siteContact = {
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "+91 7739929092",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "bishu.prem@gmail.com",
  address: process.env.NEXT_PUBLIC_CONTACT_ADDRESS || "Bhardwaj Deco, New Delhi",
  studioLabel: process.env.NEXT_PUBLIC_CONTACT_LABEL || "Premium Material Studio"
};

export interface EnquiryRequest {
  productId?: string;
  productName?: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
}

export async function submitEnquiryRequest(payload: EnquiryRequest) {
  const response = await fetch(`${apiBaseUrl}/enquiries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage =
      data?.message ||
      data?.errors?.[0]?.message ||
      "Could not submit your enquiry right now.";
    throw new Error(errorMessage);
  }

  return data as {
    success: boolean;
    message?: string;
    data?: { id: string; productName: string; createdAt: string };
  };
}