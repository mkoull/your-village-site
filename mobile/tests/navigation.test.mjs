import test from "node:test";
import assert from "node:assert/strict";
import * as queryString from "../src/platform/query-string.ts";
test("patched query parser retains the namespace API used by Expo Router", () => {
  const query = queryString.stringify(
    { category: "food", title: "A little help & rest" },
    { sort: false },
  );
  assert.equal(queryString.parse(query).title, "A little help & rest");
  assert.equal(queryString.parseUrl(`/step/new?${query}`).url, "/step/new");
  assert.equal(queryString.default.stringify, queryString.stringify);
});
