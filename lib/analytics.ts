"use client";

import { track } from "@vercel/analytics";

/**
 * Thin wrapper over Vercel Analytics custom events so call sites stay
 * one-liners and the whole thing no-ops safely outside production.
 */
export type AnalyticsEvent =
  | "quiz_started"
  | "quiz_step_completed"
  | "quiz_abandoned"
  | "lead_submitted"
  | "pricing_viewed"
  | "faq_opened";

export function trackEvent(
  name: AnalyticsEvent,
  props?: Record<string, string | number | boolean>
) {
  try {
    track(name, props);
  } catch {
    // Analytics must never break the page.
  }
}
