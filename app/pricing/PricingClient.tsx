"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export default function PricingClient() {
  useEffect(() => {
    trackEvent("pricing_viewed");
  }, []);
  return null;
}
