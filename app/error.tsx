"use client";
import Button from "@/components/ui/Button";
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="pt-36 pb-24 px-6 text-center">
      <h1 className="text-h1 font-heading mb-5">A little pause.</h1>
      <p className="text-text-muted mb-8">
        Something interrupted this page. Please try again.
      </p>
      <div className="flex justify-center gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button href="/" variant="secondary">
          Back home
        </Button>
      </div>
    </section>
  );
}
