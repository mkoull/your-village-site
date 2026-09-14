import { handleLead, isLeadEmailConfigured } from "@/lib/lead-handler";
export const runtime = "nodejs";
function emailConfig() {
  if (!process.env.RESEND_API_KEY) return undefined;
  return {
    apiKey: process.env.RESEND_API_KEY,
    to: process.env.LEAD_TO_EMAIL || "",
    from: process.env.LEAD_FROM_EMAIL || "",
  };
}
export async function GET() {
  const endpoint =
    process.env.LEAD_WEBHOOK_URL || process.env.NEXT_PUBLIC_LEAD_WEBHOOK_URL;
  let acceptingEnquiries = false;
  try {
    const url = new URL(endpoint || "");
    acceptingEnquiries =
      url.protocol === "https:" && !url.username && !url.password;
  } catch {
    /* Missing configuration is a supported pre-launch state. */
  }
  const email = emailConfig();
  if (email) acceptingEnquiries = isLeadEmailConfigured(email);
  return Response.json(
    { acceptingEnquiries },
    { headers: { "Cache-Control": "no-store" } },
  );
}
export async function POST(request: Request) {
  // Temporary compatibility with existing deployments; migrate to the private variable.
  return handleLead(
    request,
    process.env.LEAD_WEBHOOK_URL || process.env.NEXT_PUBLIC_LEAD_WEBHOOK_URL,
    emailConfig(),
  );
}
