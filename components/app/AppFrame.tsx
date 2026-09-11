"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState, type ReactNode } from "react";
import VillageBrand from "@/components/ui/VillageBrand";
import ArrowUpRight from "@/components/ui/ArrowUpRight";
import { appApi, useApp, useAppData } from "./AppContext";
import { AppIcon, ErrorBox, Loading } from "./AppUI";
import type { AppRole, SupportRequest } from "@/lib/app-types";

export default function AppFrame({ children }: { children: ReactNode }) {
  const {
    user,
    mode,
    loading,
    error,
    reloadSession,
    savedProviders,
    notice,
    dismissNotice,
    saveProvider,
    saving,
  } = useApp();
  const pathname = usePathname();
  const [switching, setSwitching] = useState(false),
    [problem, setProblem] = useState("");
  const switcher = useRef<HTMLDetailsElement>(null);
  const inbox = useAppData<{ requests: SupportRequest[] }>("requests", !!user);
  const unread =
    inbox.data?.requests.filter((r) => r.unreadCount > 0).length || 0;
  const links =
    user?.role === "provider"
      ? [
          { href: "/app/partner", label: "Provider home", icon: "home" },
          { href: "/app/requests", label: "Inbox", icon: "inbox" },
          { href: "/app/explore", label: "Directory", icon: "search" },
        ]
      : user?.role === "owner"
        ? [
            { href: "/app/owner", label: "Overview", icon: "grid" },
            { href: "/app/requests", label: "Requests", icon: "inbox" },
            { href: "/app/explore", label: "Directory", icon: "search" },
          ]
        : [
            { href: "/app", label: "Home", icon: "home" },
            { href: "/app/explore", label: "Find support", icon: "search" },
            { href: "/app/saved", label: "My village", icon: "heart" },
            { href: "/app/requests", label: "Requests", icon: "inbox" },
          ];
  function navigation() {
    return links.map((link) => {
      const count =
        link.href === "/app/requests"
          ? unread
          : link.href === "/app/saved"
            ? savedProviders.length
            : 0;
      const current =
        link.href === "/app"
          ? pathname === link.href
          : pathname.startsWith(link.href) ||
            (link.href === "/app/explore" &&
              pathname.startsWith("/app/providers/"));
      return (
        <Link
          key={link.href}
          href={link.href}
          aria-current={current ? "page" : undefined}
        >
          <span className="va-nav-icon">
            <AppIcon name={link.icon} size={21} />
            {count > 0 && (
              <span className="va-nav-badge">
                {count}
                <span className="sr-only">
                  {link.href === "/app/requests"
                    ? count === 1
                      ? " conversation with new updates"
                      : " conversations with new updates"
                    : count === 1
                      ? " saved provider"
                      : " saved providers"}
                </span>
              </span>
            )}
          </span>
          <span>{link.label}</span>
        </Link>
      );
    });
  }
  async function preview(role: AppRole) {
    setSwitching(true);
    setProblem("");
    try {
      await appApi("preview", { role });
      window.location.assign(
        role === "family"
          ? "/app"
          : role === "provider"
            ? "/app/partner"
            : "/app/owner",
      );
    } catch (e) {
      setProblem((e as Error).message);
      setSwitching(false);
    }
  }
  async function logout() {
    setProblem("");
    setSwitching(true);
    try {
      await appApi("logout", {});
      window.location.assign("/app");
    } catch (e) {
      setProblem((e as Error).message);
    } finally {
      setSwitching(false);
    }
  }
  return (
    <div className="vapp">
      <aside className="va-sidebar">
        <Link href="/app" aria-label="Village app home" className="va-brand">
          <VillageBrand />
        </Link>
        <span className="va-sidebar-kicker">A LITTLE HELP, TOGETHER</span>
        <nav aria-label="Village app">{navigation()}</nav>
        <div className="va-sidebar-bottom">
          <span className="va-sidebar-flower">
            <AppIcon name="leaf" size={28} />
          </span>
          <p>
            You don’t have to
            <br />
            <em>do it all alone.</em>
          </p>
          <Link href="/">
            Visit the website <ArrowUpRight />
          </Link>
          {user ? (
            <button disabled={switching} onClick={logout}>
              Sign out
            </button>
          ) : (
            <Link href="/app/sign-in">Sign in</Link>
          )}
        </div>
      </aside>
      <div className="va-main">
        <header className="va-topbar">
          <Link
            href="/app"
            className="va-mobile-brand"
            aria-label="Village app home"
          >
            <VillageBrand />
          </Link>
          <span className="va-desktop-greeting">Your everyday village</span>
          <div className="va-account">
            {user ? (
              <>
                <span>
                  {user.name}
                  <small>
                    {user.role === "family"
                      ? "Your personal space"
                      : user.role === "owner"
                        ? "Owner workspace"
                        : "Provider workspace"}
                  </small>
                </span>
                <span className="va-avatar" aria-hidden="true">
                  {user.name.charAt(0)}
                </span>
              </>
            ) : (
              <Link className="va-button va-button-small" href="/app/sign-in">
                Sign in
              </Link>
            )}
          </div>
        </header>
        {mode === "preview" && (
          <div className="va-preview">
            <div>
              <strong>Your app preview</strong>
              <span>Example providers · no real bookings or payments</span>
            </div>
            <details ref={switcher}>
              <summary>Try another view</summary>
              <div className="va-preview-options">
                {(["family", "provider", "owner"] as const).map((role) => (
                  <button
                    disabled={switching}
                    key={role}
                    onClick={() => preview(role)}
                  >
                    {role === "family"
                      ? "Family"
                      : role === "provider"
                        ? "Provider"
                        : "Owner"}{" "}
                    view
                    {user?.id === "preview-" + role && (
                      <AppIcon name="check" size={16} />
                    )}
                  </button>
                ))}
              </div>
            </details>
          </div>
        )}
        <div
          className="va-content"
          key={(user?.id || "guest") + ":" + pathname}
        >
          {problem && <ErrorBox message={problem} />}
          {loading || switching ? (
            <Loading />
          ) : mode === "off" ? (
            <div className="va-empty">
              <h1>Your village is getting ready.</h1>
              <p>{error || "This app is waiting for its server connection."}</p>
              {error && (
                <button className="va-button" onClick={reloadSession}>
                  Try connecting again
                </button>
              )}
              <Link className="va-text-link" href="/services">
                Explore existing support
              </Link>
            </div>
          ) : (
            children
          )}
        </div>
        <footer className="va-app-footer">
          <span>A little support makes room for more.</span>
          <Link href="/app/partner">For providers</Link>
          <Link href="/app/privacy">Privacy & your account</Link>
          {user && (
            <button
              className="va-mobile-signout"
              disabled={switching}
              onClick={logout}
            >
              Sign out
            </button>
          )}
        </footer>
      </div>
      {notice && (
        <div className="va-toast">
          <p role="status">{notice.message}</p>
          <div>
            {notice.undo ? (
              <button
                disabled={saving.length > 0}
                onClick={() => {
                  if (notice.undo)
                    void saveProvider(notice.undo.provider, notice.undo.saved);
                }}
              >
                Undo
              </button>
            ) : (
              <Link href="/app/saved" onClick={dismissNotice}>
                My village
              </Link>
            )}
            <button aria-label="Dismiss update" onClick={dismissNotice}>
              <AppIcon name="close" size={18} />
            </button>
          </div>
        </div>
      )}
      <nav className="va-mobile-nav" aria-label="App shortcuts">
        {navigation()}
      </nav>
    </div>
  );
}
