"use client";
import Link from "next/link";
import { useVillage } from "./VillageProvider";

export default function VillageNavLink({
  mobile = false,
  onClick,
}: {
  mobile?: boolean;
  onClick?: () => void;
}) {
  const { draft } = useVillage();
  return (
    <Link
      href="/get-started"
      onClick={onClick}
      className={mobile ? "village-nav-mobile" : "village-nav-link"}
    >
      {mobile || draft.needs.length ? "My village" : "Build my village"}
      {draft.needs.length > 0 ? (
        <span className="village-count">
          {draft.needs.length}
          <span className="sr-only"> selected services</span>
        </span>
      ) : (
        <span aria-hidden="true">↗</span>
      )}
    </Link>
  );
}
