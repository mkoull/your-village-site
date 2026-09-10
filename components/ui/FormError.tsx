export default function FormError({ message }: { message: string }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="rounded-[var(--radius-sm)] border border-current/20 bg-background p-4 text-sm text-text-primary"
    >
      {message}
    </p>
  );
}
