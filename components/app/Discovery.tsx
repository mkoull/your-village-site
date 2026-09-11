"use client";
import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { services } from "@/content/services";
import { useVillage } from "@/components/village/VillageProvider";
import VillageMark from "@/components/ui/VillageMark";
import ArrowUpRight from "@/components/ui/ArrowUpRight";
import {
  filterProviders,
  isOpenRequest,
  needsAction,
} from "@/lib/app-experience";
import { appApi, useApp, useAppData } from "./AppContext";
import {
  AppIcon,
  Empty,
  ErrorBox,
  Heading,
  Loading,
  ProviderCard,
  RequestRow,
  ServiceIcon,
  SignInPrompt,
} from "./AppUI";
import type { AppUser, Listing, SupportRequest } from "@/lib/app-types";
import { useSupportBrowser } from "./SupportContext";

function useDirectory() {
  const { savedProviders, savedLoading, savedError, reloadSaved } = useApp();
  const directory = useAppData<{ providers: Listing[] }>("providers");
  return {
    directory,
    saved: {
      data: { providers: savedProviders },
      loading: savedLoading,
      error: savedError,
      reload: reloadSaved,
    },
  };
}
function VillageOrbit({ lit }: { lit: string[] }) {
  const browser = useSupportBrowser();
  return (
    <div className="va-orbit" aria-label="Explore support around your village">
      <div className="va-orbit-ring" />
      <div className="va-orbit-centre">
        <VillageMark />
        <strong>You</strong>
        <small>at the heart of it</small>
      </div>
      {services.map((service, i) => (
        <button
          key={service.slug}
          onClick={() => browser.openCategory(service.slug)}
          aria-haspopup="dialog"
          className={`va-orbit-node ${lit.includes(service.slug) ? "is-lit" : ""} ${browser.selection?.category === service.slug ? "is-exploring" : ""}`}
          style={
            {
              "--x": `${50 + 39 * Math.cos((i * Math.PI) / 4 - Math.PI / 2)}%`,
              "--y": `${50 + 39 * Math.sin((i * Math.PI) / 4 - Math.PI / 2)}%`,
            } as CSSProperties
          }
          aria-label={`Explore ${service.shortTitle.toLowerCase()}`}
        >
          <ServiceIcon slug={service.slug} />
          <span>{service.shortTitle}</span>
        </button>
      ))}
    </div>
  );
}
export function AppHome() {
  const browser = useSupportBrowser();
  const { user, mode, setSession, refresh } = useApp();
  const router = useRouter();
  const { directory, saved } = useDirectory();
  const requests = useAppData<{ requests: SupportRequest[] }>(
    "requests",
    user?.role === "family",
  );
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const offers =
    requests.data?.requests.filter((r) => needsAction(r, "family")) || [];
  const lit = [...new Set(saved.data.providers.map((p) => p.category))];
  const openCount = requests.data?.requests.filter(isOpenRequest).length;
  async function tryPreview() {
    setBusy(true);
    try {
      const result = await appApi<{ user: AppUser; mode: "preview" }>(
        "preview",
        { role: "family" },
      );
      setSession(result);
      refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  useEffect(() => {
    if (user?.role === "provider") router.replace("/app/partner");
    if (user?.role === "owner") router.replace("/app/owner");
  }, [user?.role, router]);
  return (
    <>
      {user?.role === "family" && offers.length > 0 && (
        <Link href={`/app/requests/${offers[0].id}`} className="va-next-up">
          <AppIcon name="inbox" />
          <span>
            <strong>A little progress in your village</strong>
            <small>
              {offers[0].providerName} ·{" "}
              {offers[0].unreadCount
                ? "New update to read"
                : "Your next step is ready"}
            </small>
          </span>
          <AppIcon name="arrow" />
        </Link>
      )}
      <section className="va-welcome">
        <div>
          <p className="va-eyebrow">
            {user
              ? `WELCOME TO YOUR VILLAGE, ${user.name.split(" ")[0]}`
              : "A LITTLE HELP, ALL AROUND YOU"}
          </p>
          <h1>
            A little support.
            <br />
            <em>
              A lot more room
              <br className="va-desktop-break" /> to breathe.
            </em>
          </h1>
          <p>
            Meals sorted. A lighter home. An extra pair of hands. Bring together
            the support that feels right for you.
          </p>
          <div className="va-actions">
            {!user && mode === "preview" ? (
              <button
                className="va-button"
                disabled={busy}
                onClick={tryPreview}
              >
                {busy ? "Opening your village…" : "Try the family app"}
                <AppIcon name="arrow" size={18} />
              </button>
            ) : (
              <Link className="va-button" href="/app/explore">
                Find your support
                <AppIcon name="arrow" size={18} />
              </Link>
            )}
            <Link
              className="va-text-link"
              href={user ? "/app/saved" : "/app/explore"}
            >
              {user ? "See my village" : "Have a look around"} <ArrowUpRight />
            </Link>
          </div>
          {error && <ErrorBox message={error} />}
        </div>
        <div className="va-welcome-scene">
          <span className="va-scene-eyebrow">
            YOUR WORLD, WITH A LITTLE MORE HELP
          </span>
          <VillageOrbit lit={lit} />
          <p>
            {lit.length
              ? "Saved support glows. Tap a circle to explore."
              : "Tap a circle. A little support opens up."}
          </p>
        </div>
      </section>
      {user && requests.error && (
        <ErrorBox message={requests.error} retry={requests.reload} />
      )}{" "}
      {user && saved.error && (
        <ErrorBox message={saved.error} retry={saved.reload} />
      )}{" "}
      {user && (
        <div className="va-stats">
          <Link href="/app/saved">
            <strong>{saved.data?.providers.length ?? "—"}</strong>
            <span>
              {saved.data.providers.length === 1 ? "provider" : "providers"} in
              your village
            </span>
            <AppIcon name="heart" />
          </Link>
          <Link href="/app/requests?filter=active">
            <strong>{openCount ?? "—"}</strong>
            <span>{openCount === 1 ? "request" : "requests"} in progress</span>
            <AppIcon name="inbox" />
          </Link>
          <Link href="/app/requests?filter=attention">
            <strong>{offers.length}</strong>
            <span>
              {offers.length === 1 ? "conversation" : "conversations"} needing
              you
            </span>
            <AppIcon name="arrow" />
          </Link>
        </div>
      )}
      {offers.length > 0 && (
        <section className="va-section">
          <div className="va-section-title">
            <div>
              <p className="va-eyebrow">A LITTLE PROGRESS</p>
              <h2>Your next step is here.</h2>
            </div>
            <Link href="/app/requests">
              View requests <ArrowUpRight />
            </Link>
          </div>
          {offers.slice(0, 2).map((request) => (
            <RequestRow key={request.id} request={request} />
          ))}
        </section>
      )}
      <section className="va-section">
        <div className="va-section-title">
          <div>
            <p className="va-eyebrow">START WITH WHAT WOULD HELP</p>
            <h2>Make the everyday a little lighter.</h2>
          </div>
          <Link href="/app/explore">
            Explore all support <ArrowUpRight />
          </Link>
        </div>
        <div className="va-need-grid">
          {services.slice(0, 8).map((service) => (
            <button
              onClick={() => browser.openCategory(service.slug)}
              aria-haspopup="dialog"
              key={service.slug}
            >
              <span className={`va-need-icon village-tone-${service.tone}`}>
                <ServiceIcon slug={service.slug} />
              </span>
              <span>{service.shortTitle}</span>
              <AppIcon name="arrow" size={16} />
            </button>
          ))}
        </div>
      </section>
      <section className="va-section">
        <div className="va-section-title">
          <div>
            <p className="va-eyebrow">
              {mode === "preview"
                ? "MEET THE EXAMPLE PROVIDERS"
                : "MEET YOUR LOCAL SUPPORT"}
            </p>
            <h2>Good help starts with a hello.</h2>
          </div>
          <Link href="/app/explore">
            Meet everyone <ArrowUpRight />
          </Link>
        </div>
        {directory.error ? (
          <ErrorBox message={directory.error} retry={directory.reload} />
        ) : directory.loading ? (
          <Loading />
        ) : (
          <div className="va-provider-grid">
            {directory.data?.providers.slice(0, 3).map((provider) => (
              <ProviderCard key={provider.id} provider={provider} from="/app" />
            ))}
          </div>
        )}
      </section>
      <div className="va-gentle-note">
        <AppIcon name="leaf" size={30} />
        <div>
          <h2>Your village can start small.</h2>
          <p>
            One meal. One helpful conversation. One thing off your list. Start
            wherever you are.
          </p>
        </div>
      </div>
    </>
  );
}
export function Explore() {
  const { directory, saved } = useDirectory();
  const params = useSearchParams(),
    router = useRouter();
  const category = services.some((s) => s.slug === params.get("category"))
    ? params.get("category") || ""
    : "";
  const query = params.get("q") || "",
    suburb = params.get("area") || "";
  const [search, setSearch] = useState(query);
  useEffect(() => setSearch(query), [query]);
  const providers = directory.data?.providers || [];
  const suburbs = [
    ...new Set(
      providers.flatMap((p) => p.suburbs).filter((s) => s !== "Online"),
    ),
  ].sort();
  const filtered = filterProviders(providers, category, suburb, query);
  const from =
    "/app/explore" + (params.toString() ? "?" + params.toString() : "");
  function update(changes: { category?: string; area?: string; q?: string }) {
    const next = new URLSearchParams();
    const values = { category, area: suburb, q: search.trim(), ...changes };
    Object.entries(values).forEach(([key, value]) => {
      if (value) next.set(key, value);
    });
    router.replace("/app/explore" + (next.size ? "?" + next : ""), {
      scroll: false,
    });
  }
  function reset() {
    setSearch("");
    router.replace("/app/explore", { scroll: false });
  }
  return (
    <>
      <Heading eyebrow="FIND YOUR PEOPLE" title="What would help you today?">
        Start with what would make life easier. Find support by need, provider
        or area.
      </Heading>
      <form
        className="va-search-panel"
        onSubmit={(event) => {
          event.preventDefault();
          update({ q: search.trim() });
        }}
      >
        <label className="va-search">
          <AppIcon name="search" />
          <span className="sr-only">Search providers</span>
          <input
            type="search"
            maxLength={100}
            placeholder="Try meals, a nanny or cleaning…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <label className="va-suburb">
          <AppIcon name="pin" />
          <span className="sr-only">Filter by suburb</span>
          <select
            value={suburb}
            onChange={(e) => update({ area: e.target.value })}
          >
            <option value="">All areas</option>
            {suburb && !suburbs.includes(suburb) && <option>{suburb}</option>}
            {suburbs.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <button type="submit" className="va-search-submit">
          Search
          <AppIcon name="arrow" size={18} />
        </button>
      </form>
      <div className="va-filter-chips" aria-label="Support categories">
        <button
          aria-pressed={!category}
          onClick={() => update({ category: "" })}
        >
          All support
        </button>
        {services.map((s) => (
          <button
            key={s.slug}
            aria-pressed={category === s.slug}
            onClick={() => update({ category: s.slug })}
          >
            <ServiceIcon slug={s.slug} />
            {s.shortTitle}
          </button>
        ))}
      </div>
      {saved.error && <ErrorBox message={saved.error} retry={saved.reload} />}
      {directory.error ? (
        <ErrorBox message={directory.error} retry={directory.reload} />
      ) : directory.loading ? (
        <Loading />
      ) : (
        <>
          <div className="va-results-line">
            <p role="status">
              {filtered.length}{" "}
              {filtered.length === 1 ? "provider" : "providers"}
              {query && " for “" + query + "”"}
              {suburb && " covering " + suburb}
            </p>
            {(category || suburb || query) && (
              <button className="va-text-button" onClick={reset}>
                Clear filters
              </button>
            )}
          </div>
          {filtered.length ? (
            <div className="va-provider-grid">
              {filtered.map((provider) => (
                <ProviderCard
                  key={provider.id}
                  provider={provider}
                  from={from}
                />
              ))}
            </div>
          ) : (
            <>
              <Empty
                title="Let’s widen the search."
                href={category ? "/services/" + category : "/services"}
                action="Explore existing support"
              >
                No providers match these choices yet. Try another category or
                area, or explore the independent services linked from our
                website.
              </Empty>
              <button className="va-button va-button-secondary" onClick={reset}>
                Show all providers
              </button>
            </>
          )}
        </>
      )}
      <div className="va-directory-note">
        <AppIcon name="leaf" />
        <p>
          Online support is included in every area. Check suitability,
          qualifications and arrangements with the provider before proceeding.
        </p>
      </div>
    </>
  );
}
export function SavedProviders() {
  const browser = useSupportBrowser();
  const { user } = useApp(),
    { saved } = useDirectory();
  const { draft } = useVillage();
  return (
    <>
      <Heading
        eyebrow="YOUR PEOPLE, TOGETHER"
        title="Your village, taking shape."
      >
        A little collection of support you can come back to, whenever you need
        it.
      </Heading>
      {!user ? (
        <SignInPrompt />
      ) : user.role !== "family" ? (
        <Empty
          title="This space is for families."
          href="/app"
          action="Go to your workspace"
        >
          Use your family account to keep your own village.
        </Empty>
      ) : saved.loading ? (
        <Loading />
      ) : saved.error ? (
        <ErrorBox message={saved.error} retry={saved.reload} />
      ) : saved.data?.providers.length ? (
        <div className="va-provider-grid">
          {saved.data.providers.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              from="/app/saved"
            />
          ))}
        </div>
      ) : (
        <Empty title="Your first bit of support is out there.">
          Tap the heart on a provider to add them here. Saving is a shortlist,
          with no commitment.
        </Empty>
      )}
      {draft.needs.length > 0 && (
        <section className="va-section va-panel">
          <p className="va-eyebrow">FROM YOUR WEBSITE VILLAGE</p>
          <h2>Keep exploring your choices.</h2>
          <p>
            Your earlier support choices are still here. Find a provider for
            each, at your own pace.
          </p>
          <div className="va-filter-chips">
            {draft.needs.map((slug) => (
              <button
                key={slug}
                onClick={() => browser.openCategory(slug)}
                aria-haspopup="dialog"
              >
                <ServiceIcon slug={slug} />
                {services.find((s) => s.slug === slug)?.shortTitle}
              </button>
            ))}
          </div>
          <Link className="va-text-link" href="/my-village">
            View your original support plan <ArrowUpRight />
          </Link>
        </section>
      )}
    </>
  );
}
export { ProviderProfile } from "./ProviderDetails";
