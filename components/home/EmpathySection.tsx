import Container from "@/components/ui/Container";
export default function EmpathySection() {
  return (
    <section className="bg-dark py-16 md:py-24 text-text-inverse">
      <Container narrow className="text-center">
        <p className="text-eyebrow uppercase tracking-[0.2em] text-sage-light font-semibold mb-5">
          You don&apos;t have to do it all
        </p>
        <h2 className="text-h2 font-heading mb-6">
          You can love your life.
          <br />
          And still need a hand.
        </h2>
        <p className="text-text-inverse/80 max-w-xl mx-auto leading-relaxed">
          A new baby. A return to work. A full house and an empty tank. Or
          simply a week that asks too much of you. You don&apos;t need to reach
          breaking point to deserve support.
        </p>
      </Container>
    </section>
  );
}
