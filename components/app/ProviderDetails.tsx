"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { services } from "@/content/services";
import { isOpenRequest, supportReturnPath } from "@/lib/app-experience";
import { appApi, useApp, useAppData } from "./AppContext";
import {
  AppIcon,
  ErrorBox,
  Loading,
  ProviderArt,
  SaveProviderAction,
} from "./AppUI";
import { useSupportBrowser } from "./SupportContext";
import type { Listing, SupportRequest } from "@/lib/app-types";

export function ProviderProfile({
  id,
  embedded = false,
}: {
  id: string;
  embedded?: boolean;
}) {
  const browser = useSupportBrowser();
  const { user } = useApp();
  const params = useSearchParams();
  const from = supportReturnPath(
    embedded ? browser.selection?.from || null : params.get("from"),
  );
  const providerData = useAppData<{ provider: Listing }>(
    `providers/${encodeURIComponent(id)}`,
  );
  const requests = useAppData<{ requests: SupportRequest[] }>(
    "requests",
    user?.role === "family",
  );
  const active = requests.data?.requests.find(
    (r) => r.providerId === id && isOpenRequest(r),
  );
  const requesting = embedded && browser.selection?.requesting;
  const requestPanel = useRef<HTMLElement>(null);
  useEffect(() => {
    if (requesting)
      requestPanel.current
        ?.querySelector<HTMLElement>("h2")
        ?.focus({ preventScroll: true });
  }, [requesting]);
  if (providerData.loading)
    return (
      <div>
        <h2 id={embedded ? "va-support-title" : undefined} className="sr-only">
          Gathering this support
        </h2>
        <Loading />
      </div>
    );
  const provider = providerData.data?.provider;
  if (!provider)
    return (
      <div className="va-panel">
        <h2 id={embedded ? "va-support-title" : undefined}>
          Let’s find another way.
        </h2>
        <ErrorBox
          message={providerData.error || "This support is no longer available."}
          retry={providerData.reload}
        />
        {embedded ? (
          <button className="va-text-button" onClick={browser.close}>
            Back to browsing
          </button>
        ) : (
          <Link className="va-text-link" href={from}>
            Back to browsing
          </Link>
        )}
      </div>
    );
  const Title = embedded ? "h2" : "h1";
  const backLabel =
    from === "/app"
      ? "← Back home"
      : from.startsWith("/app/saved")
        ? "← Back to my village"
        : from.startsWith("/app/requests")
          ? "← Back to your conversation"
          : from.startsWith("/app/partner") || from.startsWith("/app/owner")
            ? "← Back to your workspace"
            : "← Back to your search";
  const showRequest = () => {
    if (active) browser.leave(`/app/requests/${active.id}`);
    else browser.request();
  };
  return (
    <div className={embedded ? "va-provider-preview" : undefined}>
      {!embedded && (
        <Link className="va-back" href={from}>
          {backLabel}
        </Link>
      )}
      <div hidden={!!requesting}>
        <div className="va-profile-hero">
          <div>
            <p className="va-eyebrow">
              {services.find((s) => s.slug === provider.category)?.shortTitle} ·{" "}
              {provider.mode}
            </p>
            <Title
              id={embedded && !requesting ? "va-support-title" : undefined}
            >
              {provider.name}
            </Title>
            <p>{provider.summary}</p>
            <div className="va-profile-badges">
              <span>
                <AppIcon name="pin" size={16} />
                {provider.suburbs.join(" · ")}
              </span>
              {provider.demo && <span>Fictional example provider</span>}
            </div>
            {!embedded && (
              <div className="va-actions">
                <SaveProviderAction provider={provider} from={from} />
                <a className="va-text-link" href="#request-availability">
                  {active ? "Continue your request" : "Ask about availability"}
                  <AppIcon name="arrow" size={18} />
                </a>
              </div>
            )}
          </div>
          <ProviderArt category={provider.category} large />
        </div>
        {embedded && (
          <div className="va-preview-availability">
            <div>
              <strong>{provider.price}</strong>
              <p>{provider.availability}</p>
            </div>
            <span className="va-updated">
              Profile updated{" "}
              {new Date(provider.updatedAt).toLocaleDateString("en-AU")}
            </span>
          </div>
        )}
        {providerData.error && (
          <ErrorBox message={providerData.error} retry={providerData.reload} />
        )}
        {params.get("save") === "failed" && (
          <p className="va-error" role="status">
            You’re signed in, but this provider couldn’t be saved. Use the heart
            to try again.
          </p>
        )}
      </div>
      <div className="va-profile-layout">
        <div hidden={!!requesting}>
          <section className="va-panel">
            <h3>A little about this support.</h3>
            <p>{provider.description}</p>
            <h3>What’s included</h3>
            <ul className="va-included">
              {provider.included.map((item) => (
                <li key={item}>
                  <AppIcon name="check" size={18} />
                  {item}
                </li>
              ))}
            </ul>
          </section>
          <section className="va-panel va-profile-reassurance">
            <h3>Start with a conversation.</h3>
            <p>
              A request is free and doesn’t confirm a booking. You can discuss
              the details and price before deciding. Payments are arranged
              directly with the provider.
            </p>
            <details>
              <summary>Good to know before you choose</summary>
              <p>
                Check cancellation terms and qualifications relevant to this
                service before accepting an arrangement.
              </p>
              {provider.demo && (
                <p className="va-demo-copy">
                  This profile, pricing and availability are fictional. Preview
                  requests stay in this preview; no real provider is contacted.
                </p>
              )}
            </details>
          </section>
        </div>
        <aside
          ref={requestPanel}
          id="request-availability"
          className="va-request-panel"
          hidden={embedded && !requesting}
        >
          <p className="va-eyebrow">
            {embedded
              ? "A CONVERSATION FIRST"
              : "A NEXT STEP, WHEN YOU’RE READY"}
          </p>
          <h2 id={requesting ? "va-support-title" : undefined} tabIndex={-1}>
            {embedded ? `Say hello to ${provider.name}.` : provider.price}
          </h2>
          <p>{provider.availability}</p>
          {embedded && (
            <p className="va-request-draft-note">
              Take your time. Your unfinished message stays here while you
              browse.
            </p>
          )}
          {provider.status !== "published" ? (
            <div className="va-existing-request">
              <p>This listing is not currently taking new requests.</p>
              {active && (
                <Link className="va-button" href={`/app/requests/${active.id}`}>
                  Continue your request
                  <AppIcon name="arrow" size={18} />
                </Link>
              )}
            </div>
          ) : !user ? (
            <Link
              className="va-button"
              href={
                "/app/sign-in?next=" +
                encodeURIComponent(
                  "/app/providers/" +
                    provider.id +
                    "?from=" +
                    encodeURIComponent(from),
                )
              }
            >
              Sign in to request support
              <AppIcon name="arrow" size={18} />
            </Link>
          ) : user.role !== "family" ? (
            <p className="va-muted">
              Families can send a request here. You’re viewing this as a{" "}
              {user.role}.
            </p>
          ) : requests.loading ? (
            <Loading />
          ) : active ? (
            <div className="va-existing-request">
              <h3>You’ve already started a conversation.</h3>
              <p>
                Keep your questions and arrangements together in your existing
                request.
              </p>
              <Link className="va-button" href={`/app/requests/${active.id}`}>
                Continue your request
                <AppIcon name="arrow" size={18} />
              </Link>
            </div>
          ) : requests.error ? (
            <ErrorBox message={requests.error} retry={requests.reload} />
          ) : (
            <AvailabilityForm
              key={provider.id}
              provider={provider}
              area={
                new URL(from, "https://village.invalid").searchParams.get(
                  "area",
                ) || ""
              }
            />
          )}
        </aside>
      </div>
      {embedded && !requesting && (
        <div className="va-preview-actions">
          <SaveProviderAction provider={provider} from={from} />
          {(!user || user.role === "family") && (
            <div>
              {requests.error ? (
                <ErrorBox message={requests.error} retry={requests.reload} />
              ) : active || provider.status === "published" ? (
                <button
                  className="va-button"
                  disabled={!!user && requests.loading}
                  onClick={showRequest}
                >
                  {requests.loading && user
                    ? "Checking requests…"
                    : active
                      ? "Continue your request"
                      : browser.drafts[id]
                        ? "Continue my draft"
                        : "Ask about availability"}
                  <AppIcon name="arrow" size={18} />
                </button>
              ) : (
                <p className="va-paused-note">
                  Not taking new requests at the moment.
                </p>
              )}
              <p className="va-field-note">
                {active
                  ? "Open your conversation when you’re ready."
                  : "Just a conversation. No booking or payment yet."}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
function AvailabilityForm({
  provider,
  area,
}: {
  provider: Listing;
  area: string;
}) {
  const browser = useSupportBrowser();
  const { refresh } = useApp();
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const [review, setReview] = useState<{
    suburb: string;
    timing: string;
    message: string;
  } | null>(null);
  const key = useRef(crypto.randomUUID());
  const form = useRef<HTMLFormElement>(null);
  const reviewHeading = useRef<HTMLHeadingElement>(null),
    messageInput = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (review) reviewHeading.current?.focus();
  }, [review]);
  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!review || busy) return;
    const consent = new FormData(event.currentTarget).get("consent") === "on";
    setBusy(true);
    setError("");
    try {
      const result = await appApi<{ request: SupportRequest }>("requests", {
        ...review,
        providerId: provider.id,
        consent,
        key: key.current,
      });
      refresh();
      browser.setDraft(provider.id, null);
      browser.leave("/app/requests/" + result.request.id + "?sent=1");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="va-availability">
      <form
        ref={form}
        className="va-form"
        hidden={!!review}
        onChange={(event) => {
          const data = new FormData(event.currentTarget);
          browser.setDraft(provider.id, {
            suburb: String(data.get("suburb") || ""),
            timing: String(data.get("timing") || ""),
            message: String(data.get("message") || ""),
          });
        }}
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          setReview({
            suburb: String(data.get("suburb")).trim(),
            timing: String(data.get("timing")),
            message: String(data.get("message")).trim(),
          });
          setError("");
        }}
      >
        <h3>A little about what you need</h3>
        <p className="va-field-note">
          A conversation first. No booking or payment yet.
        </p>
        <label>
          Your suburb
          {provider.mode === "Online" ? (
            <input
              name="suburb"
              required
              minLength={2}
              maxLength={80}
              autoComplete="address-level2"
              defaultValue={browser.drafts[provider.id]?.suburb ?? area}
            />
          ) : (
            <select
              name="suburb"
              required
              defaultValue={
                browser.drafts[provider.id]?.suburb ??
                (provider.suburbs.includes(area) ? area : "")
              }
            >
              <option value="" disabled>
                Choose your suburb
              </option>
              {provider.suburbs.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          )}
        </label>
        <label>
          When would you like support?
          <select
            name="timing"
            required
            defaultValue={browser.drafts[provider.id]?.timing || ""}
          >
            <option value="" disabled>
              Choose a timeframe
            </option>
            <option>This week</option>
            <option>In the next few weeks</option>
            <option>Planning ahead</option>
          </select>
        </label>
        <label>
          What would help?
          <textarea
            ref={messageInput}
            name="message"
            rows={4}
            required
            minLength={10}
            maxLength={1500}
            defaultValue={browser.drafts[provider.id]?.message || ""}
            placeholder="Tell them what would help, who it’s for and any practical preferences."
          />
        </label>
        <p className="va-field-note">
          Share practical needs and preferences. Leave out medical histories and
          other sensitive details.
        </p>
        <button className="va-button">
          Review my request
          <AppIcon name="arrow" size={18} />
        </button>
      </form>
      {review && (
        <form className="va-form va-request-review" onSubmit={send}>
          <h3 ref={reviewHeading} tabIndex={-1}>
            Ready to say hello?
          </h3>
          <p>
            Your request will go to <strong>{provider.name}</strong>.
          </p>
          <dl>
            <div>
              <dt>Where</dt>
              <dd>{review.suburb}</dd>
            </div>
            <div>
              <dt>When</dt>
              <dd>{review.timing}</dd>
            </div>
          </dl>
          <blockquote>{review.message}</blockquote>
          <label className="va-checkbox">
            <input name="consent" type="checkbox" required />
            <span>
              Share my name and these details with {provider.name}. Village can
              access this request to help resolve issues.
            </span>
          </label>
          {error && <ErrorBox message={error} />}
          <button className="va-button" disabled={busy}>
            {busy ? "Sending your request…" : "Send request"}
            <AppIcon name="arrow" size={18} />
          </button>
          <button
            className="va-text-button"
            type="button"
            disabled={busy}
            onClick={() => {
              setReview(null);
              requestAnimationFrame(() => messageInput.current?.focus());
            }}
          >
            Edit my request
          </button>
          <p className="va-field-note">
            Look for replies in Requests. You choose whether to accept an offer.
            No payment is taken here.
          </p>
        </form>
      )}
    </div>
  );
}
