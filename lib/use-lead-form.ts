"use client";
import { useEffect, useRef, useState } from "react";
import { submitLead, type LeadType } from "./leads";
import { trackEvent } from "./analytics";

export function useLeadForm() {
  const pending = useRef(false);
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [available, setAvailable] = useState<boolean | null>(null);
  useEffect(() => {
    const abort = new AbortController();
    fetch("/api/leads", { signal: abort.signal, cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((result) => {
        if (typeof result?.acceptingEnquiries === "boolean")
          setAvailable(result.acceptingEnquiries);
      })
      .catch(() => {
        /* A later explicit submission can retry a failed connection. */
      });
    return () => abort.abort();
  }, []);

  async function send(type: LeadType, data: Record<string, unknown>) {
    if (pending.current || available === false) return;
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
  return { send, sending, submitted, error, available };
}
