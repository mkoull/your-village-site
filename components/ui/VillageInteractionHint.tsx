import type { ReactNode } from "react";

/** An instruction, not another control. Touch devices never depend on hover. */
export default function VillageInteractionHint({
  id,
  children,
}: {
  id?: string;
  children: ReactNode;
}) {
  return (
    <p id={id} className="village-interaction-hint">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m7 4 11 9-5 1-2 5L7 4Z" />
        <path d="M3 4H1M7 1v-2M3 0 1-2" transform="translate(1 3)" />
      </svg>
      <span>
        <span className="village-verb-touch">Tap</span>
        <span className="village-verb-pointer">Click</span> {children}
      </span>
    </p>
  );
}
