import AddToVillage from "@/components/village/AddToVillage";
import ServiceSources from "@/components/village/ServiceSources";
import { notFound } from "next/navigation";
import Link from "next/link";
import { services } from "@/content/services";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  return service
    ? {
        title: `${service.title} — Your Village`,
        description: service.description,
      }
    : { title: "Service not found" };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();
  const related = services
    .filter((item) => item.slug !== slug)
    .sort(
      (a, b) =>
        Number(b.category === service.category) -
        Number(a.category === service.category),
    )
    .slice(0, 3);
  return (
    <article className="service-page pt-28 md:pt-32 pb-20">
      <Container>
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex flex-wrap gap-2 text-sm text-text-muted">
            <li>
              <Link href="/services" className="underline underline-offset-4">
                Explore services
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">{service.title}</li>
          </ol>
        </nav>
        <header className="service-page-header">
          <span
            className="plan-icon mb-5"
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: service.icon }}
          />
          <h1 className="text-h1 font-heading mb-3">{service.title}</h1>
          <p className="font-heading text-2xl text-text-sage italic mb-5">
            {service.tagline}
          </p>
          <p className="text-text-body leading-relaxed max-w-2xl">
            {service.description}
          </p>
          <div className="flex flex-wrap items-center gap-5 mt-6">
            <AddToVillage slug={slug} />
            <Link
              href="/my-village"
              className="text-sm underline underline-offset-4 text-text-sage"
            >
              See my saved support →
            </Link>
          </div>
        </header>
        <div className="service-page-layout">
          <aside
            className="service-page-provider"
            aria-label="Service you can explore"
          >
            <ServiceSources slug={slug} />
          </aside>
          <div className="service-page-information">
            <section className="mb-9">
              <h2 className="font-heading text-3xl mb-4">
                How this support can help
              </h2>
              <p className="text-text-body leading-relaxed">
                {service.details}
              </p>
            </section>
            <section className="mb-9">
              <h2 className="font-heading text-3xl mb-4">What to look for</h2>
              <ul className="space-y-3">
                {service.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex gap-3 text-sm text-text-body"
                  >
                    <span aria-hidden="true" className="text-text-sage">
                      ↳
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </section>
            <section className="bg-surface rounded-2xl p-6">
              <h2 className="font-heading text-2xl mb-3">Who it may suit</h2>
              <p className="text-sm text-text-body leading-relaxed">
                {service.whoItsFor}
              </p>
            </section>
          </div>
        </div>
        <section className="service-related" aria-labelledby="related-heading">
          <h2 id="related-heading" className="font-heading text-3xl mb-6">
            What else would help?
          </h2>
          <div className="support-doorways">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/services/${item.slug}`}
                className="support-doorway"
              >
                <span
                  className="plan-icon"
                  aria-hidden="true"
                  dangerouslySetInnerHTML={{ __html: item.icon }}
                />
                <span>
                  <span className="block font-heading text-xl">
                    {item.title}
                  </span>
                  <span className="block text-xs text-text-muted mt-1">
                    {item.tagline}
                  </span>
                </span>
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </section>
        <div className="flex flex-wrap gap-4 mt-8">
          <Button href="/my-village">Go to my village →</Button>
          <Button href="/services" variant="secondary">
            Browse all support
          </Button>
        </div>
      </Container>
    </article>
  );
}
