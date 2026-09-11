import { services } from "../content/services.ts";
import type { AppRole, Listing, SupportRequest } from "./app-types.ts";

export const isOpenRequest = (request: SupportRequest) =>
  !["completed", "declined", "cancelled"].includes(request.status);

export function nextStep(request: SupportRequest, role: AppRole) {
  if (role === "owner")
    return request.status === "disputed"
      ? "Review this issue"
      : "View conversation";
  if (role === "provider") {
    if (request.status === "requested") return "Reply to this family";
    if (request.status === "offered") return "Waiting for the family";
    if (request.status === "confirmed") return "Prepare for this arrangement";
    if (request.status === "delivered") return "Waiting for confirmation";
  } else {
    if (request.status === "requested") return "Waiting for a provider reply";
    if (request.status === "offered") return "Review your offer";
    if (request.status === "confirmed") return "Your support is arranged";
    if (request.status === "delivered") return "Confirm your support";
  }
  if (request.status === "disputed") return "Village is reviewing this";
  return request.status === "completed" ? "Support received" : "Request closed";
}

export function needsAction(request: SupportRequest, role: AppRole) {
  return (
    (request.unreadCount || 0) > 0 ||
    (role === "family"
      ? ["offered", "delivered"].includes(request.status)
      : role === "provider"
        ? request.status === "requested"
        : request.status === "disputed")
  );
}

export function filterProviders(
  providers: Listing[],
  category: string,
  suburb: string,
  query: string,
) {
  const words = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  return providers.filter((provider) => {
    const service = services.find((s) => s.slug === provider.category);
    const searchable = [
      provider.name,
      provider.summary,
      provider.description,
      provider.mode,
      ...provider.included,
      ...provider.suburbs,
      service?.title,
      service?.shortTitle,
      service?.need,
      service?.description,
      ...(service?.features || []),
    ]
      .join(" ")
      .toLocaleLowerCase();
    return (
      (!category || provider.category === category) &&
      (!suburb ||
        provider.mode === "Online" ||
        provider.suburbs.includes(suburb)) &&
      words.every((word) => searchable.includes(word))
    );
  });
}

export function safeAppPath(value: string | null, fallback = "/app") {
  if (!value || /[\\\r\n]/.test(value)) return fallback;
  try {
    const url = new URL(value, "https://village.invalid");
    if (
      url.origin !== "https://village.invalid" ||
      !/^\/app(?:\/|$)/.test(url.pathname) ||
      url.pathname === "/app/sign-in"
    )
      return fallback;
    return url.pathname + url.search + url.hash;
  } catch {
    return fallback;
  }
}

export function supportReturnPath(value: string | null) {
  const path = safeAppPath(value, "/app/explore");
  return /^\/app\/(explore|saved|partner|owner)(\?|#|$)/.test(path) ||
    /^\/app\/requests(?:\/[a-z0-9-]+)?(\?|#|$)/.test(path)
    ? path
    : "/app/explore";
}

export function providerPath(id: string, from = "/app/explore") {
  return `/app/providers/${encodeURIComponent(id)}?from=${encodeURIComponent(supportReturnPath(from))}`;
}
