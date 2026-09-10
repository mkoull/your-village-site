import { handleLead } from "@/lib/lead-handler";
export const runtime = "nodejs";
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
  );
}
