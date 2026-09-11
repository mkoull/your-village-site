"use client";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { services } from "@/content/services";
import ArrowUpRight from "@/components/ui/ArrowUpRight";
import { useApp, useAppData } from "./AppContext";
import { AppIcon, ErrorBox, Loading, ProviderCard, ServiceIcon } from "./AppUI";
import { ProviderProfile } from "./ProviderDetails";
import {
  SupportContext,
  type RequestDraft,
  type SupportSelection,
} from "./SupportContext";
import type { Listing } from "@/lib/app-types";

type Visit = { key: string; depth: number; selection: SupportSelection };
const viewKey = (s: SupportSelection | null) =>
  s ? `${s.category}:${s.providerId}:${s.requesting}` : "";

export default function SupportBrowser({ children }: { children: ReactNode }) {
  const { user, notice, saveProvider, saving, dismissNotice, previewAccess } =
    useApp();
  const router = useRouter();
  const pathname = usePathname();
  const [selection, setSelection] = useState<SupportSelection | null>(null);
  const [drafts, setDrafts] = useState<Record<string, RequestDraft>>({});
  const current = useRef(selection);
  current.current = selection;
  const key = useRef("");
  const pendingDestination = useRef<string | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const positions = useRef(
    new Map<string, { top: number; focus: HTMLElement | null }>(),
  );
  const route = useRef(pathname);
  const directory = useAppData<{ providers: Listing[] }>(
    "providers",
    !!selection?.category,
  );
  const service = services.find((s) => s.slug === selection?.category);
  const providers =
    directory.data?.providers.filter((p) => p.category === service?.slug) || [];

  function rememberPosition() {
    if (current.current)
      positions.current.set(viewKey(current.current), {
        top: scroller.current?.scrollTop || 0,
        focus:
          document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null,
      });
  }
  function visit(next: SupportSelection, replace = false) {
    rememberPosition();
    key.current ||= crypto.randomUUID();
    const previous = history.state?.villageSupport as Visit | undefined;
    const depth =
      previous?.key === key.current ? previous.depth + (replace ? 0 : 1) : 1;
    const state = {
      ...history.state,
      villageSupport: { key: key.current, depth, selection: next },
    };
    // A same-URL history entry lets the phone's Back gesture dismiss the panel.
    // Keep Next's history state intact and never put request drafts into history.
    history[replace ? "replaceState" : "pushState"](state, "", location.href);
    setSelection(next);
  }
  function close() {
    const visit = history.state?.villageSupport as Visit | undefined;
    if (visit?.key === key.current) history.go(-visit.depth);
    else setSelection(null);
  }
  function leave(url: string) {
    const visit = history.state?.villageSupport as Visit | undefined;
    if (visit?.key === key.current) {
      pendingDestination.current = url;
      history.go(-visit.depth);
    } else {
      setSelection(null);
      router.push(url);
    }
  }
  useEffect(() => {
    function pop() {
      rememberPosition();
      const visit = history.state?.villageSupport as Visit | undefined;
      setSelection(visit?.key === key.current ? visit.selection : null);
      if (pendingDestination.current) {
        const url = pendingDestination.current;
        pendingDestination.current = null;
        // Next restores the underlying route during this popstate event.
        // Start the deliberate navigation after that restoration has settled.
        window.setTimeout(() => router.push(url), 0);
      }
    }
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
  }, [router]);
  useEffect(() => {
    if (route.current !== pathname) {
      route.current = pathname;
      setSelection(null);
      positions.current.clear();
    }
  }, [pathname]);
  useEffect(() => {
    setDrafts({});
    setSelection(null);
    positions.current.clear();
    key.current = "";
  }, [user?.id]);

  const open = !!selection;
  useLayoutEffect(() => {
    if (!open || !dialog.current) return;
    const element = dialog.current;
    const trigger =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const y = window.scrollY;
    const bodyStyle = document.body.getAttribute("style");
    Object.assign(document.body.style, {
      position: "fixed",
      top: `-${y}px`,
      width: "100%",
      overflow: "hidden",
    });
    element.showModal();
    closeButton.current?.focus({ preventScroll: true });
    return () => {
      element.close();
      if (bodyStyle === null) document.body.removeAttribute("style");
      else document.body.setAttribute("style", bodyStyle);
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
      window.scrollTo({ top: y, behavior: "instant" });
    };
  }, [open]);
  useLayoutEffect(() => {
    if (!selection) return;
    const saved = positions.current.get(viewKey(selection));
    if (scroller.current) scroller.current.scrollTop = saved?.top || 0;
    if (saved?.focus?.isConnected && !saved.focus.closest("[hidden]"))
      saved.focus.focus({ preventScroll: true });
    else closeButton.current?.focus({ preventScroll: true });
  }, [selection?.category, selection?.providerId, selection?.requesting]);

  const value = {
    selection,
    drafts,
    setDraft: (id: string, draft: RequestDraft | null) =>
      setDrafts((before) => {
        const next = { ...before };
        if (draft) next[id] = draft;
        else delete next[id];
        return next;
      }),
    openCategory: (category: string) =>
      visit({
        category,
        providerId: null,
        from: location.pathname + location.search,
        requesting: false,
      }),
    openProvider: (providerId: string, from: string) =>
      visit({
        category: current.current?.category || null,
        providerId,
        from,
        requesting: false,
      }),
    request: () => {
      if (selection) visit({ ...selection, requesting: true });
    },
    details: () => history.back(),
    back: () => history.back(),
    close,
    leave,
  };
  return (
    <SupportContext.Provider value={value}>
      {children}
      <dialog
        ref={dialog}
        className="vapp va-support-dialog"
        aria-labelledby="va-support-title"
        onClickCapture={(event) => {
          if (
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
          )
            return;
          const link =
            event.target instanceof Element ? event.target.closest("a") : null;
          if (!link || link.target === "_blank") return;
          const url = new URL(link.href);
          if (
            url.origin === location.origin &&
            /^\/app(?:\/|$)/.test(url.pathname) &&
            !link.getAttribute("href")?.startsWith("#")
          ) {
            event.preventDefault();
            leave(url.pathname + url.search + url.hash);
          }
        }}
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const r = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < r.left ||
            event.clientX > r.right ||
            event.clientY < r.top ||
            event.clientY > r.bottom
          )
            close();
        }}
      >
        <div className="va-sheet-toolbar">
          {selection?.providerId ? (
            <button
              className="va-text-button"
              onClick={
                selection.requesting
                  ? value.details
                  : selection.category
                    ? value.back
                    : close
              }
            >
              <span aria-hidden="true">←</span>
              {selection.requesting
                ? "Support details"
                : selection.category
                  ? `Back to ${service?.shortTitle.toLowerCase()}`
                  : "Back to browsing"}
            </button>
          ) : (
            <span className="va-eyebrow">A LITTLE HELP, AT YOUR PACE</span>
          )}
          <button
            ref={closeButton}
            className="va-sheet-close"
            aria-label="Close support panel"
            onClick={close}
          >
            <AppIcon name="close" />
          </button>
        </div>
        <div ref={scroller} className="va-sheet-scroll">
          {selection && (
            <>
              {service && (
                <div hidden={!!selection.providerId}>
                  <header
                    className={`va-category-intro village-tone-${service.tone}`}
                  >
                    <span className="va-category-symbol">
                      <ServiceIcon slug={service.slug} />
                    </span>
                    <p className="va-eyebrow">{service.title}</p>
                    <h2
                      id={
                        !selection.providerId ? "va-support-title" : undefined
                      }
                    >
                      {service.tagline}.
                    </h2>
                    <p>{service.description}</p>
                  </header>
                  {directory.error ? (
                    <ErrorBox
                      message={directory.error}
                      retry={directory.reload}
                    />
                  ) : directory.loading ? (
                    <Loading />
                  ) : providers.length ? (
                    <>
                      <div className="va-sheet-results">
                        <h3>Meet your support</h3>
                        <span>
                          {providers.length}{" "}
                          {providers.length === 1 ? "provider" : "providers"}
                        </span>
                      </div>
                      <div className="va-provider-grid va-sheet-providers">
                        {providers.map((provider) => (
                          <ProviderCard
                            key={provider.id}
                            provider={provider}
                            from={selection.from}
                          />
                        ))}
                      </div>
                      <p className="va-sheet-hint">
                        Have a look inside. Save anyone you’d like to come back
                        to.
                      </p>
                    </>
                  ) : (
                    <section className="va-category-empty">
                      <h3>There’s room for more support here.</h3>
                      <p>
                        We haven’t added providers in this category yet. Our
                        website has independent services and practical guidance
                        you can explore now.
                      </p>
                      <ul className="va-included">
                        {service.features.map((feature) => (
                          <li key={feature}>
                            <AppIcon name="check" size={18} />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <a
                        className="va-button va-button-secondary"
                        href={`${previewAccess ? "https://your-village-site.vercel.app" : ""}/services/${service.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Explore existing services{" "}
                        <ArrowUpRight />
                        <span className="sr-only"> (opens a new tab)</span>
                      </a>
                      <button className="va-text-button" onClick={close}>
                        Keep exploring my village
                      </button>
                    </section>
                  )}
                </div>
              )}
              {selection.providerId && (
                <ProviderProfile
                  key={selection.providerId}
                  id={selection.providerId}
                  embedded
                />
              )}
            </>
          )}
        </div>
        {notice && (
          <div className="va-sheet-notice" role="status">
            <span>{notice.message}</span>
            {notice.undo && (
              <button
                className="va-text-button"
                disabled={saving.includes(notice.undo.provider.id)}
                onClick={() => {
                  if (notice.undo)
                    void saveProvider(notice.undo.provider, notice.undo.saved);
                }}
              >
                Undo
              </button>
            )}
            <button
              className="va-sheet-close"
              aria-label="Dismiss update"
              onClick={dismissNotice}
            >
              <AppIcon name="close" size={18} />
            </button>
          </div>
        )}
      </dialog>
    </SupportContext.Provider>
  );
}
