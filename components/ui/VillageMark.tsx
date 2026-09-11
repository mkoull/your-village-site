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
      <g fill="currentColor">
        <circle cx="32" cy="10" r="5.5" />
        <circle cx="47.56" cy="16.44" r="5.5" />
        <circle cx="54" cy="32" r="5.5" />
        <circle cx="47.56" cy="47.56" r="5.5" />
        <circle cx="32" cy="54" r="5.5" />
        <circle cx="16.44" cy="47.56" r="5.5" />
        <circle cx="10" cy="32" r="5.5" />
        <circle cx="16.44" cy="16.44" r="5.5" />
      </g>
      <circle
        cx="32"
        cy="32"
        r="10"
        fill="var(--village-mark-light, #c59b51)"
      />
    </svg>
  );
}
