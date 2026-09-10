"use client";

import { Analytics } from "@vercel/analytics/react";
import { analyticsPageUrl } from "@/lib/analytics-url";

export default function SiteAnalytics() {
  return (
    <Analytics
      beforeSend={(event) => {
        const url = analyticsPageUrl(event.url);
        return url ? { ...event, url } : null;
      }}
    />
  );
}
