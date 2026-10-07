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
  const [checking, setChecking] = useState(true);
  const [checkAttempt, setCheckAttempt] = useState(0);
  const confirmationRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const abort = new AbortController();
    let active = true;
    const timeout = setTimeout(() => abort.abort(), 8000);
    setChecking(true);
    setAvailable(null);
    fetch("/api/leads", {
      signal: abort.signal,
      cache: "no-store",
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((result) => {
        if (
          active &&
          typeof result?.acceptingEnquiries === "boolean"
        )
          setAvailable(result.acceptingEnquiries);
      })
      .catch(() => {
        /* Keep the form closed until its availability can be checked. */
      })
      .finally(() => {
        clearTimeout(timeout);
        if (active) setChecking(false);
      });
    return () => {
      active = false;
      clearTimeout(timeout);
      abort.abort();
    };
  }, [checkAttempt]);
  useEffect(() => {
    if (!submitted) return;
    confirmationRef.current?.scrollIntoView({
      block: "nearest",
      behavior: "instant",
    });
    confirmationRef.current?.focus({ preventScroll: true });
  }, [submitted]);

  async function send(type: LeadType, data: Record<string, unknown>) {
    if (pending.current || available !== true) return;
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
  return {
    send,
    sending,
    submitted,
    error,
    available,
    checking,
    confirmationRef,
    retryAvailability: () => setCheckAttempt((previous) => previous + 1),
  };
}
