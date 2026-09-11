"use client";
import { createContext, useContext } from "react";

export type SupportSelection = {
  category: string | null;
  providerId: string | null;
  from: string;
  requesting: boolean;
};
export type RequestDraft = { suburb: string; timing: string; message: string };
export const SupportContext = createContext<{
  selection: SupportSelection | null;
  openCategory: (slug: string) => void;
  openProvider: (id: string, from: string) => void;
  request: () => void;
  details: () => void;
  back: () => void;
  close: () => void;
  leave: (url: string) => void;
  drafts: Record<string, RequestDraft>;
  setDraft: (id: string, draft: RequestDraft | null) => void;
} | null>(null);

export function useSupportBrowser() {
  const context = useContext(SupportContext);
  if (!context) throw new Error("Support browser needs its app context");
  return context;
}
