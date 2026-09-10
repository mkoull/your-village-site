import { test } from "node:test";
import assert from "node:assert/strict";
import { analyticsPageUrl } from "../lib/analytics-url.ts";

test("analytics excludes support choices and context from legacy URLs", () => {
  assert.equal(
    analyticsPageUrl(
      "https://example.com/get-started?need=counselling&stage=expecting#private-context",
    ),
    "https://example.com/get-started",
  );
  assert.equal(
    analyticsPageUrl("https://example.com/services"),
    "https://example.com/services",
  );
  assert.equal(analyticsPageUrl("invalid"), null);
});
