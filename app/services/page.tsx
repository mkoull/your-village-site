"use client";
import { useRef } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import ArrowUpRight from "@/components/ui/ArrowUpRight";
import AddToVillage from "@/components/village/AddToVillage";
import { useVillage } from "@/components/village/VillageProvider";
import { existingSupport } from "@/content/existing-support";
import { services } from "@/content/services";

const categories = [
  ["all", "All support"],
  ["practical", "Practical"],
  ["specialist", "Specialist"],
  ["emotional", "Wellbeing"],
  ["community", "Community"],
];
export default function ServicesPage() {
  const {
    draft,
    catalogue: { filter, query },
    setCatalogue,
  } = useVillage();
  const searchInput = useRef<HTMLInputElement>(null);
  function resetSearch() {
    setCatalogue({ filter: "all", query: "" });
    searchInput.current?.focus();
  }
  const filtered = services.filter(
    (service) =>
      (filter === "all" || service.category === filter) &&
      [
        service.title,
        service.tagline,
        service.description,
        service.need,
        ...service.features,
        ...existingSupport
          .filter((source) => source.serviceSlug === service.slug)
          .map((source) => `${source.name} ${source.description}`),
      ]
        .join(" ")
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  return (
    <div className="catalogue-page pt-28 md:pt-36">
      <Container>
        <header className="catalogue-header">
          <div>
            <p className="text-eyebrow uppercase tracking-[.2em] font-semibold text-text-sage mb-4">
              Explore services
            </p>
            <h1 className="text-h1 font-heading">
              Find the support
              <br />
              <em className="text-text-sage">that fits your life.</em>
            </h1>
          </div>
          <div className="max-w-sm">
            <p className="text-text-muted mb-5">
              Find a starting point for what you need. Read a little more, save
              what helps, and contact services when you’re ready.
            </p>
            <Link
              href="/my-village"
              className="text-sm text-text-sage underline underline-offset-4"
            >
              {draft.needs.length
                ? `My village · ${draft.needs.length} saved`
                : "Open my village"}{" "}
              <ArrowUpRight />
            </Link>
          </div>
        </header>
        <div className="catalogue-tools">
          <div className="catalogue-search">
            <label htmlFor="service-search">
              What would make life lighter?
            </label>
            <div className="catalogue-search-input">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
              >
                <circle cx="10.5" cy="10.5" r="6.5" />
                <path d="m16 16 4 4" />
              </svg>
              <input
                id="service-search"
                ref={searchInput}
                className="form-field"
                type="search"
                maxLength={80}
                placeholder="Try meals, sleep or someone to talk to"
                value={query}
                onChange={(e) =>
                  setCatalogue((previous) => ({
                    ...previous,
                    query: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div
            className="builder-options"
            role="group"
            aria-label="Filter services"
          >
            {categories.map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={filter === value}
                onClick={() =>
                  setCatalogue((previous) => ({ ...previous, filter: value }))
                }
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="catalogue-results-summary">
          <p role="status" className="text-xs text-text-muted break-words">
            {filtered.length} {filtered.length === 1 ? "kind" : "kinds"} of
            support{query ? ` for “${query}”` : ""}
          </p>
          {(filter !== "all" || query) && (
            <button
              type="button"
              onClick={resetSearch}
              className="text-sm text-text-sage underline underline-offset-4"
            >
              Clear search and filters
            </button>
          )}
        </div>
        <div className="catalogue-grid">
          {filtered.map((service) => (
            <article
              key={service.slug}
              data-saved={draft.needs.includes(service.slug)}
              className={`catalogue-card village-tone-${service.tone}`}
            >
              <div className="catalogue-card-topline">
                <span>
                  {
                    categories.find(
                      ([value]) => value === service.category,
                    )?.[1]
                  }
                </span>
                {draft.needs.includes(service.slug) && (
                  <span className="catalogue-saved-label">
                    <span aria-hidden="true">✓</span> In your village
                  </span>
                )}
              </div>
              <div className="flex gap-4 items-start mb-5">
                <span
                  className="plan-icon"
                  aria-hidden="true"
                  dangerouslySetInnerHTML={{ __html: service.icon }}
                />
                <div>
                  <h2 className="font-heading text-2xl">
                    <Link href={`/services/${service.slug}`}>
                      {service.title}
                    </Link>
                  </h2>
                  <p className="text-xs text-text-sage mt-2">
                    {service.tagline}
                  </p>
                </div>
              </div>
              <p className="text-sm text-text-muted leading-relaxed mb-7">
                {service.description}
              </p>
              <p className="catalogue-source-preview">
                <span>A place to start</span>
                {
                  existingSupport.find(
                    (source) => source.serviceSlug === service.slug,
                  )?.name
                }
              </p>
              <div className="catalogue-card-actions">
                <AddToVillage slug={service.slug} compact />
                <Link
                  href={`/services/${service.slug}`}
                  className="text-sm underline underline-offset-4 text-text-sage"
                >
                  Explore options{" "}
                  <span className="sr-only">{service.title}</span>{" "}
                  <ArrowUpRight />
                </Link>
              </div>
            </article>
          ))}
        </div>
        {filtered.length > 0 && (
          <p className="catalogue-trust-note">
            These are independent starting points, not Village partners. Check
            coverage, availability and costs directly with each service.
          </p>
        )}
        {!filtered.length && (
          <div className="text-center border border-border rounded-2xl p-10 my-6">
            <h2 className="font-heading text-3xl mb-4">
              Let&apos;s try a wider search.
            </h2>
            <p className="text-sm text-text-muted mb-6">
              There isn&apos;t a match for those filters. You can browse all
              eight kinds of support.
            </p>
            <Button onClick={resetSearch}>Show all support</Button>
          </div>
        )}
        <div className="catalogue-outro">
          <div>
            <h2 className="font-heading text-3xl mb-3">
              It can start with just one thing.
            </h2>
            <p className="text-sm text-text-muted">
              Add what helps as you explore. My village brings your choices and
              next steps together, ready when you need them.
            </p>
          </div>
          <Button href={draft.needs.length ? "/my-village" : "/get-started"}>
            {draft.needs.length ? "See my saved support" : "Choose my support"}{" "}
            <span aria-hidden="true">→</span>
          </Button>
        </div>
      </Container>
    </div>
  );
}
