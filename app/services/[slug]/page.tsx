import AddToVillage from "@/components/village/AddToVillage";
import ServiceSources from "@/components/village/ServiceSources";
import { notFound } from "next/navigation";
import Link from "next/link";
import { services } from "@/content/services";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // For static generation, we resolve synchronously from the services array
  return params.then(({ slug }) => {
    const service = services.find((s) => s.slug === slug);
    if (!service) return { title: "Service Not Found" };
    return {
      title: service.title,
      description: service.description,
    };
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);

  if (!service) notFound();

  const otherServices = services.filter((s) => s.slug !== slug).slice(0, 3);

  return (
    <section className="pt-32 pb-20">
      <Container>
        {/* Breadcrumb */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-text-muted">
            <li>
              <Link
                href="/services"
                className="hover:text-sage transition-colors"
              >
                Services
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-text-primary font-medium">{service.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Icon + heading */}
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sage/10 text-sage mb-6">
              <div
                className="w-7 h-7"
                dangerouslySetInnerHTML={{ __html: service.icon }}
              />
            </div>

            <h1 className="text-h1 font-heading mb-3">{service.title}</h1>
            <p className="text-body-lg text-text-sage font-medium mb-8 italic font-heading">
              {service.tagline}
            </p>

            <div className="space-y-6 text-text-body leading-relaxed mb-12">
              <p className="text-body-lg">{service.description}</p>
              <p>{service.details}</p>
            </div>

            {/* Features */}
            <h2 className="text-h3 font-heading mb-6">Options to explore</h2>
            <ul className="space-y-4 mb-12">
              {service.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="w-5 h-5 text-sage shrink-0 mt-0.5"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-text-body">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Who it's for */}
            <div className="p-8 rounded-[var(--radius-lg)] bg-surface border border-border-subtle mb-12">
              <h3 className="text-h3 font-heading mb-3">Who it&apos;s for</h3>
              <p className="text-text-body leading-relaxed">
                {service.whoItsFor}
              </p>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <AddToVillage slug={service.slug} />
              <Button href="/services" variant="secondary" size="lg">
                View all services
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <ServiceSources slug={service.slug} />
              <div className="p-6 border border-border rounded-2xl">
                <h3 className="font-heading text-2xl mb-3">
                  Make room for this.
                </h3>
                <p className="text-sm text-text-muted mb-5">
                  Keep this support in your village while you explore. You can
                  change your choices any time.
                </p>
                <AddToVillage slug={service.slug} />
                <Link
                  href="/get-started"
                  className="block text-sm text-text-sage underline mt-5"
                >
                  View my village →
                </Link>
              </div>

              {/* Other services */}
              <div className="p-6 rounded-[var(--radius-lg)] bg-surface border border-border">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-4 font-body">
                  Other services
                </h3>
                <ul className="space-y-3">
                  {otherServices.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/services/${s.slug}`}
                        className="flex items-center gap-3 text-sm text-text-body hover:text-sage transition-colors"
                      >
                        <div
                          className="w-4 h-4 text-text-muted"
                          dangerouslySetInnerHTML={{ __html: s.icon }}
                        />
                        {s.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
