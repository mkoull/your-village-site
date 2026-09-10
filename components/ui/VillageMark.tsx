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
      <circle cx="32" cy="10" r="5.5" fill="currentColor" opacity="0.85" />
      <circle cx="51" cy="21" r="5.5" fill="currentColor" opacity="0.75" />
      <circle cx="51" cy="43" r="5.5" fill="currentColor" opacity="0.65" />
      <circle cx="32" cy="54" r="5.5" fill="currentColor" opacity="0.80" />
      <circle cx="13" cy="43" r="5.5" fill="currentColor" opacity="0.70" />
      <circle cx="13" cy="21" r="5.5" fill="currentColor" opacity="0.78" />
    </svg>
  );
}
