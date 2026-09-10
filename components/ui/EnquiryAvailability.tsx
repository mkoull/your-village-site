import Link from "next/link";
export default function EnquiryAvailability({
  available,
}: {
  available: boolean | null;
}) {
  if (available !== false) return null;
  return (
    <div role="status" className="enquiry-availability">
      <p className="font-medium mb-2">Online enquiries aren&apos;t open yet.</p>
      <p>
        You can still{" "}
        <Link href="/get-started" className="underline">
          build and keep your village
        </Link>{" "}
        and contact the independent services directly. No contact details have
        been sent.
      </p>
    </div>
  );
}
