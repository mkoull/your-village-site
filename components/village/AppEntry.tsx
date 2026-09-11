"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
export default function AppEntry() {
  const [mode, setMode] = useState("");
  useEffect(() => { const controller = new AbortController(); fetch("/api/village/session", { cache: "no-store", signal: controller.signal }).then(response => response.ok ? response.json() : null).then(data => { if (data?.mode === "preview" || data?.mode === "pilot") setMode(data.mode); }).catch(() => {}); return () => controller.abort(); }, []);
  if (!mode) return null;
  return <aside className="village-app-entry"><div><strong>Your village has a new home.</strong><p>Save providers, request support and keep the conversation going.{mode === "preview" ? " Explore the local app preview with fictional providers." : ""}</p></div><Link href="/app">Open the Village app <span aria-hidden="true">→</span></Link></aside>;
}
