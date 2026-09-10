import { test } from "node:test";
import assert from "node:assert/strict";
import { emptyVillage, readVillage, setVillageNeed } from "../lib/village.ts";
const slugs = ["food", "life-admin", "sleep", "cleaning", "community"];
const stages = ["expecting", "growing-family"];
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
