/** Shared browser transport. Delivery is confirmed by our same-origin endpoint. */
export type LeadType = "assessment" | "contact" | "waitlist";
export type LeadResult =
  { delivered: true } | { delivered: false; error: string };

export async function submitLead(
  type: LeadType,
  data: Record<string, unknown>,
): Promise<LeadResult> {
  try {
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        type,
        page: typeof window !== "undefined" ? window.location.pathname : "/",
      }),
      signal: AbortSignal.timeout(12000),
    });
    if (!response.ok) {
      return {
        delivered: false,
        error:
          response.status === 503
            ? "Our enquiry form is temporarily unavailable. Your details have not been sent. Please try again later."
            : "We couldn't confirm your enquiry. Your details are still here; please try again.",
      };
    }
    const result = await response.json();
    return result.delivered === true
      ? { delivered: true }
      : {
          delivered: false,
          error: "We couldn't confirm your enquiry. Please try again.",
        };
  } catch {
    return {
      delivered: false,
      error:
        "We couldn't confirm your enquiry. Check your connection and try again. Your details are still here.",
    };
  }
}
