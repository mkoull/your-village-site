"use client";
import { useState } from "react";
import { useLeadForm } from "@/lib/use-lead-form";
import { useVillage } from "./VillageProvider";
import { services } from "@/content/services";
import Button from "@/components/ui/Button";
import EnquiryAvailability from "@/components/ui/EnquiryAvailability";
import FormError from "@/components/ui/FormError";
import Link from "next/link";

export default function VillageEnquiry() {
  const { draft } = useVillage();
  const { send, sending, submitted, error, available } = useLeadForm();
  const [form, setForm] = useState({ name: "", email: "", notes: "" });
  if (submitted)
    return (
      <div role="status" className="village-enquiry">
        <h3 className="font-heading text-2xl mb-3">
          Your enquiry has reached us.
        </h3>
        <p className="text-sm text-text-muted">
          Thanks, {form.name.trim()}. Your village is still here to explore.
          This is an enquiry, not a booking.
        </p>
      </div>
    );
  return (
    <details className="village-enquiry">
      <summary className="cursor-pointer">
        <span className="font-heading text-2xl">
          Want to hear from Village?
        </span>
        <span className="block text-sm text-text-muted mt-2">
          Optional. Share your interests as the network develops.
        </span>
      </summary>
      <EnquiryAvailability available={available} />
      <form
        className="space-y-5 mt-7"
        aria-busy={sending}
        onSubmit={(event) => {
          event.preventDefault();
          void send("assessment", {
            ...form,
            stage: draft.stage,
            timing: draft.timing,
            needs: draft.needs,
            plan: draft.needs.map(
              (slug) => services.find((s) => s.slug === slug)!.title,
            ),
          });
        }}
      >
        <fieldset
          disabled={sending || available === false}
          className="space-y-5"
        >
          <div>
            <label htmlFor="village-name" className="form-label">
              Your name
            </label>
            <input
              disabled={sending || available === false}
              id="village-name"
              pattern=".*\S.*"
              title="Please enter your name."
              autoComplete="given-name"
              required
              maxLength={120}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="form-field"
            />
          </div>
          <div>
            <label htmlFor="village-email" className="form-label">
              Email address
            </label>
            <input
              disabled={sending || available === false}
              id="village-email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="form-field"
            />
          </div>
          <div>
            <label htmlFor="village-notes" className="form-label">
              Anything practical we should know?{" "}
              <span className="font-normal">(optional)</span>
            </label>
            <textarea
              disabled={sending || available === false}
              id="village-notes"
              rows={3}
              maxLength={4000}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="form-field"
            />
            <p className="text-xs text-text-muted mt-2">
              Please leave out sensitive medical information.
            </p>
          </div>
          <Button type="submit" disabled={sending || available === false}>
            {sending ? "Sending…" : "Send my enquiry"}{" "}
            <span aria-hidden="true">→</span>
          </Button>
        </fieldset>

        <FormError message={error} />
        <p className="text-xs text-text-muted">
          Only this submission sends your selections and contact details to
          Village.{" "}
          <Link href="/privacy" className="underline">
            Privacy
          </Link>
        </p>
      </form>
    </details>
  );
}
