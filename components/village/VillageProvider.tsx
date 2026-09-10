"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";
import { services } from "@/content/services";
import { stageOptions } from "@/lib/assessment";
import {
  emptyVillage,
  readVillage,
  setVillageNeed,
  VILLAGE_STORAGE_KEY,
  type VillageDraft,
} from "@/lib/village";

type VillageContextValue = {
  draft: VillageDraft;
  setDraft: Dispatch<SetStateAction<VillageDraft>>;
  ready: boolean;
  storageAvailable: boolean;
  setNeed: (slug: string, selected: boolean) => void;
  clear: () => void;
  restore: (draft: VillageDraft) => void;
  message: string;
};
const VillageContext = createContext<VillageContextValue | null>(null);
export function VillageProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState(emptyVillage);
  const [ready, setReady] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [message, setMessage] = useState("");
  useEffect(() => {
    try {
      setDraft(
        readVillage(
          sessionStorage.getItem(VILLAGE_STORAGE_KEY),
          services.map((s) => s.slug),
          stageOptions.map((s) => s.value),
        ),
      );
    } catch {
      setStorageAvailable(false);
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      if (!draft.needs.length && !draft.stage && !draft.timing)
        sessionStorage.removeItem(VILLAGE_STORAGE_KEY);
      else sessionStorage.setItem(VILLAGE_STORAGE_KEY, JSON.stringify(draft));
    } catch {
      setStorageAvailable(false);
    }
  }, [draft, ready]);
  function setNeed(slug: string, selected: boolean) {
    const service = services.find((s) => s.slug === slug);
    if (!service) return;
    setDraft((prev) => setVillageNeed(prev, slug, selected));
    setMessage(
      `${service.title} ${selected ? "added to" : "removed from"} your village.`,
    );
  }
  function clear() {
    setDraft(emptyVillage());
    setMessage("Your village has been cleared.");
  }
  function restore(previous: VillageDraft) {
    setDraft(previous);
    setMessage("Your village has been restored.");
  }
  return (
    <VillageContext.Provider
      value={{
        draft,
        setDraft,
        ready,
        storageAvailable,
        setNeed,
        clear,
        restore,
        message,
      }}
    >
      {children}
      <div role="status" aria-live="polite" className="sr-only">
        {message}
      </div>
    </VillageContext.Provider>
  );
}
export function useVillage() {
  const context = useContext(VillageContext);
  if (!context) throw new Error("useVillage needs VillageProvider");
  return context;
}
