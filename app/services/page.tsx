"use client";
import { useState } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import AddToVillage from "@/components/village/AddToVillage";
import { services } from "@/content/services";

const categories = [
  ["all", "All support"],
  ["practical", "Practical"],
  ["specialist", "Specialist"],
  ["emotional", "Wellbeing"],
  ["community", "Community"],
];
export default function ServicesPage() {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const filtered = services.filter(
    (service) =>
      (filter === "all" || service.category === filter) &&
      [service.title, service.tagline, service.description, service.need]
        .join(" ")
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  return (
    <div className="pt-28 md:pt-36">
      <Container>
        <header className="catalogue-header">
          <div>
            <p className="text-eyebrow uppercase tracking-[.2em] font-semibold text-text-sage mb-4">
              The pieces of your village
            </p>
            <h1 className="text-h1 font-heading">
              Find a little
              <br />
              <em className="text-text-sage">breathing room.</em>
            </h1>
          </div>
          <div className="max-w-sm">
            <p className="text-text-muted mb-5">
              Explore the help that already exists. Add what feels useful to
              your village, then bring it all together.
            </p>
            <Link
              href="/get-started"
              className="text-sm text-text-sage underline underline-offset-4"
            >
              Open my village <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </header>
        <div className="catalogue-tools">
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
                onClick={() => setFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>
          <div>
            <label htmlFor="service-search" className="sr-only">
              Search support
            </label>
            <input
              id="service-search"
              className="form-field"
              type="search"
              maxLength={80}
              placeholder="Search support…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
        <p role="status" className="text-xs text-text-muted mb-6 break-words">
          {filtered.length} {filtered.length === 1 ? "kind" : "kinds"} of
          support{query ? ` for “${query}”` : ""}
        </p>
        <div className="catalogue-grid">
          {filtered.map((service) => (
            <article
              key={service.slug}
              className={`catalogue-card village-tone-${service.tone}`}
            >
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
              <div className="mt-auto flex flex-wrap items-center gap-4">
                <AddToVillage slug={service.slug} compact />
                <Link
                  href={`/services/${service.slug}`}
                  className="text-sm underline underline-offset-4 text-text-sage"
                >
                  Explore <span className="sr-only">{service.title}</span>{" "}
                  <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
        {!filtered.length && (
          <div className="text-center border border-border rounded-2xl p-10 my-6">
            <h2 className="font-heading text-3xl mb-4">
              Let&apos;s try a wider search.
            </h2>
            <p className="text-sm text-text-muted mb-6">
              There isn&apos;t a match for those filters. You can browse all
              eight kinds of support.
            </p>
            <Button
              onClick={() => {
                setFilter("all");
                setQuery("");
              }}
            >
              Show all support
            </Button>
          </div>
        )}
        <div className="catalogue-outro">
          <div>
            <h2 className="font-heading text-3xl mb-3">
              It can start with just one thing.
            </h2>
            <p className="text-sm text-text-muted">
              Your saved support stays with you as you explore. No contact
              details needed.
            </p>
          </div>
          <Button href="/get-started">
            Build my village <span aria-hidden="true">→</span>
          </Button>
        </div>
      </Container>
    </div>
  );
}
