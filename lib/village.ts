export type VillageStep = 0 | 1 | 2;
export type VillageDraft = {
  version: 1;
  needs: string[];
  stage: string;
  timing: string;
  step: VillageStep;
};
export const VILLAGE_STORAGE_KEY = "village-draft-v1";
export const timingOptions = [
  { value: "asap", label: "As soon as possible" },
  { value: "soon", label: "In the next few weeks" },
  { value: "planning", label: "Planning ahead" },
  { value: "exploring", label: "Just exploring" },
];
export const emptyVillage = (): VillageDraft => ({
  version: 1,
  needs: [],
  stage: "",
  timing: "",
  step: 0,
});

/** Only an allowlisted shortlist and optional context are stored. Never contact details. */
export function readVillage(
  raw: string | null,
  serviceSlugs: readonly string[],
  stages: readonly string[],
): VillageDraft {
  try {
    if (!raw || raw.length > 4096) return emptyVillage();
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value))
      return emptyVillage();
    const input = value as Record<string, unknown>;
    if (input.version !== 1) return emptyVillage();
    const needs = Array.isArray(input.needs)
      ? [
          ...new Set(
            input.needs.filter(
              (s): s is string =>
                typeof s === "string" && serviceSlugs.includes(s),
            ),
          ),
        ]
      : [];
    return {
      version: 1,
      needs,
      stage:
        typeof input.stage === "string" && stages.includes(input.stage)
          ? input.stage
          : "",
      timing: timingOptions.some((o) => o.value === input.timing)
        ? (input.timing as string)
        : "",
      step:
        needs.length && (input.step === 1 || input.step === 2) ? input.step : 0,
    };
  } catch {
    return emptyVillage();
  }
}

export function setVillageNeed(
  draft: VillageDraft,
  slug: string,
  selected: boolean,
): VillageDraft {
  const needs = selected
    ? [...new Set([...draft.needs, slug])]
    : draft.needs.filter((s) => s !== slug);
  return { ...draft, needs, step: needs.length ? draft.step : 0 };
}
