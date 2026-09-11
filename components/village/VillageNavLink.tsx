"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useVillage } from "./VillageProvider";
import ArrowUpRight from "@/components/ui/ArrowUpRight";

export default function VillageNavLink({
  mobile = false,
  onClick,
}: {
  mobile?: boolean;
  onClick?: () => void;
}) {
  const { draft } = useVillage();
  const pathname = usePathname();
  const href = mobile || draft.needs.length ? "/my-village" : "/get-started";
  return (
    <Link
      href={href}
      aria-current={pathname === href ? "page" : undefined}
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
        <ArrowUpRight />
      )}
    </Link>
  );
}
