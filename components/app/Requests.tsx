"use client";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import ArrowUpRight from "@/components/ui/ArrowUpRight";
import { isOpenRequest, needsAction, nextStep } from "@/lib/app-experience";
import { appApi, useApp, useAppData } from "./AppContext";
import {
  AppIcon,
  Empty,
  ErrorBox,
  Heading,
  Loading,
  RequestRow,
  SignInPrompt,
} from "./AppUI";
import { money, requestLabels, type SupportRequest } from "@/lib/app-types";
import { useSupportBrowser } from "./SupportContext";
export function Requests() {
  const { user } = useApp();
  const result = useAppData<{ requests: SupportRequest[] }>("requests", !!user);
  const params = useSearchParams(),
    router = useRouter();
  const filter = params.get("filter") || "all";
  if (!user)
    return (
      <>
        <Heading
          eyebrow="KEEP IN TOUCH"
          title="Your support, in conversation."
        />
        <SignInPrompt />
      </>
    );
  const all = result.data?.requests || [];
  const attention = all.filter((r) => needsAction(r, user.role)).length;
  const requests = all.filter((r) =>
    filter === "attention"
      ? needsAction(r, user.role)
      : filter === "active"
        ? isOpenRequest(r)
        : filter === "closed"
          ? !isOpenRequest(r)
          : filter === "completed"
            ? r.status === "completed"
            : true,
  );
  return (
    <>
      <Heading
        eyebrow={user.role === "family" ? "YOUR CONVERSATIONS" : "YOUR INBOX"}
        title={
          user.role === "family"
            ? "Your next step, together."
            : "Good support starts here."
        }
      >
        Read replies, agree the details and keep track of your support. This
        inbox checks for updates while you’re here.
      </Heading>
      <div className="va-toolbar">
        <div className="va-filter-chips">
          {[
            ["all", "All requests"],
            [
              "attention",
              "Needs you" + (attention ? " (" + attention + ")" : ""),
            ],
            ["active", "In progress"],
            ["closed", "Closed"],
          ].map(([key, label]) => (
            <button
              aria-pressed={filter === key}
              key={key}
              onClick={() =>
                router.replace(
                  "/app/requests" + (key === "all" ? "" : "?filter=" + key),
                  { scroll: false },
                )
              }
            >
              {label}
            </button>
          ))}
        </div>
        <button
          className="va-text-button"
          disabled={result.refreshing}
          onClick={result.reload}
        >
          {result.refreshing ? "Checking…" : "Check for replies"}
        </button>
      </div>
      {result.error && (
        <ErrorBox message={result.error} retry={result.reload} />
      )}
      {result.loading ? (
        <Loading />
      ) : requests.length ? (
        <div className="va-request-list">
          {requests.map((request) => (
            <RequestRow
              key={request.id}
              request={request}
              providerView={user.role !== "family"}
            />
          ))}
        </div>
      ) : (
        !result.error && (
          <Empty
            title={
              filter === "attention"
                ? "You’re all caught up."
                : filter === "all"
                  ? "Your first hello starts here."
                  : "Nothing in this view just yet."
            }
            href={
              filter !== "all"
                ? "/app/requests"
                : user.role === "family"
                  ? "/app/explore"
                  : user.role === "provider"
                    ? "/app/partner"
                    : "/app/owner"
            }
            action={
              filter !== "all"
                ? "See all requests"
                : user.role === "family"
                  ? "Find support"
                  : "Go to your workspace"
            }
          >
            {filter === "attention"
              ? "There’s nothing waiting for your reply or confirmation. We’ll show new updates here."
              : filter === "all"
                ? user.role === "family"
                  ? "Find a provider, send a request and start a conversation. Your replies and arrangements will stay together here."
                  : "Requests from families will appear here when they get in touch."
                : "Your other requests are still available in All requests."}
          </Empty>
        )
      )}
    </>
  );
}
const explanations: Record<SupportRequest["status"], string> = {
  requested:
    "Your request is saved in the provider’s inbox. You can ask a follow-up question below.",
  offered:
    "The provider has suggested an arrangement. Read the details and total price before choosing your next step.",
  confirmed:
    "This arrangement has been accepted. Agree payment and cancellation terms directly with the provider.",
  delivered:
    "The provider has marked this support delivered and paid. The family can confirm that or ask for a review.",
  completed:
    "The family has confirmed the support was received and the provider was paid. A little more support, in place.",
  declined:
    "The provider couldn’t help with this request. There may be another option in your village.",
  cancelled:
    "This request is closed. This does not move or refund any money; contact the provider about payment.",
  disputed:
    "This request needs a review. Any referral fee is excluded while the issue is reviewed in the owner workspace.",
};
export function RequestDetail({ id }: { id: string }) {
  const browser = useSupportBrowser();
  const { user, refresh } = useApp();
  const params = useSearchParams();
  const working = useRef(false);
  const result = useAppData<{ request: SupportRequest }>(
    `requests/${encodeURIComponent(id)}`,
    !!user,
  );
  const [busy, setBusy] = useState(false),
    [notice, setNotice] = useState("");
  useEffect(() => {
    const current = result.data?.request;
    if (!user || !current?.unreadCount) return;
    let cancelled = false;
    const read = () => {
      if (document.visibilityState !== "visible") return;
      const eventId = current.events.at(-1)?.id;
      if (eventId)
        void appApi("requests/" + id + "/read", { eventId })
          .then(() => {
            if (!cancelled) refresh();
          })
          .catch(() => {});
    };
    read();
    document.addEventListener("visibilitychange", read);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", read);
    };
  }, [id, user, result.data, refresh]);
  if (!user) return <SignInPrompt asTitle />;
  if (result.loading && !result.data) return <Loading />;
  if (result.error && !result.data)
    return (
      <>
        <Heading eyebrow="YOUR REQUESTS" title="Let’s find your way back." />
        <ErrorBox message={result.error} retry={result.reload} />
        <Link className="va-button" href="/app/requests">
          Back to requests
        </Link>
      </>
    );
  const request = result.data?.request;
  if (!request) return null;
  async function action(body: Record<string, unknown>) {
    if (working.current) return false;
    working.current = true;
    setBusy(true);
    setNotice("");
    try {
      await appApi("requests/" + id, body);
      if (body.action !== "message") setNotice("Your update is saved.");
      refresh();
      return true;
    } catch (e) {
      result.reload();
      throw e;
    } finally {
      working.current = false;
      setBusy(false);
    }
  }
  const family = user.role === "family",
    provider = user.role === "provider";
  const open = isOpenRequest(request);
  const stages: Partial<Record<SupportRequest["status"], number>> = {
    requested: 0,
    offered: 1,
    confirmed: 2,
    delivered: 3,
    completed: 4,
  };
  const stage = stages[request.status];
  const free = request.quoteCents === 0;
  const explanation =
    free && request.status === "confirmed"
      ? "This free arrangement has been accepted. Keep the practical details together in your conversation."
      : free && request.status === "delivered"
        ? "The provider has marked this support delivered. Confirm you received it, or ask for a review."
        : free && request.status === "completed"
          ? "The family has confirmed the support was received. A little more support, in place."
          : explanations[request.status];
  return (
    <>
      <Link className="va-back" href="/app/requests">
        ← All requests
      </Link>
      <div className="va-detail-heading">
        <Heading
          eyebrow={
            family
              ? "YOUR SUPPORT REQUEST"
              : `REQUEST FROM ${request.familyName}`
          }
          title={request.providerName}
        >
          {request.suburb} · {request.timing}
        </Heading>
        <span className={`va-status va-status-${request.status}`}>
          {provider && request.status === "offered"
            ? "Offer sent"
            : requestLabels[request.status]}
        </span>
      </div>
      {params.get("sent") === "1" && request.status === "requested" && (
        <p className="va-success" role="status">
          <AppIcon name="check" size={18} />
          Your request reached {request.providerName}. Replies will appear here.
        </p>
      )}
      {stage !== undefined && (
        <ol className="va-request-steps" aria-label="Request progress">
          {[
            "Request sent",
            "Offer to review",
            "Support arranged",
            "Support received",
          ].map((label, index) => (
            <li
              key={label}
              data-done={index < stage}
              aria-current={index === stage ? "step" : undefined}
            >
              <span>
                {index < stage ? <AppIcon name="check" size={14} /> : index + 1}
              </span>
              {label}
            </li>
          ))}
        </ol>
      )}
      {result.error && (
        <ErrorBox message={result.error} retry={result.reload} />
      )}
      <div className="va-request-layout">
        <div>
          <section className="va-panel va-status-panel">
            <p className="va-eyebrow">WHERE THINGS STAND</p>
            <h2>{nextStep(request, user.role)}</h2>
            <p>
              {provider && request.status === "requested"
                ? "This family would like your support. Reply with a proposed arrangement or let them know if you cannot help."
                : provider && request.status === "offered"
                  ? "Your offer is with the family. You can update it here while you wait for their decision."
                  : explanation}
            </p>
            {request.quoteCents !== null && (
              <div className="va-offer-summary">
                <strong>
                  {money(request.quoteCents)}
                  <small>
                    {free
                      ? "Free support · no payment required"
                      : "total, paid directly to the provider"}
                  </small>
                </strong>
                <p>{request.arrangement}</p>
              </div>
            )}
            {notice && (
              <p className="va-success" role="status">
                <AppIcon name="check" size={18} />
                {notice}
              </p>
            )}
            {family && request.status === "offered" && (
              <ActionForm
                button="Accept this arrangement"
                busy={busy}
                onSubmit={async (data) => {
                  if (data.get("agree") !== "on") return;
                  return action({
                    action: "accept",
                    quoteCents: request.quoteCents,
                    arrangement: request.arrangement,
                  });
                }}
              >
                <label className="va-checkbox">
                  <input name="agree" type="checkbox" required />
                  <span>
                    I’ve checked the details, total price and provider’s
                    cancellation terms, and want to go ahead.
                  </span>
                </label>
              </ActionForm>
            )}
            {provider && ["requested", "offered"].includes(request.status) && (
              <ActionForm
                button={
                  request.status === "offered"
                    ? "Update this offer"
                    : "Send an offer"
                }
                busy={busy}
                onSubmit={(data) =>
                  action({
                    action: "offer",
                    quoteCents: Math.round(Number(data.get("amount")) * 100),
                    arrangement: data.get("arrangement"),
                    message: data.get("message"),
                  })
                }
              >
                <h3>Suggest an arrangement</h3>
                <label>
                  Total price (AUD)
                  <input
                    name="amount"
                    type="number"
                    min="0"
                    max="10000"
                    step="0.01"
                    required
                    defaultValue={
                      request.quoteCents === null
                        ? ""
                        : request.quoteCents / 100
                    }
                    placeholder="140.00"
                  />
                </label>
                <label>
                  Date, time and what’s included
                  <input
                    name="arrangement"
                    defaultValue={request.arrangement || ""}
                    required
                    minLength={10}
                    maxLength={400}
                    placeholder="Date, time, duration and the support you’ll provide"
                  />
                </label>
                <label>
                  Your reply
                  <textarea
                    name="message"
                    required
                    rows={3}
                    minLength={5}
                    maxLength={1500}
                    placeholder="A little about how you can help, and any cancellation terms."
                  />
                </label>
                <p className="va-field-note">
                  Quote the full amount payable, including taxes, travel and
                  other charges. Use 0 for free support.
                </p>
              </ActionForm>
            )}
            {provider && request.status === "confirmed" && (
              <ActionForm
                button={
                  free ? "Mark support delivered" : "Mark delivered and paid"
                }
                busy={busy}
                onSubmit={(data) =>
                  action({
                    action: "delivered",
                    paid: data.get("paid") === "on",
                  })
                }
              >
                <label className="va-checkbox">
                  <input name="paid" required type="checkbox" />
                  <span>
                    {free
                      ? "The agreed support has been delivered. Ask the family to confirm."
                      : "The agreed support has been delivered and payment received. Ask the family to confirm."}
                  </span>
                </label>
              </ActionForm>
            )}
            {family && request.status === "delivered" && (
              <ActionForm
                button="Confirm support received"
                busy={busy}
                onSubmit={(data) =>
                  action({
                    action: "complete",
                    paid: data.get("paid") === "on",
                  })
                }
              >
                <label className="va-checkbox">
                  <input name="paid" required type="checkbox" />
                  <span>
                    {free
                      ? "I received the agreed support. No payment was required."
                      : "I received the support and paid the provider the agreed amount."}
                  </span>
                </label>
              </ActionForm>
            )}
            {user.role === "owner" && request.status === "disputed" && (
              <ActionForm
                button="Close without a referral fee"
                busy={busy}
                onSubmit={(data) =>
                  action({ action: "resolve", message: data.get("message") })
                }
              >
                <label>
                  Record the resolution
                  <textarea
                    name="message"
                    required
                    minLength={10}
                    maxLength={1500}
                    rows={3}
                  />
                </label>
              </ActionForm>
            )}
            {(request.status === "completed" ||
              request.status === "cancelled" ||
              request.status === "declined") &&
              family && (
                <Link
                  href="/app/explore"
                  className="va-button va-button-secondary"
                >
                  Explore more support
                  <AppIcon name="arrow" size={18} />
                </Link>
              )}
          </section>
          <section className="va-panel">
            <h2>Your conversation</h2>
            <ol className="va-messages">
              {request.events.map((event) => (
                <li
                  key={event.id}
                  className={event.authorId === user.id ? "is-mine" : ""}
                >
                  <div>
                    <strong>
                      {event.authorId === user.id ? "You" : event.author}
                    </strong>
                    <time dateTime={event.createdAt}>
                      {new Date(event.createdAt).toLocaleString("en-AU", {
                        day: "numeric",
                        month: "short",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </time>
                  </div>
                  <p>{event.message}</p>
                </li>
              ))}
            </ol>
            {open && (family || provider) && (
              <ActionForm
                busy={busy}
                button="Send message"
                clearOnSuccess
                onSubmit={(data) =>
                  action({ action: "message", message: data.get("message") })
                }
              >
                <label>
                  Your message
                  <textarea
                    name="message"
                    required
                    maxLength={1500}
                    rows={3}
                    placeholder="Keep the conversation going…"
                  />
                </label>
              </ActionForm>
            )}
          </section>
        </div>
        <aside>
          <section className="va-panel va-request-facts">
            <p className="va-eyebrow">THE LITTLE DETAILS</p>
            <h2>Request summary</h2>
            <dl>
              <div>
                <dt>Family</dt>
                <dd>{request.familyName}</dd>
              </div>
              <div>
                <dt>Area</dt>
                <dd>{request.suburb}</dd>
              </div>
              <div>
                <dt>When</dt>
                <dd>{request.timing}</dd>
              </div>
              <div>
                <dt>Sent</dt>
                <dd>
                  {new Date(request.createdAt).toLocaleDateString("en-AU")}
                </dd>
              </div>
              <div>
                <dt>Reference</dt>
                <dd>{request.id.slice(0, 8).toUpperCase()}</dd>
              </div>
            </dl>
            <button
              className="va-text-link"
              aria-haspopup="dialog"
              onClick={() =>
                browser.openProvider(request.providerId, "/app/requests/" + id)
              }
            >
              View provider profile <ArrowUpRight />
            </button>
          </section>
          {(family || provider) &&
            ["requested", "offered", "confirmed"].includes(request.status) && (
              <details className="va-panel va-action-details">
                <summary>
                  {provider && request.status !== "confirmed"
                    ? "Unable to help?"
                    : "Need to cancel?"}
                </summary>
                <ActionForm
                  busy={busy}
                  button={
                    provider && request.status !== "confirmed"
                      ? "Decline request"
                      : "Cancel request"
                  }
                  onSubmit={(data) =>
                    action({
                      action:
                        provider && request.status !== "confirmed"
                          ? "decline"
                          : "cancel",
                      message: data.get("message"),
                    })
                  }
                >
                  <label>
                    A short explanation
                    <textarea
                      name="message"
                      required
                      minLength={5}
                      maxLength={1000}
                      rows={3}
                    />
                  </label>
                  <p className="va-field-note">
                    This closes the request in Village. Settle any payment or
                    cancellation costs directly.
                  </p>
                </ActionForm>
              </details>
            )}
          {family &&
            ["confirmed", "delivered", "completed"].includes(
              request.status,
            ) && (
              <details className="va-panel va-action-details">
                <summary>Something not quite right?</summary>
                <ActionForm
                  button="Ask for a review"
                  busy={busy}
                  onSubmit={(data) =>
                    action({ action: "dispute", message: data.get("message") })
                  }
                >
                  <label>
                    What needs attention?
                    <textarea
                      name="message"
                      required
                      minLength={5}
                      maxLength={1500}
                      rows={3}
                    />
                  </label>
                  <p className="va-field-note">
                    This is recorded for the provider and Village owner. It does
                    not process a refund.
                  </p>
                </ActionForm>
              </details>
            )}
        </aside>
      </div>
    </>
  );
}
function ActionForm({
  children,
  button,
  busy,
  onSubmit,
  clearOnSuccess = false,
}: {
  children: ReactNode;
  button: string;
  busy: boolean;
  clearOnSuccess?: boolean;
  onSubmit: (data: FormData) => Promise<unknown>;
}) {
  const [error, setError] = useState(""),
    [sent, setSent] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    setError("");
    setSent(false);
    try {
      const result = await onSubmit(new FormData(form));
      if (clearOnSuccess && result) {
        form.reset();
        setSent(true);
      }
    } catch (problem) {
      setError((problem as Error).message);
    }
  }
  return (
    <form className="va-form va-action-form" onSubmit={submit}>
      {children}
      {error && <ErrorBox message={error} />}
      <button className="va-button" disabled={busy}>
        {busy ? "Saving…" : button}
        <AppIcon name="arrow" size={18} />
      </button>
      {sent && (
        <p className="va-success" role="status">
          Your message is sent.
        </p>
      )}
    </form>
  );
}
