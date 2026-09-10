import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import VillageMark from "@/components/ui/VillageMark";
export default function NotFound() {
  return (
    <section className="pt-36 pb-24">
      <Container narrow className="text-center">
        <VillageMark className="w-16 h-16 mx-auto mb-7 text-text-sage" />
        <p className="text-xs text-text-muted uppercase tracking-widest mb-5">
          Page not found
        </p>
        <h1 className="text-h1 font-heading mb-6">
          Let&apos;s find your
          <br />
          <em className="text-text-sage">way back.</em>
        </h1>
        <p className="text-text-muted mb-8">
          This page may have moved. Your saved village is still here.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button href="/services">Explore support</Button>
          <Button href="/get-started" variant="secondary">
            My village
          </Button>
        </div>
      </Container>
    </section>
  );
}
