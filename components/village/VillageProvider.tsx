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
  setVillageProgress,
  VILLAGE_STORAGE_KEY,
  VILLAGE_DEVICE_STORAGE_KEY,
  deviceVillage,
  readDeviceVillage,
  type VillageDraft,
  type SupportProgress,
} from "@/lib/village";

type VillageContextValue = {
  draft: VillageDraft;
  setDraft: Dispatch<SetStateAction<VillageDraft>>;
  ready: boolean;
  storageAvailable: boolean;
  remembered: boolean;
  storageMessage: string;
  remember: (enabled: boolean) => boolean;
  setNeed: (slug: string, selected: boolean) => void;
  setProgress: (slug: string, status: SupportProgress) => void;
  clear: () => boolean;
  restore: (draft: VillageDraft, rememberOnDevice?: boolean) => void;
  message: string;
  catalogue: { filter: string; query: string };
  setCatalogue: Dispatch<SetStateAction<{ filter: string; query: string }>>;
};
const VillageContext = createContext<VillageContextValue | null>(null);
const slugs = services.map((service) => service.slug);
const stages = stageOptions.map((stage) => stage.value);
export function VillageProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState(emptyVillage);
  const [ready, setReady] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [message, setMessage] = useState("");
  const [remembered, setRemembered] = useState(false);
  const [storageMessage, setStorageMessage] = useState("");
  // Keep browsing context across page changes, without storing searches or sending them.
  const [catalogue, setCatalogue] = useState({ filter: "all", query: "" });
  useEffect(() => {
    try {
      setDraft(
        readVillage(
          sessionStorage.getItem(VILLAGE_STORAGE_KEY),
          slugs,
          stages,
        ),
      );
    } catch {
      setStorageAvailable(false);
    }
    try {
      const saved = readDeviceVillage(localStorage.getItem(VILLAGE_DEVICE_STORAGE_KEY), slugs);
      if (saved) {
        setDraft(saved);
        setRemembered(true);
      }
    } catch {
      // Session-only browsing still works when device storage is blocked.
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
    if (remembered) {
      try {
        localStorage.setItem(VILLAGE_DEVICE_STORAGE_KEY, JSON.stringify(deviceVillage(draft)));
      } catch {
        setStorageMessage("We couldn’t update the copy on this device. Keep a downloaded copy of your latest choices.");
      }
    }
  }, [draft, ready, remembered]);
  useEffect(() => {
    function sync(event: StorageEvent) {
      if (event.key !== VILLAGE_DEVICE_STORAGE_KEY && event.key !== null) return;
      if (!event.newValue) {
        setRemembered(false);
        return;
      }
      const saved = readDeviceVillage(event.newValue, slugs);
      if (saved) {
        setDraft(saved);
        setRemembered(true);
      }
    }
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  function remember(enabled: boolean) {
    try {
      if (enabled) {
        const safeDraft = readVillage(JSON.stringify(draft), slugs, stages);
        localStorage.setItem(VILLAGE_DEVICE_STORAGE_KEY, JSON.stringify(deviceVillage(safeDraft)));
      } else localStorage.removeItem(VILLAGE_DEVICE_STORAGE_KEY);
      setRemembered(enabled);
      setStorageMessage(enabled
        ? "Your choices and progress will be here when you return on this device."
        : "The saved copy on this device has been removed. Your choices stay in this tab.");
      return true;
    } catch {
      setStorageMessage(enabled
        ? "This browser couldn’t save your village for later. You can still download a copy."
        : "We couldn’t remove the saved copy. Clear this site’s data in your browser settings to remove it.");
      return false;
    }
  }
  function setNeed(slug: string, selected: boolean) {
    const service = services.find((s) => s.slug === slug);
    if (!service) return;
    setDraft((prev) => setVillageNeed(prev, slug, selected));
    setMessage(
      `${service.title} ${selected ? "added to" : "removed from"} your village.`,
    );
  }
  function clear() {
    if (remembered && !remember(false)) return false;
    setDraft(emptyVillage());
    setStorageMessage("");
    setMessage("Your village has been cleared.");
    return true;
  }
  function setProgress(slug: string, status: SupportProgress) {
    setDraft((previous) => setVillageProgress(previous, slug, status));
    setMessage("Your progress has been updated.");
  }
  function restore(previous: VillageDraft, rememberOnDevice?: boolean) {
    if (rememberOnDevice) {
      try {
        localStorage.setItem(VILLAGE_DEVICE_STORAGE_KEY, JSON.stringify(deviceVillage(previous)));
        setRemembered(true);
        setStorageMessage("Your saved village has been restored on this device.");
      } catch {
        setStorageMessage("Your choices are restored in this tab, but couldn’t be saved on this device.");
      }
    }
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
        remembered,
        storageMessage,
        remember,
        setNeed,
        setProgress,
        clear,
        restore,
        message,
        catalogue,
        setCatalogue,
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
