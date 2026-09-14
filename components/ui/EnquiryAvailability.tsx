import Link from "next/link";
export default function EnquiryAvailability({
  available,
  checking,
  onRetry,
  updates = false,
}: {
  available: boolean | null;
  checking: boolean;
  onRetry: () => void;
  updates?: boolean;
}) {
  if (available === true) return null;
  if (checking)
    return (
      <p role="status" className="text-sm text-text-muted py-6">
        Checking the enquiry form…
      </p>
    );
  if (available === null)
    return (
      <div className="enquiry-availability" role="status">
        <p>
          We couldn’t check the form. Check your connection, then try again.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="underline text-text-sage py-3 mt-2 min-h-11"
        >
          Try again
        </button>
      </div>
    );
  return (
    <div role="status" className="enquiry-availability">
      <p className="font-heading text-2xl mb-3">
        {updates ? "Updates aren’t open yet." : "Our inbox isn’t open yet."}
      </p>
      <p>
        {updates
          ? "Email sign-up is still being set up."
          : "We’re still setting up enquiries to the Village team."}{" "}
        You can already explore the independent services, contact them through
        their websites, and keep track in My village.
      </p>
      <div className="availability-links">
        <Link href="/services">Explore services →</Link>
        <Link href="/my-village">Go to my village →</Link>
      </div>
    </div>
  );
}
