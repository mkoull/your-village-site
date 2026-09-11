export default function VillageMark({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M12 41V30a20 20 0 0 1 40 0v11"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M22 44V30a10 10 0 0 1 20 0v14"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M12 44c5 7 12 10 20 10s15-3 20-10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle
        cx="32"
        cy="32"
        r="9"
        fill="var(--village-mark-light, #c59b51)"
        opacity=".15"
      />
      <circle
        cx="32"
        cy="32"
        r="4.5"
        fill="var(--village-mark-light, #c59b51)"
      />
    </svg>
  );
}
