export type AppRole = "family" | "provider" | "owner";
export type AppUser = { id: string; name: string; email: string; role: AppRole };
export type Listing = {
  id: string; name: string; category: string; summary: string; description: string;
  suburbs: string[]; mode: "At home" | "Delivered" | "Online"; price: string;
  availability: string; included: string[]; status: "pending" | "published" | "paused";
  demo: boolean; updatedAt: string; feeBps: number; feeCap: number;
};
export type RequestStatus = "requested" | "offered" | "confirmed" | "delivered" | "completed" | "declined" | "cancelled" | "disputed";
export type SupportRequest = {
  id: string; providerId: string; providerName: string; category: string;
  familyName: string; suburb: string; timing: string; message: string;
  status: RequestStatus; createdAt: string; updatedAt: string;
  quoteCents: number | null; arrangement: string | null; feeCents: number | null;
  events: { id: string; author: string; message: string; createdAt: string }[];
};
export const requestLabels: Record<RequestStatus, string> = {
  requested: "Awaiting a reply", offered: "Offer received", confirmed: "Arranged",
  delivered: "Ready to confirm", completed: "Support received", declined: "Unavailable",
  cancelled: "Cancelled", disputed: "Needs a review",
};
export function money(cents: number) {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: cents % 100 ? 2 : 0 }).format(cents / 100);
}
