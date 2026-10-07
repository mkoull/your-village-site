import Container from "@/components/ui/Container";

export default function Loading() {
  return (
    <div className="pt-32 pb-24 min-h-[65vh]" role="status" aria-live="polite">
      <Container>
        <p className="text-text-sage text-sm">Opening Village…</p>
        <div className="mt-8 max-w-xl space-y-5" aria-hidden="true">
          <div className="h-12 w-3/4 rounded-xl bg-sage/10" />
          <div className="h-5 w-full rounded bg-sage/10" />
          <div className="h-5 w-4/5 rounded bg-sage/10" />
        </div>
      </Container>
    </div>
  );
}
