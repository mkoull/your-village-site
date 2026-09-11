import Container from "@/components/ui/Container";
import Link from "next/link";
import { existingSupport } from "@/content/existing-support";
import ArrowUpRight from "@/components/ui/ArrowUpRight";

export default function ExistingSupportSection() {
  return (
    <section className="bg-surface py-16 md:py-20">
      <Container>
        <div className="grid md:grid-cols-2 gap-6 md:gap-16 mb-10">
          <div>
            <p className="text-eyebrow uppercase tracking-[0.2em] text-text-sage font-semibold mb-4">
              Good help is already out there
            </p>
            <h2 className="text-h2 font-heading">
              A few places
              <br />
              to <em className="text-text-sage">start.</em>
            </h2>
          </div>
          <p className="text-text-muted text-sm leading-relaxed self-end max-w-md">
            There are people doing wonderful things for families. Here are a few
            independent services you can explore today, while we build more
            connections through Village.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-10">
          {existingSupport.slice(0, 5).map((item) => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block py-6 border-t border-border"
            >
              <p className="text-[10px] uppercase tracking-[0.17em] font-semibold text-text-muted mb-3">
                {item.category}
              </p>
              <div className="flex justify-between gap-5 items-start mb-3">
                <h3 className="font-heading text-2xl group-hover:text-text-sage transition-colors">
                  {item.name}
                </h3>
                <ArrowUpRight
                  className="text-text-sage group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                />
              </div>
              <p className="text-sm text-text-muted max-w-sm">
                {item.description}
              </p>
              <span className="block text-xs text-text-sage mt-3">
                Explore service <ArrowUpRight />{" "}
                <span className="sr-only">(opens a new tab)</span>
              </span>
            </a>
          ))}
          <div className="py-6 border-t border-border">
            <p className="text-[10px] uppercase tracking-[0.17em] font-semibold text-text-muted mb-3">
              A growing network
            </p>
            <h3 className="font-heading text-2xl mb-3">
              More connections, together.
            </h3>
            <p className="text-sm text-text-muted mb-4">
              We&apos;re bringing more kinds of support into one place, with
              families and the people who help them at the centre.
            </p>
            <Link
              href="/about"
              className="text-sm text-text-sage underline underline-offset-4 decoration-sage/40"
            >
              See what we&apos;re building <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        <p className="text-xs text-text-muted mt-5 border-t border-border pt-5">
          These organisations are independent of Village. Check directly for
          availability, eligibility and costs.
        </p>
      </Container>
    </section>
  );
}
