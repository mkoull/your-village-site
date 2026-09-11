"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { appApi, useApp } from "./AppContext";
import { AppIcon, ErrorBox, Heading } from "./AppUI";
import { safeAppPath } from "@/lib/app-experience";
import type { AppUser } from "@/lib/app-types";
export function SignIn() {
  const { mode, setSession, refresh, reloadSaved } = useApp();
  const router = useRouter(),
    params = useSearchParams();
  const [register, setRegister] = useState(params.get("register") === "1"),
    [role, setRole] = useState(
      params.get("role") === "provider" ? "provider" : "family",
    );
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function finish(session: { user: AppUser; mode: "preview" | "pilot" }) {
    let next =
      session.user.role === "provider"
        ? "/app/partner"
        : session.user.role === "owner"
          ? "/app/owner"
          : safeAppPath(params.get("next"));
    const provider = params.get("provider");
    if (
      session.user.role === "family" &&
      params.get("intent") === "save" &&
      provider &&
      /^[a-z0-9-]{1,100}$/.test(provider)
    ) {
      try {
        await appApi("saved", { providerId: provider, saved: true });
      } catch {
        const url = new URL(next, "https://village.invalid");
        url.searchParams.set("save", "failed");
        next = url.pathname + url.search;
      }
    }
    setSession(session);
    refresh();
    reloadSaved();
    router.replace(next);
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    try {
      const session = await appApi<{
        user: AppUser;
        mode: "preview" | "pilot";
      }>(register ? "register" : "login", {
        name: data.get("name"),
        email: data.get("email"),
        password: data.get("password"),
        role,
        consent: data.get("consent") === "on",
      });
      await finish(session);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function preview() {
    setBusy(true);
    try {
      const session = await appApi<{ user: AppUser; mode: "preview" }>(
        "preview",
        { role: "family" },
      );
      await finish(session);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="va-auth-layout">
      <div>
        <Heading
          eyebrow="A SPACE THAT’S YOURS"
          title={
            register
              ? "Let’s make room for a little help."
              : "Welcome back to your village."
          }
        >
          Keep your favourite providers and conversations together, so you can
          pick up where you left off.
        </Heading>
        <div className="va-auth-promise">
          <AppIcon name="leaf" size={32} />
          <p>
            Start small.
            <br />
            Find your people.
            <br />
            <em>Feel a little more supported.</em>
          </p>
        </div>
      </div>
      <section className="va-panel va-auth-panel">
        <div className="va-auth-tabs">
          <button
            aria-pressed={!register}
            onClick={() => {
              setRegister(false);
              setError("");
            }}
          >
            Sign in
          </button>
          <button
            aria-pressed={register}
            onClick={() => {
              setRegister(true);
              setError("");
            }}
          >
            Create account
          </button>
        </div>
        {params.get("intent") === "save" && (
          <p className="va-field-note">
            Sign in to keep this provider in your village. We’ll take you
            straight back to their profile.
          </p>
        )}
        <form onSubmit={submit} className="va-form">
          {register && (
            <>
              <label>
                I’m here to
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="family">Find support for my family</option>
                  <option value="provider">Offer support as a provider</option>
                </select>
              </label>
              <label>
                Your name
                <input
                  name="name"
                  autoComplete="name"
                  required
                  minLength={2}
                  maxLength={80}
                />
              </label>
            </>
          )}
          <label>
            Email address
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
            />
          </label>
          <label>
            Password
            <span className="va-password">
              <input
                name="password"
                aria-label="Password"
                type={showPassword ? "text" : "password"}
                autoComplete={register ? "new-password" : "current-password"}
                required
                minLength={register ? 12 : 1}
                maxLength={128}
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </span>
          </label>
          {register && (
            <>
              <p className="va-field-note">
                Use at least 12 characters. Password reset is not available in
                this pilot, so keep your password somewhere safe.
              </p>
              <label className="va-checkbox">
                <input name="consent" type="checkbox" required />
                <span>
                  I’ve read the{" "}
                  <Link
                    href="/app/privacy"
                    target="_blank"
                    rel="noopener"
                    aria-label="Account privacy notice (opens in a new tab)"
                  >
                    account privacy notice
                  </Link>{" "}
                  and agree to store my account and requests in Village.
                </span>
              </label>
            </>
          )}
          {error && <ErrorBox message={error} />}
          <button className="va-button" disabled={busy}>
            {busy
              ? "Opening your village…"
              : register
                ? "Create my account"
                : "Sign in"}
            <AppIcon name="arrow" size={18} />
          </button>
        </form>
        {mode === "preview" && (
          <div className="va-auth-preview">
            <p>Just having a look?</p>
            <button
              className="va-button va-button-secondary"
              disabled={busy}
              onClick={preview}
            >
              Use the example family account
            </button>
            <small>Use fictional details when trying this local preview.</small>
          </div>
        )}
      </section>
    </div>
  );
}
export function AccountPrivacy() {
  return (
    <>
      <Heading
        eyebrow="YOUR SPACE, YOUR INFORMATION"
        title="A little clarity about your account."
      >
        What Village keeps, who can see it and what this pilot can do.
      </Heading>
      <div className="va-readable va-panel">
        <h2>What we store</h2>
        <p>
          Your account name, email and a protected password hash are stored on
          the app server. Your saved providers, requests, messages, offers and
          progress are also stored there. Contact details and messages are not
          put in browser storage. An HTTP-only session cookie keeps you signed
          in for up to 30 days.
        </p>
        <h2>Who can see a request</h2>
        <p>
          You and the provider you choose can see your request and conversation.
          Village’s owner can access requests to follow up on delivery, review
          issues and reconcile agreed referral fees. Other families and
          providers cannot access them.
        </p>
        <h2>Keep the details practical</h2>
        <p>
          Share the suburb, timing and everyday support you need. Please don’t
          submit medical histories, identity documents or other sensitive
          records. Public provider profiles do not establish that a provider has
          been independently vetted.
        </p>
        <h2>Local preview</h2>
        <p>
          Example providers, prices and availability are fictional. Preview
          accounts share an example workspace on this computer, so use fictional
          details. Nothing is emailed to real businesses and no money is
          collected. The preview and a real pilot use separate databases.
        </p>
        <h2>Accounts and communication</h2>
        <p>
          Replies appear in the app. Email verification, notifications, password
          recovery and self-service account deletion are not enabled in this
          first version. Before inviting real families, Village needs an
          operational support contact, a retention and deletion process, and
          backed-up production hosting. App pages and requests are excluded from
          page-view analytics.
        </p>
        <h2>Fees and payments</h2>
        <p>
          Families can browse and request support for free. Providers may accept
          a referral agreement during onboarding. A fee is recorded only for an
          eligible first completed, paid booking after the family confirms it.
          Fees in the owner dashboard are unbilled estimates, not money
          received. Payment, cancellation charges and refunds are handled
          directly with the provider.
        </p>
        <Link className="va-button" href="/app">
          Back to your village
        </Link>
      </div>
    </>
  );
}
