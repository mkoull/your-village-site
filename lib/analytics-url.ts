/** Keep legacy support/context query parameters out of page-view analytics. */
export function analyticsPageUrl(url: string): string | null {
  try {
    const page = new URL(url);
    if (page.pathname === "/app" || page.pathname.startsWith("/app/") || page.pathname.startsWith("/api/")) return null;
    page.search = "";
    page.hash = "";
    return page.toString();
  } catch {
    return null;
  }
}
