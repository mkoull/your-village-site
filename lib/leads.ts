/**
 * Shared lead submission for every capture point on the site
 * (assessment, contact form, waitlist).
 *
 * Set NEXT_PUBLIC_LEAD_WEBHOOK_URL in your deployment environment
 * (Vercel → Project → Settings → Environment Variables) to a
 * Zapier / Make / Formspree catch-hook URL. The payload is JSON.
 *
 * Note: NEXT_PUBLIC_ variables are inlined at build time — after
 * changing the value, redeploy for it to take effect.
 */

export type LeadType = "assessment" | "contact" | "waitlist";

export interface LeadResult {
  delivered: boolean;
}

export async function submitLead(
  type: LeadType,
  data: Record<string, unknown>
): Promise<LeadResult> {
  const url = process.env.NEXT_PUBLIC_LEAD_WEBHOOK_URL;

  const payload = {
    type,
    submittedAt: new Date().toISOString(),
    page: typeof window !== "undefined" ? window.location.pathname : undefined,
    ...data,
  };

  if (!url) {
    // Graceful degradation: don't block the user, but make the gap
    // loud in the console so it's caught in testing.
    console.warn(
      "[leads] NEXT_PUBLIC_LEAD_WEBHOOK_URL is not set — lead was NOT delivered:",
      payload
    );
    return { delivered: false };
  }

  try {
    // text/plain + no-cors avoids a CORS preflight, which most
    // catch-hook services (Zapier, Make) don't answer. They parse
    // the JSON body regardless of content type.
    await fetch(url, {
      method: "POST",
      mode: "no-cors",
      keepalive: true,
      headers: { "Content-Type": "text/plain;charset=UTF-8" },
      body: JSON.stringify(payload),
    });
    return { delivered: true };
  } catch (err) {
    console.error("[leads] delivery failed:", err);
    return { delivered: false };
  }
}
