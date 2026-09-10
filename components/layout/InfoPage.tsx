import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
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
    <article className="pt-28 md:pt-36 pb-20">
      <Container narrow>
        <header className="mb-12">
          <p className="text-eyebrow uppercase tracking-[0.2em] font-semibold text-text-sage mb-5">
            {eyebrow}
          </p>
          <h1 className="text-h1 font-heading mb-6">{headline}</h1>
          <p className="text-body-lg text-text-muted leading-relaxed">
            {intro}
          </p>
        </header>
        <div className="space-y-8">
          {sections.map(([title, body]) => (
            <section key={title} className="border-t border-border pt-7">
              <h2 className="font-heading text-2xl mb-3">{title}</h2>
              <p className="text-text-body leading-relaxed">{body}</p>
            </section>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap gap-3">
          <Button href="/services">Explore support →</Button>
          <Button href="/contact" variant="secondary">
            Get in touch
          </Button>
        </div>
      </Container>
    </article>
  );
}
