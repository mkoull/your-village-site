"use client";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { services } from "@/content/services";
import type { Listing, SupportRequest } from "@/lib/app-types";
import { requestLabels, money } from "@/lib/app-types";
import { appApi, useApp, useAppData } from "./AppContext";
export function AppIcon({ name, size = 22 }: { name: string; size?: number }) {
  const paths: Record<string, ReactNode> = {
    home: <><path d="m3 10 9-7 9 7v10H3Z"/><path d="M9 20v-7h6v7"/></>,
    search: <><circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/></>,
    heart: <path d="M12 20S3 15 3 8a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 7-9 12-9 12Z"/>,
    inbox: <><path d="M4 4h16l2 14H2Z"/><path d="M3 12h5l2 3h4l2-3h5"/></>,
    arrow: <><path d="M4 12h16m-6-6 6 6-6 6"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    pin: <><path d="M19 10c0 6-7 11-7 11S5 16 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2"/></>,
    leaf: <><path d="M20 3C8 1 1 8 5 16c8 4 15-1 15-13Z"/><path d="M4 21 15 9"/></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.leaf}</svg>;
}
export function ServiceIcon({ slug }: { slug: string }) {
  const service = services.find(item => item.slug === slug);
  return <span className="va-service-icon" aria-hidden="true" dangerouslySetInnerHTML={{ __html: service?.icon || "" }} />;
}
export function Heading({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return <header className="va-heading"><p className="va-eyebrow">{eyebrow}</p><h1>{title}</h1>{children && <div className="va-intro">{children}</div>}</header>;
}
export function ErrorBox({ message, retry }: { message: string; retry?: () => void }) { return <div className="va-error" role="alert"><p>{message}</p>{retry && <button className="va-text-button" onClick={retry}>Try again</button>}</div>; }
export function Loading() { return <div className="va-loading" role="status"><span /> Gathering your village…</div>; }
export function Empty({ title, children, href = "/app/explore", action = "Explore support", asTitle = false }: { title: string; children: ReactNode; href?: string; action?: string; asTitle?: boolean }) {
  const Title = asTitle ? "h1" : "h2";
  return <div className="va-empty"><span className="va-empty-symbol"><AppIcon name="leaf" size={32}/></span><Title>{title}</Title><p>{children}</p><Link className="va-button" href={href}>{action}<AppIcon name="arrow" size={18}/></Link></div>;
}
export function SignInPrompt({ asTitle = false }: { asTitle?: boolean }) {
  const pathname = usePathname();
  return <Empty asTitle={asTitle} title="Make this little space yours." href={`/app/sign-in?next=${encodeURIComponent(pathname)}`} action="Sign in or create an account">Save your favourite providers, request support and keep your conversations together.</Empty>;
}
export function SaveProviderAction({ provider }: { provider: Listing }) {
  const { user, refresh } = useApp(); const router = useRouter();
  const saved = useAppData<{ providers: Listing[] }>("saved", user?.role === "family");
  const [busy, setBusy] = useState(false), [error, setError] = useState("");
  const selected = !!saved.data?.providers.some(p => p.id === provider.id);
  if (user && user.role !== "family") return null;
  async function toggle() { if (!user) { router.push(`/app/sign-in?next=/app/providers/${provider.id}`); return; } setBusy(true); setError(""); try { await appApi("saved", { providerId: provider.id, saved: !selected }); refresh(); } catch (e) { setError((e as Error).message); } finally { setBusy(false); } }
  return <div className="va-profile-save"><button className="va-button va-button-secondary" disabled={busy || (!!user && saved.loading)} onClick={toggle} aria-pressed={selected}><AppIcon name={selected ? "check" : "heart"} size={18}/>{selected ? "Saved in my village" : "Save to my village"}</button>{error && <ErrorBox message={error}/>}</div>;
}
export function ProviderArt({ category, large = false }: { category: string; large?: boolean }) {
  return <div className={`va-art va-art-${category} ${large ? "va-art-large" : ""}`} aria-hidden="true"><span className="va-art-sun"/><span className="va-art-arch"/><span className="va-art-leaf va-art-leaf-one"/><span className="va-art-leaf va-art-leaf-two"/><div className="va-art-object"><ServiceIcon slug={category}/></div><span className="va-art-ground"/></div>;
}
export function ProviderCard({ provider, saved, onSaved }: { provider: Listing; saved: boolean; onSaved: () => void }) {
  const { user } = useApp(); const router = useRouter();
  const [busy, setBusy] = useState(false), [error, setError] = useState("");
  async function toggle() {
    if (!user) { router.push(`/app/sign-in?next=/app/providers/${provider.id}`); return; }
    setBusy(true); setError("");
    try { await appApi("saved", { providerId: provider.id, saved: !saved }); onSaved(); } catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  }
  return <article className="va-provider-card">
    <Link href={`/app/providers/${provider.id}`} tabIndex={-1} aria-hidden="true"><ProviderArt category={provider.category}/></Link>
    {(!user || user.role === "family") && <button className={`va-save ${saved ? "is-saved" : ""}`} aria-label={`${saved ? "Remove" : "Save"} ${provider.name}${saved ? " from your village" : " to your village"}`} aria-pressed={saved} disabled={busy} onClick={toggle}><AppIcon name="heart"/></button>}
    <div className="va-provider-body"><div className="va-card-meta"><span>{services.find(s => s.slug === provider.category)?.shortTitle}</span><span>{provider.demo ? "Example provider" : provider.status === "published" ? provider.mode : "Listing paused"}</span></div>
      <h3><Link href={`/app/providers/${provider.id}`}>{provider.name}</Link></h3><p>{provider.summary}</p>
      <p className="va-location"><AppIcon name="pin" size={15}/>{provider.mode === "Online" ? "Online · from wherever you are" : `${provider.suburbs.slice(0, 2).join(", ")}${provider.suburbs.length > 2 ? ` +${provider.suburbs.length - 2}` : ""}`}</p>
      <div className="va-card-bottom"><span>{provider.price.replace(/^Example: /, "")}</span><Link aria-label={`View ${provider.name}`} href={`/app/providers/${provider.id}`}><AppIcon name="arrow" size={20}/></Link></div>
      {error && <ErrorBox message={error}/>}
    </div>
  </article>;
}
export function RequestRow({ request, providerView = false }: { request: SupportRequest; providerView?: boolean }) {
  return <Link href={`/app/requests/${request.id}`} className="va-request-row"><span className={`va-request-icon va-tone-${request.category}`}><ServiceIcon slug={request.category}/></span><div className="va-request-summary"><h3>{providerView ? request.familyName : request.providerName}</h3><p>{providerView ? `${request.providerName} · ${request.suburb}` : `${request.suburb} · ${request.timing}`}</p></div><div className="va-request-end"><span className={`va-status va-status-${request.status}`}>{requestLabels[request.status]}</span>{request.quoteCents !== null && <span>{money(request.quoteCents)}</span>}</div><AppIcon name="arrow" size={18}/></Link>;
}
