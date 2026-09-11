"use client";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { AppUser } from "@/lib/app-types";
export async function appApi<T>(path: string, body?: unknown, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`/api/village/${path}`, { method: body === undefined ? "GET" : "POST", credentials: "same-origin", cache: "no-store", signal, ...(body === undefined ? {} : { headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }) });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Something went wrong. Please try again.");
  return data;
}
type Session = { user: AppUser | null; mode: "preview" | "pilot" | "off"; error?: string };
const Context = createContext<Session & { loading: boolean; version: number; refresh: () => void; setSession: (session: Session) => void } | null>(null);
export function AppContext({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>({ user: null, mode: "off" });
  const [loading, setLoading] = useState(true), [version, setVersion] = useState(0);
  useEffect(() => { appApi<Session>("session").then(setSession).catch(error => setSession({ user: null, mode: "off", error: error.message })).finally(() => setLoading(false)); }, []);
  const refresh = useCallback(() => setVersion(value => value + 1), []);
  return <Context.Provider value={{ ...session, loading, version, refresh, setSession }}>{children}</Context.Provider>;
}
export function useApp() { const context = useContext(Context); if (!context) throw new Error("App context missing"); return context; }
export function useAppData<T>(path: string, enabled = true) {
  const { version, user } = useApp();
  const identity = `${user?.id || "guest"}:${path}`;
  const [snapshot, setSnapshot] = useState<{ identity: string; data: T } | null>(null), [error, setError] = useState(""), [loading, setLoading] = useState(true), [retry, setRetry] = useState(0);
  const reload = useCallback(() => setRetry(value => value + 1), []);
  useEffect(() => {
    if (!enabled) { setLoading(false); setSnapshot(null); return; }
    const controller = new AbortController(); setLoading(true); setError("");
    appApi<T>(path, undefined, controller.signal).then(data => { if (!controller.signal.aborted) setSnapshot({ identity, data }); }).catch(error => { if (!controller.signal.aborted) setError(error.message); }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [path, enabled, version, retry, identity]);
  return { data: enabled && snapshot?.identity === identity ? snapshot.data : null, error, loading: loading || (enabled && !error && snapshot?.identity !== identity), reload };
}
