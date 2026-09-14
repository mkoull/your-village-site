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
      <span>
        <span className="village-verb-touch">Tap</span>
        <span className="village-verb-pointer">Click</span> {children}
      </span>
    </p>
  );
}
