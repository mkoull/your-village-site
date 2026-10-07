import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { randomUUID } from "expo-crypto";
import { slugs } from "../domain/catalog";
import {
  addPerson,
  addTask,
  decodeState,
  emptyState,
  finishTask,
  progressSupport,
  selectSupport,
} from "../domain/model";
import type { MobileVillage, SupportProgress, Task } from "../domain/model";
import { persistence } from "../platform/storage";
import {
  cancelAllReminders,
  cancelReminder,
  scheduleReminder,
  restoreReminders,
} from "../platform/reminders";

type Notice = { text: string; undo?: () => void } | null;
type ContextValue = {
  state: MobileVillage;
  ready: boolean;
  loadError: boolean;
  busy: boolean;
  saveError: boolean;
  notice: Notice;
  tell: (text: string, undo?: () => void) => void;
  dismiss: () => void;
  retry: () => Promise<void>;
  select: (slug: string, selected: boolean) => void;
  progress: (slug: string, value: SupportProgress) => void;
  welcome: () => void;
  person: (label: string, category: string) => Promise<boolean>;
  removePerson: (id: string) => void;
  task: (title: string, category: string) => Promise<boolean>;
  complete: (id: string, done: boolean) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  remind: (id: string, date?: Date) => Promise<void>;
  clear: () => Promise<boolean>;
};
const Context = createContext<ContextValue | null>(null);
export function VillageProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(emptyState);
  const current = useRef(state);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  const clearing = useRef(false);
  const [notice, setNotice] = useState<Notice>(null);
  useEffect(() => {
    if (!notice || notice.undo || saveError) return;
    const timer = setTimeout(() => setNotice(null), 8000);
    return () => clearTimeout(timer);
  }, [notice, saveError]);
  const tell = useCallback(
    (text: string, undo?: () => void) => setNotice({ text, undo }),
    [],
  );
  const load = useCallback(async () => {
    try {
      let saved = decodeState(await persistence.read(), slugs);
      try {
        const restored = await restoreReminders(saved);
        if (restored !== saved) {
          saved = restored;
          await persistence.write(JSON.stringify(saved));
        }
      } catch {
        tell(
          "Your village is open, but reminders could not be checked. Check them in My plan before relying on a nudge.",
        );
      }
      current.current = saved;
      setState(saved);
      setLoadError(false);
      setReady(true);
    } catch {
      setLoadError(true);
      tell(
        "Your saved village could not be opened. Try again; your saved copy has not been overwritten.",
      );
    }
  }, [tell]);
  // This hydrates an external asynchronous store; the state change happens after its read completes.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);
  async function update(change: (value: MobileVillage) => MobileVillage) {
    if (!ready || clearing.current) return false;
    try {
      const next = change(current.current);
      current.current = next;
      setState(next);
      await persistence.write(JSON.stringify(next));
      setSaveError(false);
      return true;
    } catch (error) {
      setSaveError(true);
      tell(
        error instanceof Error
          ? `${error.message} Changes may only be available until you close the app.`
          : "Could not save on this device. Keep the app open and try saving again.",
      );
      return false;
    }
  }
  async function exclusive(action: () => Promise<void>) {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    try {
      await action();
    } catch (error) {
      tell(
        error instanceof Error
          ? error.message
          : "That did not finish. Please try again.",
      );
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  const value: ContextValue = {
    state,
    ready,
    loadError,
    busy,
    saveError,
    notice,
    tell,
    dismiss: () => setNotice(null),
    retry: async () => {
      if (!ready) await load();
      else await update((value) => value);
    },
    welcome: () => {
      void update((value) => ({ ...value, welcomed: true }));
    },
    select: (slug, selected) => {
      const previous = current.current.village.progress[slug];
      void update((value) => selectSupport(value, slug, selected, slugs)).then(
        (ok) => {
          if (ok)
            tell(
              selected
                ? "Added to your village."
                : "Removed from your village. Your next steps stay in My plan.",
              selected
                ? undefined
                : () => {
                    void update((value) =>
                      progressSupport(
                        selectSupport(value, slug, true, slugs),
                        slug,
                        previous || "exploring",
                      ),
                    );
                    setNotice(null);
                  },
            );
        },
      );
    },
    progress: (slug, progress) => {
      void update((value) => progressSupport(value, slug, progress)).then(
        (ok) => {
          if (ok) tell("Your progress is updated.");
        },
      );
    },
    person: async (label, category) => {
      try {
        const person = { id: randomUUID(), label, category };
        addPerson(current.current, person, slugs);
        if (await update((value) => addPerson(value, person, slugs)))
          tell("Added to your circle of support.");
        return current.current.people.some((p) => p.id === person.id);
      } catch (error) {
        tell((error as Error).message);
        return false;
      }
    },
    removePerson: (id) => {
      const person = current.current.people.find((p) => p.id === id);
      void update((value) => ({
        ...value,
        people: value.people.filter((p) => p.id !== id),
      })).then((ok) => {
        if (ok && person)
          tell("Support removed.", () => {
            void update((value) => addPerson(value, person, slugs));
            setNotice(null);
          });
      });
    },
    task: async (title, category) => {
      try {
        const task = { id: randomUUID(), title, category };
        addTask(current.current, task, slugs);
        if (await update((value) => addTask(value, task, slugs)))
          tell("Added to your plan.");
        return current.current.tasks.some((t) => t.id === task.id);
      } catch (error) {
        tell((error as Error).message);
        return false;
      }
    },
    complete: (id, done) =>
      exclusive(async () => {
        await cancelReminder(
          current.current.tasks.find((t) => t.id === id)?.notificationId,
        );
        if (await update((value) => finishTask(value, id, done)))
          tell(done ? "One small step, done." : "Back in your next steps.");
      }),
    removeTask: (id) =>
      exclusive(async () => {
        const task = current.current.tasks.find((t) => t.id === id);
        if (!task) return;
        await cancelReminder(task.notificationId);
        if (
          await update((value) => ({
            ...value,
            tasks: value.tasks.filter((t) => t.id !== id),
          }))
        )
          tell("Step removed. Undo restores it without its reminder.", () => {
            const rest = {
              id: task.id,
              title: task.title,
              category: task.category,
              done: task.done,
            };
            void update((value) =>
              value.tasks.length < 25
                ? { ...value, tasks: [...value.tasks, rest] }
                : value,
            );
            setNotice(null);
          });
      }),
    remind: (id, date) =>
      exclusive(async () => {
        const task = current.current.tasks.find((t) => t.id === id);
        if (!task || task.done) return;
        if (!date) {
          await cancelReminder(task.notificationId);
          await update((value) => ({
            ...value,
            tasks: value.tasks.map((t) =>
              t.id === id
                ? { ...t, notificationId: undefined, reminderAt: undefined }
                : t,
            ),
          }));
          return;
        }
        if (date.getTime() <= Date.now()) {
          tell("Choose a time in the future.");
          return;
        }
        const notificationId = await scheduleReminder(id, date);
        try {
          await cancelReminder(task.notificationId);
        } catch {
          await cancelReminder(notificationId);
          throw new Error("Could not replace the old reminder. Try again.");
        }
        const ok = await update((value) => ({
          ...value,
          tasks: value.tasks.map((t) =>
            t.id === id && !t.done
              ? { ...t, notificationId, reminderAt: date.getTime() }
              : t,
          ),
        }));
        if (!ok) {
          await cancelReminder(notificationId);
          current.current = {
            ...current.current,
            tasks: current.current.tasks.map((t) =>
              t.id === id
                ? { ...t, notificationId: undefined, reminderAt: undefined }
                : t,
            ),
          };
          setState(current.current);
        } else tell("Reminder set. Your phone will give you a gentle nudge.");
      }),
    clear: async () => {
      if (lock.current) return false;
      lock.current = true;
      clearing.current = true;
      setBusy(true);
      try {
        await cancelAllReminders();
        await persistence.clear();
        const fresh = { ...emptyState(), welcomed: true };
        current.current = fresh;
        setState(fresh);
        setReady(true);
        setLoadError(false);
        setSaveError(false);
        setNotice(null);
        return true;
      } catch {
        tell("Could not clear everything from this device. Please try again.");
        return false;
      } finally {
        lock.current = false;
        clearing.current = false;
        setBusy(false);
      }
    },
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useVillage() {
  const value = useContext(Context);
  if (!value) throw new Error("VillageProvider is missing");
  return value;
}
export function taskDate(task: Task) {
  return task.reminderAt
    ? new Date(task.reminderAt).toLocaleString("en-AU", {
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "2-digit",
      })
    : "";
}
