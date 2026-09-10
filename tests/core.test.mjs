import { test, mock } from "node:test";
import assert from "node:assert/strict";
import { handleLead } from "../lib/lead-handler.ts";
import { submitLead } from "../lib/leads.ts";
import { selectPlan, stageOptions } from "../lib/assessment.ts";

const payload = {
  type: "contact",
  name: "Test Person",
  email: "test@example.invalid",
  message: "Synthetic test",
};
const request = (data = payload, headers = {}) =>
  new Request("https://village.test/api/leads", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "https://village.test",
      ...headers,
    },
    body: JSON.stringify(data),
  });
const endpoint = "https://processor.example.invalid/leads";

test("missing configuration fails without sending or claiming delivery", async () => {
  const fetch = mock.method(globalThis, "fetch", async () => {
    throw new Error("must not send");
  });
  try {
    const response = await handleLead(request(), undefined);
    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), { delivered: false });
    assert.equal(fetch.mock.callCount(), 0);
  } finally {
    fetch.mock.restore();
  }
});
test("cross-origin submissions are rejected", async () =>
  assert.equal(
    (
      await handleLead(
        request(payload, { origin: "https://untrusted.invalid" }),
        endpoint,
      )
    ).status,
    403,
  ));
test("public Host is used when Next's request URL uses an internal hostname", async () => {
  const req = new Request("http://localhost:3100/api/leads", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      host: "127.0.0.1:3100",
      origin: "http://127.0.0.1:3100",
    },
    body: JSON.stringify(payload),
  });
  assert.equal((await handleLead(req, undefined)).status, 503);
});
test("unsupported content type is rejected", async () =>
  assert.equal(
    (
      await handleLead(
        request(payload, { "content-type": "text/plain" }),
        endpoint,
      )
    ).status,
    415,
  ));
test("invalid email and blank names are rejected", async () => {
  assert.equal(
    (await handleLead(request({ ...payload, email: "bad" }), endpoint)).status,
    400,
  );
  assert.equal(
    (await handleLead(request({ ...payload, name: "   " }), endpoint)).status,
    400,
  );
});
test("unfinished answer beacons are not accepted", async () =>
  assert.equal(
    (await handleLead(request({ ...payload, type: "quiz_step" }), endpoint))
      .status,
    400,
  ));
test("waitlist needs no name", async () =>
  assert.equal(
    (
      await handleLead(
        request({ type: "waitlist", email: payload.email }),
        undefined,
      )
    ).status,
    503,
  ));
test("oversized bodies and fields are rejected", async () => {
  assert.equal(
    (
      await handleLead(
        request({ ...payload, message: "x".repeat(17000) }),
        endpoint,
      )
    ).status,
    413,
  );
  assert.equal(
    (
      await handleLead(
        request({ ...payload, message: "x".repeat(4001) }),
        endpoint,
      )
    ).status,
    400,
  );
});
test("malformed JSON does not reach the webhook", async () => {
  const req = new Request("https://village.test/api/leads", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{",
  });
  assert.equal((await handleLead(req, endpoint)).status, 400);
});
test("untrusted webhook redirects and payload control fields are not forwarded", async () => {
  let captured;
  const fetch = mock.method(globalThis, "fetch", async (url, options) => {
    captured = { url, options };
    return new Response(null, { status: 202 });
  });
  try {
    const response = await handleLead(
      request({
        ...payload,
        submittedAt: "forged",
        unexpected: "ignored",
        name: " Test Person ",
      }),
      endpoint,
    );
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { delivered: true });
    const sent = JSON.parse(captured.options.body);
    assert.equal(sent.name, "Test Person");
    assert.equal(sent.unexpected, undefined);
    assert.notEqual(sent.submittedAt, "forged");
    assert.equal(captured.options.redirect, "error");
  } finally {
    fetch.mock.restore();
  }
});
test("upstream failures remain failures", async () => {
  const fetch = mock.method(
    globalThis,
    "fetch",
    async () => new Response(null, { status: 500 }),
  );
  try {
    assert.equal((await handleLead(request(), endpoint)).status, 502);
  } finally {
    fetch.mock.restore();
  }
});
test("network timeouts remain failures", async () => {
  const fetch = mock.method(globalThis, "fetch", async () => {
    throw new DOMException("timeout", "TimeoutError");
  });
  try {
    assert.equal((await handleLead(request(), endpoint)).status, 502);
  } finally {
    fetch.mock.restore();
  }
});
test("unsafe webhook configuration fails closed", async () => {
  assert.equal(
    (await handleLead(request(), "http://processor.invalid")).status,
    503,
  );
  assert.equal((await handleLead(request(), "invalid")).status, 503);
});
test("browser transport requires a positive acknowledgement", async () => {
  const fetch = mock.method(globalThis, "fetch", async () =>
    Response.json({ delivered: false }),
  );
  try {
    assert.equal((await submitLead("contact", payload)).delivered, false);
  } finally {
    fetch.mock.restore();
  }
});
test("browser transport handles service unavailable and malformed responses", async () => {
  const fetch = mock.method(
    globalThis,
    "fetch",
    async () => new Response(null, { status: 503 }),
  );
  try {
    const result = await submitLead("contact", payload);
    assert.equal(result.delivered, false);
    assert.match(result.error, /temporarily unavailable/);
  } finally {
    fetch.mock.restore();
  }
  const malformed = mock.method(
    globalThis,
    "fetch",
    async () => new Response("not json"),
  );
  try {
    assert.equal((await submitLead("contact", payload)).delivered, false);
  } finally {
    malformed.mock.restore();
  }
});
test("browser transport acknowledges a confirmed delivery", async () => {
  const fetch = mock.method(globalThis, "fetch", async () =>
    Response.json({ delivered: true }),
  );
  try {
    assert.deepEqual(await submitLead("contact", payload), { delivered: true });
    assert.equal(fetch.mock.calls[0].arguments[0], "/api/leads");
  } finally {
    fetch.mock.restore();
  }
});
test("shortlist keeps all selections in the chosen order", () => {
  const catalogue = ["food", "care", "mental", "cleaning", "community"].map(
    (slug) => ({ slug }),
  );
  assert.deepEqual(
    selectPlan(catalogue, ["mental", "food", "cleaning", "care"]).map(
      (s) => s.slug,
    ),
    ["mental", "food", "cleaning", "care"],
  );
  assert.deepEqual(
    selectPlan(catalogue, ["food", "food", "unknown"]).map((s) => s.slug),
    ["food"],
  );
});
test("unsure gives non-clinical examples; broader family stages are available", () => {
  const catalogue = ["food", "cleaning", "community", "counselling"].map(
    (slug) => ({ slug }),
  );
  assert.deepEqual(
    selectPlan(catalogue, ["not-sure"]).map((s) => s.slug),
    ["food", "cleaning", "community"],
  );
  assert.ok(stageOptions.some((s) => s.value === "growing-family"));
  assert.ok(stageOptions.some((s) => s.value === "for-me"));
});
