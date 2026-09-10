"use client";
import { useRef, useState } from "react";
import { submitLead, type LeadType } from "./leads";
import { trackEvent } from "./analytics";

export function useLeadForm() {
  const pending = useRef(false);
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function send(type: LeadType, data: Record<string, unknown>) {
    if (pending.current) return;
    pending.current = true;
    setSending(true);
    setError("");
    try {
      const result = await submitLead(type, data);
      if (result.delivered) {
        setSubmitted(true);
        trackEvent("lead_submitted", { type });
      } else {
        setError(result.error);
      }
    } finally {
      pending.current = false;
      setSending(false);
    }
  }
  return { send, sending, submitted, error };
}
