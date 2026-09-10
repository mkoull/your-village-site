export const stageOptions = [
  { label: "Expecting a baby", value: "expecting" },
  { label: "Life with a newborn", value: "newborn" },
  { label: "Baby (3–12 months)", value: "baby" },
  { label: "Toddlers or preschoolers", value: "young-family" },
  { label: "School-age children or teens", value: "growing-family" },
  { label: "Support for me", value: "for-me" },
  { label: "Something else", value: "other" },
];
export const NOT_SURE = "not-sure";

/** Keep every selected service, in the order the visitor chose it. */
export function selectPlan<T extends { slug: string }>(
  catalogue: T[],
  needs: string[],
): T[] {
  const selected = [...new Set(needs)].flatMap((slug) => {
    const service = catalogue.find((s) => s.slug === slug);
    return service ? [service] : [];
  });
  if (selected.length) return selected;
  return ["food", "cleaning", "community"].flatMap((slug) => {
    const service = catalogue.find((s) => s.slug === slug);
    return service ? [service] : [];
  });
}
