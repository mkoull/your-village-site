import Link from "next/link";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import VillageMark from "@/components/ui/VillageMark";

export default function InfoPage({
  eyebrow,
  headline,
  intro,
  sections,
}: {
  eyebrow: string;
  headline: string;
  intro: string;
  sections: readonly (readonly [string, string])[];
}) {
  return (
    <article className="info-page">
      <div className="info-page-hero">
        <Container>
          <p className="text-eyebrow uppercase tracking-[.2em] font-semibold text-text-sage mb-5">
            {eyebrow}
          </p>
          <h1 className="text-h1 font-heading max-w-2xl mb-6">{headline}</h1>
          <p className="text-base md:text-lg text-text-muted max-w-2xl leading-relaxed">
            {intro}
          </p>
          <VillageMark className="info-page-mark" />
        </Container>
      </div>
      <Container>
        <div className="info-page-body">
          <nav aria-label="On this page" className="info-page-index">
            <p className="text-[10px] uppercase tracking-[.2em] font-semibold text-text-muted mb-4">
              On this page
            </p>
            {sections.map(([title], i) => (
              <Link key={title} href={`#section-${i + 1}`}>
                <span aria-hidden="true">0{i + 1}</span>
                {title.replace(/^0\d · /, "")}
              </Link>
            ))}
          </nav>
          <div>
            {sections.map(([title, body], i) => (
              <section
                id={`section-${i + 1}`}
                key={title}
                className="info-page-section"
              >
                <span className="text-xs text-text-sage" aria-hidden="true">
                  0{i + 1}
                </span>
                <h2 className="font-heading text-2xl md:text-3xl mt-3 mb-5">
                  {title.replace(/^0\d · /, "")}
                </h2>
                <p className="text-text-body leading-relaxed">{body}</p>
              </section>
            ))}
            <div className="flex flex-wrap gap-3 mt-10">
              <Button href="/get-started">
                Build my village <span aria-hidden="true">→</span>
              </Button>
              <Button href="/services" variant="secondary">
                Explore support
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </article>
  );
}
