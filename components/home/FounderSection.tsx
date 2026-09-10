import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
export default function FounderSection() {
  return (
    <section className="py-16 md:py-24 bg-surface">
      <Container narrow>
        <p className="text-eyebrow uppercase tracking-[0.2em] text-text-sage font-semibold mb-5">
          Why Village exists
        </p>
        <h2 className="text-h2 font-heading mb-6">
          The help exists.
          <br />
          Finding it should feel easier.
        </h2>
        <p className="text-text-body leading-relaxed mb-5">
          When our twins arrived, we saw how much difference the right support
          could make. A meal. A break. Someone who understood.
        </p>
        <p className="text-text-body leading-relaxed mb-8">
          That need doesn&apos;t end with the newborn weeks. Village brings
          different kinds of support into one place, so mothers and families can
          find what fits their lives—at any stage.
        </p>
        <Button href="/about" variant="secondary">
          The idea behind Village →
        </Button>
      </Container>
    </section>
  );
}
