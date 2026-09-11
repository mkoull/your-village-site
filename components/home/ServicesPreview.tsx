import Link from "next/link";
import Container from "@/components/ui/Container";
import { services } from "@/content/services";

export default function ServicesPreview() {
  return (
    <section id="explore-support" className="py-16 md:py-24 scroll-mt-24">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10">
          <div>
            <p className="village-step-eyebrow">Find your kind of support</p>
            <h2 className="text-h2 font-heading">
              What would help <em className="text-text-sage">today?</em>
            </h2>
          </div>
          <p className="text-sm text-text-muted max-w-xs">
            Open a category to see what it offers and a real service you can
            contact.
          </p>
        </div>
        <div className="support-doorways">
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="support-doorway"
            >
              <span
                className="plan-icon"
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: service.icon }}
              />
              <span>
                <span className="font-heading text-2xl block">
                  {service.need}
                </span>
                <span className="text-xs text-text-muted block mt-2">
                  {service.title}
                </span>
              </span>
              <span aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap justify-between gap-4 mt-8 text-sm">
          <p className="text-text-muted">
            One kind of help, or a few. It’s your village.
          </p>
          <Link
            href="/services"
            className="underline underline-offset-4 text-text-sage"
          >
            Browse all services →
          </Link>
        </div>
      </Container>
    </section>
  );
}
