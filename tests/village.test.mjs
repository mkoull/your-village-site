import { test } from "node:test";
import assert from "node:assert/strict";
import {
  emptyVillage,
  readVillage,
  setVillageNeed,
  setVillageProgress,
} from "../lib/village.ts";
const slugs = ["food", "life-admin", "sleep", "cleaning", "community"];
const stages = ["expecting", "growing-family"];
test("older villages gain progress without losing their saved choices", () => {
  const restored = readVillage(
    JSON.stringify({
      version: 1,
      needs: ["food", "cleaning"],
      stage: "expecting",
      timing: "soon",
      step: 1,
    }),
    slugs,
    stages,
  );
  assert.deepEqual(restored, {
    ...emptyVillage(),
    needs: ["food", "cleaning"],
    stage: "expecting",
    timing: "soon",
    step: 1,
  });
});
test("progress survives a refresh and removing support clears only its progress", () => {
  let draft = setVillageNeed(
    setVillageNeed(emptyVillage(), "food", true),
    "cleaning",
    true,
  );
  draft = setVillageProgress(draft, "food", "contacted");
  draft = setVillageProgress(draft, "cleaning", "in-place");
  assert.deepEqual(readVillage(JSON.stringify(draft), slugs, stages), draft);
  const removed = setVillageNeed(draft, "food", false);
  assert.deepEqual(removed.progress, { cleaning: "in-place" });
  assert.equal(setVillageNeed(removed, "food", true).progress.food, undefined);
});
test("progress accepts only known statuses for selected support and drops private fields", () => {
  const draft = { ...emptyVillage(), needs: ["food", "cleaning"] };
  assert.equal(setVillageProgress(draft, "unknown", "contacted"), draft);
  assert.equal(setVillageProgress(draft, "food", "booked"), draft);
  const restored = readVillage(
    JSON.stringify({
      ...draft,
      progress: {
        food: "contacted",
        cleaning: "private note",
        sleep: "in-place",
        email: "test@example.invalid",
      },
    }),
    slugs,
    stages,
  );
  assert.deepEqual(restored.progress, { food: "contacted" });
});
test("adding across pages keeps earlier choices and never duplicates a service", () => {
  let draft = setVillageNeed(emptyVillage(), "life-admin", true);
  draft = setVillageNeed(draft, "food", true);
  draft = setVillageNeed(draft, "life-admin", true);
  assert.deepEqual(draft.needs, ["life-admin", "food"]);
});
test("refresh restores selections, preferences and current step", () => {
  const draft = {
    ...emptyVillage(),
    needs: ["life-admin", "food"],
    stage: "growing-family",
    timing: "soon",
    step: 2,
  };
  assert.deepEqual(readVillage(JSON.stringify(draft), slugs, stages), draft);
});
test("removing the last item returns to choice instead of an empty result", () => {
  const draft = { ...emptyVillage(), needs: ["food"], step: 2 };
  assert.deepEqual(setVillageNeed(draft, "food", false), {
    ...emptyVillage(),
    needs: [],
    step: 0,
  });
});
test("corrupt, oversized and obsolete browser drafts fail safely", () => {
  for (const raw of [
    "broken",
    "null",
    "[]",
    JSON.stringify({ version: 2, needs: ["food"] }),
    "x".repeat(4100),
  ]) {
    assert.deepEqual(readVillage(raw, slugs, stages), emptyVillage());
  }
});
test("stored drafts drop unrecognised selections and contact details", () => {
  const raw = JSON.stringify({
    version: 1,
    needs: ["unknown", "food", "food", null],
    stage: "unexpected",
    timing: "unsafe",
    step: 99,
    email: "not-stored@example.invalid",
    notes: "not stored",
  });
  assert.deepEqual(readVillage(raw, slugs, stages), {
    ...emptyVillage(),
    needs: ["food"],
  });
});
test("removing an item preserves the remaining order and optional context", () => {
  const draft = {
    ...emptyVillage(),
    needs: ["life-admin", "food", "sleep"],
    stage: "expecting",
    timing: "planning",
    step: 2,
  };
  const next = setVillageNeed(draft, "food", false);
  assert.deepEqual(next, { ...draft, needs: ["life-admin", "sleep"] });
  assert.deepEqual(
    readVillage(JSON.stringify({ ...draft, needs: [] }), slugs, stages).step,
    0,
  );
});
