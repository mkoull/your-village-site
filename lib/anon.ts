"use client";

/**
 * Anonymous visitor id for stitching partial quiz answers together.
 * Stored in localStorage; every quiz-step beacon carries it so families
 * who drop out before the final screen are still visible in the lead
 * inbox, keyed to one id.
 */
const KEY = "yv_anon_id";

export function getAnonId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let id = window.localStorage.getItem(KEY);
    if (!id) {
      id = crypto.randomUUID();
      window.localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return "no-storage";
  }
}
