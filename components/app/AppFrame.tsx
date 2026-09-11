"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import VillageBrand from "@/components/ui/VillageBrand";
import { appApi, useApp } from "./AppContext";
import { AppIcon, ErrorBox, Loading } from "./AppUI";
import type { AppRole, AppUser } from "@/lib/app-types";
export default function AppFrame({ children }: { children: ReactNode }) {
  const { user, mode, loading, error, setSession, refresh } = useApp();
  const pathname = usePathname(), router = useRouter();
  const [switching, setSwitching] = useState(false), [problem, setProblem] = useState("");
  const links = user?.role === "provider" ? [{ href: "/app/partner", label: "Provider home", icon: "home" }, { href: "/app/requests", label: "Inbox", icon: "inbox" }, { href: "/app/explore", label: "Directory", icon: "search" }] : user?.role === "owner" ? [{ href: "/app/owner", label: "Overview", icon: "grid" }, { href: "/app/requests", label: "Requests", icon: "inbox" }, { href: "/app/explore", label: "Directory", icon: "search" }] : [{ href: "/app", label: "Home", icon: "home" }, { href: "/app/explore", label: "Find support", icon: "search" }, { href: "/app/saved", label: "My village", icon: "heart" }, { href: "/app/requests", label: "Requests", icon: "inbox" }];
  async function preview(role: AppRole) {
    setSwitching(true); setProblem("");
    try { const result = await appApi<{ user: AppUser; mode: "preview" }>("preview", { role }); setSession(result); refresh(); router.push(role === "family" ? "/app" : `/app/${role === "provider" ? "partner" : "owner"}`); } catch (e) { setProblem((e as Error).message); } finally { setSwitching(false); }
  }
  async function logout() { setProblem(""); try { await appApi("logout", {}); setSession({ user: null, mode }); refresh(); router.push("/app"); } catch (e) { setProblem((e as Error).message); } }
  return <div className="vapp"><aside className="va-sidebar"><Link href="/app" aria-label="Village app home" className="va-brand"><VillageBrand/></Link><span className="va-sidebar-kicker">A LITTLE HELP, TOGETHER</span><nav aria-label="Village app">{links.map(link => <Link key={link.href} href={link.href} aria-current={(link.href === "/app" ? pathname === link.href : pathname.startsWith(link.href)) ? "page" : undefined}><AppIcon name={link.icon}/><span>{link.label}</span></Link>)}</nav><div className="va-sidebar-bottom"><span className="va-sidebar-flower"><AppIcon name="leaf" size={28}/></span><p>You don’t have to<br/><em>do it all alone.</em></p><Link href="/">Visit the website <span aria-hidden="true">↗</span></Link>{user ? <button onClick={logout}>Sign out</button> : <Link href="/app/sign-in">Sign in</Link>}</div></aside>
    <div className="va-main"><header className="va-topbar"><Link href="/app" className="va-mobile-brand" aria-label="Village app home"><VillageBrand/></Link><span className="va-desktop-greeting">Your everyday village <span aria-hidden="true">✧</span></span><div className="va-account">{user ? <><span>{user.name}<small>{user.role === "family" ? "Your personal space" : `${user.role === "owner" ? "Owner" : "Provider"} workspace`}</small></span><span className="va-avatar" aria-hidden="true">{user.name.charAt(0)}</span></> : <Link className="va-button va-button-small" href="/app/sign-in">Sign in</Link>}</div></header>
      {mode === "preview" && <div className="va-preview"><div><strong>Explore the app</strong><span>Local preview · fictional providers · no external messages or payments</span></div><details><summary>Try another view</summary><div className="va-preview-options">{(["family", "provider", "owner"] as const).map(role => <button disabled={switching} key={role} onClick={() => preview(role)}>{role === "family" ? "Family" : role === "provider" ? "Provider" : "Owner"} view</button>)}</div></details></div>}
      <div className="va-content">{problem && <ErrorBox message={problem}/>} {loading ? <Loading/> : mode === "off" ? <div className="va-empty"><h1>Your village is getting ready.</h1><p>{error || "This app is waiting for its server connection."}</p><Link className="va-button" href="/services">Explore existing support</Link></div> : children}</div>
      <footer className="va-app-footer"><span>A little support makes room for more.</span><Link href="/app/partner">For providers</Link><Link href="/app/privacy">Privacy & your account</Link>{user && <button className="va-mobile-signout" onClick={logout}>Sign out</button>}</footer>
    </div><nav className="va-mobile-nav" aria-label="App shortcuts">{links.map(link => <Link key={link.href} href={link.href} aria-current={(link.href === "/app" ? pathname === link.href : pathname.startsWith(link.href)) ? "page" : undefined}><AppIcon name={link.icon} size={20}/><span>{link.label}</span></Link>)}</nav>
  </div>;
}
