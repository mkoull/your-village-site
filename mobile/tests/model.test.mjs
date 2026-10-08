import test from "node:test";
import assert from "node:assert/strict";
import { services } from "../../content/services.ts";
import {
  addTask,
  addPerson,
  decodeState,
  emptyState,
  finishTask,
  progressSupport,
  selectSupport,
  shareText,
  reminderDate,
  reconcileReminders,
  editPerson,
  editTask,
  nextSteps,
} from "../src/domain/model.ts";
const slugs = services.map((s) => s.slug);

test("editing a next step preserves its identity, reminder, completion and other entries", () => {
  let state = addTask(
    emptyState(),
    { id: "one", title: "Old title", category: "food" },
    slugs,
  );
  state = addTask(
    state,
    { id: "two", title: "Leave alone", category: "postpartum-carers" },
    slugs,
  );
  state.tasks[0] = {
    ...state.tasks[0],
    reminderAt: 1900000000000,
    notificationId: "nudge-one",
  };
  const edited = editTask(
    state,
    "one",
    " Ask about care ",
    "postpartum-carers",
    slugs,
  );
  assert.deepEqual(edited.tasks[0], {
    id: "one",
    title: "Ask about care",
    category: "postpartum-carers",
    done: false,
    reminderAt: 1900000000000,
    notificationId: "nudge-one",
  });
  assert.equal(edited.tasks[1], state.tasks[1]);
  assert.equal(state.tasks[0].title, "Old title");
  const done = editTask(
    finishTask(edited, "one", true),
    "one",
    "Finished care",
    "postpartum-carers",
    slugs,
  );
  assert.equal(done.tasks[0].done, true);
  assert.equal(done.tasks[0].notificationId, undefined);
  assert.deepEqual(decodeState(JSON.stringify(edited), slugs), edited);
});

test("editing existing support works at capacity without adding an entry or leaking extra fields", () => {
  let state = emptyState();
  for (let index = 0; index < 12; index++) {
    state = addPerson(
      state,
      { id: `person-${index}`, label: "A helper", category: "food" },
      slugs,
    );
  }
  const edited = editPerson(
    state,
    "person-0",
    "  Weekly\u0000cleaner  ",
    "cleaning",
    slugs,
  );
  assert.equal(edited.people.length, 12);
  assert.deepEqual(edited.people[0], {
    id: "person-0",
    label: "Weekly cleaner",
    category: "cleaning",
  });
  assert.equal(edited.people[1], state.people[1]);
  assert.doesNotMatch(shareText(edited, services), /Weekly cleaner/);
});

test("invalid edits leave the previous data intact and never resurrect a removed entry", () => {
  const state = addTask(
    addPerson(
      emptyState(),
      { id: "person", label: "Helper", category: "food" },
      slugs,
    ),
    { id: "task", title: "Next step", category: "food" },
    slugs,
  );
  assert.throws(() => editTask(state, "task", " ", "food", slugs));
  assert.throws(() => editTask(state, "task", "Valid label", "unknown", slugs));
  assert.throws(() => editTask(state, "removed", "Valid label", "food", slugs));
  assert.throws(() => editPerson(state, "person", " ", "food", slugs));
  assert.throws(() =>
    editPerson(state, "removed", "Valid label", "food", slugs),
  );
  assert.equal(state.tasks[0].title, "Next step");
  assert.equal(state.people[0].label, "Helper");
});

test("the returning dashboard prioritises reminders without mutating the saved plan", () => {
  const state = emptyState();
  state.tasks = [
    { id: "anytime", title: "Whenever", category: "food", done: false },
    {
      id: "later",
      title: "Later",
      category: "postpartum-carers",
      done: false,
      reminderAt: 200,
      notificationId: "later-note",
    },
    {
      id: "first",
      title: "Sooner",
      category: "postpartum-carers",
      done: false,
      reminderAt: 100,
      notificationId: "first-note",
    },
    { id: "done", title: "Finished", category: "food", done: true },
    { id: "other", title: "Also whenever", category: "food", done: false },
  ];
  assert.deepEqual(
    nextSteps(state).map((task) => task.id),
    ["first", "later", "anytime", "other"],
  );
  assert.deepEqual(
    state.tasks.map((task) => task.id),
    ["anytime", "later", "first", "done", "other"],
  );
});

test("restoring reminders clears stale schedules while retaining next steps and valid reminders", () => {
  const state = emptyState();
  state.tasks = [
    {
      id: "one",
      title: "Meals",
      category: "food",
      done: false,
      reminderAt: 1900000000000,
      notificationId: "gone",
    },
    {
      id: "two",
      title: "Care",
      category: "postpartum-carers",
      done: false,
      reminderAt: 1900000000000,
      notificationId: "pending",
    },
  ];
  const restored = reconcileReminders(state, ["pending"]);
  assert.equal(restored.tasks[0].title, "Meals");
  assert.equal(restored.tasks[0].notificationId, undefined);
  assert.equal(restored.tasks[0].reminderAt, undefined);
  assert.equal(restored.tasks[1], state.tasks[1]);
  assert.equal(reconcileReminders(restored, ["pending"]), restored);
});

test("selections and progress reuse canonical website rules without discarding other choices", () => {
  let state = emptyState();
  for (const slug of slugs) state = selectSupport(state, slug, true, slugs);
  state = progressSupport(state, "food", "contacted");
  assert.equal(state.village.needs.length, 8);
  assert.equal(state.welcomed, true);
  assert.equal(
    progressSupport(state, "unknown", "in-place").village.progress.unknown,
    undefined,
  );
  state = selectSupport(state, "sleep", false, slugs);
  assert.equal(state.village.progress.food, "contacted");
  assert.equal(selectSupport(state, "__proto__", true, slugs), state);
});
test("a stored village roundtrips personal support and a scheduled task", () => {
  let state = addPerson(
    emptyState(),
    { id: "person-1", label: "A friend who cooks", category: "food" },
    slugs,
  );
  state = addTask(
    state,
    { id: "task-1", title: "Explore meal delivery", category: "food" },
    slugs,
  );
  state.tasks[0] = {
    ...state.tasks[0],
    reminderAt: 1900000000000,
    notificationId: "notification-1",
  };
  assert.deepEqual(decodeState(JSON.stringify(state), slugs), state);
});
test("storage decoder bounds, sanitises and rejects unknown versions without silently clearing", () => {
  const state = emptyState();
  state.people = [
    {
      id: "one",
      label: "test\u0000label",
      category: "food",
      email: "never-kept@example.test",
    },
    { id: "one", label: "duplicate", category: "food" },
    { id: "two", label: "bad", category: "unknown" },
  ];
  state.tasks = [
    {
      id: "t",
      title: "Explore",
      category: "food",
      done: true,
      notificationId: "old",
      reminderAt: 4,
    },
  ];
  const result = decodeState(JSON.stringify(state), slugs);
  assert.deepEqual(result.people, [
    { id: "one", label: "test label", category: "food" },
  ]);
  assert.equal(result.tasks[0].notificationId, undefined);
  for (const raw of ["{", '{"version":2}', "a".repeat(16001)])
    assert.throws(() => decodeState(raw, slugs));
});
test("limits and empty entries do not produce unusable personal support or tasks", () => {
  let state = emptyState();
  assert.throws(() =>
    addPerson(state, { id: "p", label: " ", category: "food" }, slugs),
  );
  assert.throws(() =>
    addTask(state, { id: "t", title: "", category: "food" }, slugs),
  );
  for (let i = 0; i < 25; i++)
    state = addTask(
      state,
      { id: `t-${i}`, title: "Call service", category: "food" },
      slugs,
    );
  assert.throws(() =>
    addTask(state, { id: "extra", title: "More", category: "food" }, slugs),
  );
});
test("completing/reopening a task cannot retain a scheduled reminder", () => {
  const state = emptyState();
  state.tasks = [
    {
      id: "t",
      title: "A step",
      category: "food",
      done: false,
      notificationId: "n",
      reminderAt: 10,
    },
  ];
  const result = finishTask(state, "t", true);
  assert.deepEqual(result.tasks[0], {
    id: "t",
    title: "A step",
    category: "food",
    done: true,
  });
  assert.equal(
    finishTask(result, "t", false).tasks[0].notificationId,
    undefined,
  );
});
test("sharing includes only selected categories and progress, excluding personal entries", () => {
  const state = selectSupport(emptyState(), "food", true, slugs);
  state.people.push({ id: "p", label: "PRIVATE PERSON", category: "food" });
  state.tasks.push({
    id: "t",
    title: "PRIVATE STEP",
    category: "food",
    done: false,
  });
  const text = shareText(state, services);
  assert.match(text, /Meals & food support/);
  assert.doesNotMatch(text, /PRIVATE/);
});
test("reminder presets use a future local date and 9am for tomorrow", () => {
  const now = new Date(2026, 9, 8, 23, 30);
  assert.equal(reminderDate("hour", now).getTime() - now.getTime(), 3600000);
  assert.equal(reminderDate("tomorrow", now).getDate(), 9);
  assert.equal(reminderDate("tomorrow", now).getHours(), 9);
  assert.equal(reminderDate("week", now).getDate(), 15);
});
