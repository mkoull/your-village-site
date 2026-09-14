import { test, mock } from "node:test";
import assert from "node:assert/strict";
import { handleLead, isLeadEmailConfigured } from "../lib/lead-handler.ts";

const config = {
  apiKey: "synthetic-test-key",
  to: "owner@example.invalid",
  from: "village@example.invalid",
};
const payload = {
  type: "contact",
  name: "Synthetic visitor",
  email: "visitor@example.invalid",
  message: "Local automated check",
};
const request = (extra = {}) =>
  new Request("https://village.test/api/leads", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "https://village.test",
    },
    body: JSON.stringify({ ...payload, ...extra }),
  });

test("email setup requires a private key, recipient and valid sender", () => {
  assert.equal(isLeadEmailConfigured(undefined), false);
  assert.equal(isLeadEmailConfigured({ ...config, from: "" }), false);
  assert.equal(
    isLeadEmailConfigured({
      ...config,
      to: "owner@example.invalid\r\nBcc: other@example.invalid",
    }),
    false,
  );
  assert.equal(isLeadEmailConfigured(config), true);
});

test("email goes only to the configured inbox, with visitor as reply-to", async () => {
  let captured;
  const fake = mock.method(globalThis, "fetch", async (url, options) => {
    captured = { url, options, body: JSON.parse(options.body) };
    return Response.json({ id: "synthetic-accepted-message" });
  });
  try {
    const response = await handleLead(
      request({
        to: "attacker@example.invalid",
        from: "forged@example.invalid",
        apiKey: "forged",
      }),
      undefined,
      config,
    );
    assert.deepEqual(await response.json(), { delivered: true });
    assert.equal(captured.url, "https://api.resend.com/emails");
    assert.deepEqual(captured.body.to, [config.to]);
    assert.equal(captured.body.from, config.from);
    assert.equal(captured.body.reply_to, payload.email);
    assert.equal(
      captured.options.headers.Authorization,
      `Bearer ${config.apiKey}`,
    );
    assert.equal(captured.options.redirect, "error");
    assert.ok(captured.body.text.includes(payload.message));
    assert.ok(!captured.body.text.includes("forged"));
  } finally {
    fake.mock.restore();
  }
});

test("an email API success without an accepted message ID is not confirmed", async () => {
  const fake = mock.method(globalThis, "fetch", async () => Response.json({}));
  try {
    const response = await handleLead(request(), undefined, config);
    assert.equal(response.status, 502);
    assert.deepEqual(await response.json(), { delivered: false });
  } finally {
    fake.mock.restore();
  }
});

test("rejected or timed-out emails do not fall back to a second destination", async () => {
  for (const result of [
    () => new Response(null, { status: 403 }),
    () => {
      throw new Error("timeout");
    },
  ]) {
    const fake = mock.method(globalThis, "fetch", result);
    try {
      const response = await handleLead(
        request(),
        "https://other.example.invalid",
        config,
      );
      assert.equal(response.status, 502);
      assert.deepEqual(await response.json(), { delivered: false });
      assert.equal(fake.mock.callCount(), 1);
    } finally {
      fake.mock.restore();
    }
  }
});

test("incomplete email configuration and invalid visitor input never send", async () => {
  const fake = mock.method(globalThis, "fetch", async () => {
    throw new Error("must not send");
  });
  try {
    assert.equal(
      (await handleLead(request(), undefined, { ...config, from: "" })).status,
      503,
    );
    assert.equal(
      (await handleLead(request({ email: "invalid" }), undefined, config))
        .status,
      400,
    );
    assert.equal(fake.mock.callCount(), 0);
  } finally {
    fake.mock.restore();
  }
});
