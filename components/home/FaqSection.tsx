import Link from "next/link";
import Container from "@/components/ui/Container";
const faqs = [
  [
    "Is Village only for new parents?",
    "No. Village is for mothers, parents and families at different stages of life. You might be expecting, raising older children, returning to work, or looking for support for yourself.",
  ],
  [
    "What if I already have some support?",
    "You can build on it. A village might include people already in your life, with one or two extra services to fill the gaps.",
  ],
  [
    "Do I need to know exactly what I need?",
    "No. Browse the support categories or use Build my village to explore a starting point. You can see your suggestions before deciding whether to contact us.",
  ],
  [
    "Can I book a service now?",
    "Village is in development. You can explore the concept and register your interest today. Provider listings, availability and bookings are still to come.",
  ],
  [
    "What will it cost?",
    "Prices will depend on the provider and service. Rates and any platform fees have not been set yet. Browsing and registering interest here are free.",
  ],
  [
    "Does Village provide mental health treatment?",
    "Village is being built to help people find relevant support, including qualified mental health professionals. This website does not assess, diagnose or provide treatment.",
  ],
];
export default function FaqSection() {
  return (
    <section className="py-16 md:py-24">
      <Container narrow>
        <p className="text-eyebrow uppercase tracking-[0.2em] text-text-sage font-semibold text-center mb-4">
          A few things you might wonder
        </p>
        <h2 className="text-h2 font-heading text-center mb-10">
          A village for real life.
        </h2>
        {faqs.map(([q, a]) => (
          <details key={q} className="border-b border-border py-5">
            <summary className="cursor-pointer font-heading text-xl text-text-primary pr-4">
              {q}
            </summary>
            <p className="text-sm text-text-muted leading-relaxed mt-4 max-w-xl">
              {a}
            </p>
          </details>
        ))}
        <p className="text-sm text-center text-text-muted mt-8">
          Something else on your mind?{" "}
          <Link
            href="/contact"
            className="text-text-sage underline underline-offset-4"
          >
            Get in touch
          </Link>
          .
        </p>
      </Container>
    </section>
  );
}
