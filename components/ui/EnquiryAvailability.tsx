import Link from "next/link";
export default function EnquiryAvailability({
  available,
}: {
  available: boolean | null;
}) {
  if (available !== false) return null;
  return (
    <div role="status" className="enquiry-availability">
      <p className="font-heading text-2xl mb-3">You can find support today.</p>
      <p>
        Village&apos;s inbox isn&apos;t open yet. You can explore the
        independent services, contact them through their websites, and keep
        track in My village.
      </p>
      <div className="availability-links">
        <Link href="/services">Explore services →</Link>
        <Link href="/my-village">Go to my village →</Link>
      </div>
    </div>
  );
}
