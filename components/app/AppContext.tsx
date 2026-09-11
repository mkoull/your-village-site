"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { AppUser, Listing } from "@/lib/app-types";
export class AppApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}
export async function appApi<T>(
  path: string,
  body?: unknown,
  signal?: AbortSignal,
): Promise<T> {
  let response: Response;
  try {
    response = await fetch("/api/village/" + path, {
      method: body === undefined ? "GET" : "POST",
      credentials: "same-origin",
      cache: "no-store",
      signal,
      ...(body === undefined
        ? {}
        : {
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }),
    });
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new AppApiError(
      "We couldn’t connect. Check your connection and try again. Anything you’ve typed stays here.",
      0,
    );
  }
  const data = await response.json().catch(() => null);
  if (!response.ok || !data)
    throw new AppApiError(
      data?.error || "Village couldn’t load this just now. Please try again.",
      response.status,
    );
  return data;
}
type Session = {
  user: AppUser | null;
  mode: "preview" | "pilot" | "off";
  error?: string;
};
type Notice = { message: string; undo?: { provider: Listing; saved: boolean } };
type AppState = Session & {
  loading: boolean;
  version: number;
  refresh: () => void;
  reloadSession: () => void;
  setSession: (session: Session) => void;
  savedProviders: Listing[];
  savedLoading: boolean;
  savedError: string;
  reloadSaved: () => void;
  saving: string[];
  saveProvider: (provider: Listing, saved: boolean) => Promise<void>;
  notice: Notice | null;
  dismissNotice: () => void;
};
const Context = createContext<AppState | null>(null);
export function AppContext({ children }: { children: ReactNode }) {
  const [session, updateSession] = useState<Session>({
    user: null,
    mode: "off",
  });
  const [loading, setLoading] = useState(true),
    [version, setVersion] = useState(0);
  const [sessionRetry, setSessionRetry] = useState(0),
    [savedRetry, setSavedRetry] = useState(0);
  const [saved, setSaved] = useState<{
    account: string;
    providers: Listing[];
  } | null>(null);
  const [savedProblem, setSavedProblem] = useState<{
    account: string;
    error: string;
  } | null>(null);
  const [saving, setSaving] = useState<string[]>([]),
    [notice, setNotice] = useState<Notice | null>(null);
  const account = useRef<string | undefined>(undefined),
    revision = useRef(0),
    pending = useRef(new Set<string>());
  const setSession = useCallback((next: Session) => {
    if (account.current !== next.user?.id) {
      revision.current++;
      pending.current.clear();
      setSaving([]);
      setNotice(null);
    }
    account.current = next.user?.id;
    updateSession(next);
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    appApi<Session>("session", undefined, controller.signal)
      .then((next) => {
        if (!controller.signal.aborted) setSession(next);
      })
      .catch((error) => {
        if (!controller.signal.aborted)
          setSession({ user: null, mode: "off", error: error.message });
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [sessionRetry, setSession]);
  const refresh = useCallback(() => setVersion((value) => value + 1), []);
  const reloadSession = useCallback(
    () => setSessionRetry((value) => value + 1),
    [],
  );
  const reloadSaved = useCallback(
    () => setSavedRetry((value) => value + 1),
    [],
  );
  useEffect(() => {
    if (session.user?.role !== "family") return;
    const id = session.user.id,
      startRevision = revision.current,
      controller = new AbortController();
    appApi<{ providers: Listing[] }>("saved", undefined, controller.signal)
      .then((data) => {
        if (
          !controller.signal.aborted &&
          account.current === id &&
          revision.current === startRevision
        ) {
          setSaved({ account: id, providers: data.providers });
          setSavedProblem(null);
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted && account.current === id) {
          setSavedProblem({ account: id, error: error.message });
          if (error.status === 401) reloadSession();
        }
      });
    return () => controller.abort();
  }, [session.user?.id, session.user?.role, savedRetry, reloadSession]);
  const savedProviders =
    saved && saved.account === session.user?.id ? saved.providers : [];
  const savedError =
    savedProblem?.account === session.user?.id ? savedProblem?.error || "" : "";
  async function saveProvider(provider: Listing, selected: boolean) {
    const id = session.user?.id;
    if (
      !id ||
      session.user?.role !== "family" ||
      pending.current.has(provider.id)
    )
      return;
    const wasSaved = savedProviders.some((item) => item.id === provider.id);
    revision.current++;
    pending.current.add(provider.id);
    setSaving([...pending.current]);
    setNotice(null);
    setSaved((current) => ({
      account: id,
      providers: selected
        ? [
            ...(current?.account === id ? current.providers : []).filter(
              (item) => item.id !== provider.id,
            ),
            provider,
          ]
        : (current?.account === id ? current.providers : []).filter(
            (item) => item.id !== provider.id,
          ),
    }));
    try {
      await appApi("saved", { providerId: provider.id, saved: selected });
      if (account.current === id) {
        setSavedProblem(null);
        setNotice({
          message:
            provider.name +
            (selected
              ? " is in your village."
              : " was removed from your village."),
          undo: selected ? undefined : { provider, saved: true },
        });
      }
    } catch (error) {
      if (account.current === id) {
        setSaved((current) => ({
          account: id,
          providers: wasSaved
            ? [
                ...(current?.providers || []).filter(
                  (item) => item.id !== provider.id,
                ),
                provider,
              ]
            : (current?.providers || []).filter(
                (item) => item.id !== provider.id,
              ),
        }));
        setNotice({ message: (error as Error).message });
        if (error instanceof AppApiError && error.status === 401)
          reloadSession();
      }
    } finally {
      if (account.current === id) {
        pending.current.delete(provider.id);
        setSaving([...pending.current]);
      }
    }
  }
  return (
    <Context.Provider
      value={{
        ...session,
        loading,
        version,
        refresh,
        setSession,
        reloadSession,
        savedProviders,
        savedLoading:
          session.user?.role === "family" &&
          saved?.account !== session.user.id &&
          !savedError,
        savedError,
        reloadSaved,
        saving,
        saveProvider,
        notice,
        dismissNotice: () => setNotice(null),
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useApp() {
  const context = useContext(Context);
  if (!context) throw new Error("App context missing");
  return context;
}
export function useAppData<T>(path: string, enabled = true) {
  const { version, user, reloadSession } = useApp();
  const identity = (user?.id || "guest") + ":" + path;
  const [snapshot, setSnapshot] = useState<{
    identity: string;
    data: T;
  } | null>(null);
  const [problem, setProblem] = useState<{
    identity: string;
    message: string;
  } | null>(null);
  const [refreshing, setRefreshing] = useState(false),
    [retry, setRetry] = useState(0);
  const reload = useCallback(() => setRetry((value) => value + 1), []);
  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    setRefreshing(true);
    appApi<T>(path, undefined, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setSnapshot({ identity, data });
          setProblem(null);
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setProblem({ identity, message: error.message });
          if (error.status === 401) reloadSession();
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setRefreshing(false);
      });
    return () => controller.abort();
  }, [path, enabled, version, retry, identity, reloadSession]);
  useEffect(() => {
    if (!enabled) return;
    const check = () => {
      if (document.visibilityState === "visible") reload();
    };
    window.addEventListener("focus", check);
    window.addEventListener("online", check);
    const timer = /^(requests|partner|owner)(\/|$)/.test(path)
      ? setInterval(check, 15000)
      : undefined;
    return () => {
      window.removeEventListener("focus", check);
      window.removeEventListener("online", check);
      clearInterval(timer);
    };
  }, [enabled, path, reload]);
  const data =
    enabled && snapshot?.identity === identity ? snapshot.data : null;
  const error =
    enabled && problem?.identity === identity ? problem.message : "";
  return {
    data,
    error,
    loading: enabled && !data && !error,
    refreshing,
    reload,
  };
}
