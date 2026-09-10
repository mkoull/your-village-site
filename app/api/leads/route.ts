import { handleLead } from "@/lib/lead-handler";
export const runtime = "nodejs";
export async function POST(request: Request) {
  // Temporary compatibility with existing deployments; migrate to the private variable.
  return handleLead(
    request,
    process.env.LEAD_WEBHOOK_URL || process.env.NEXT_PUBLIC_LEAD_WEBHOOK_URL,
  );
}
