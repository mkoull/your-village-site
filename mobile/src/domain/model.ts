import {
  emptyVillage,
  setVillageNeed,
  setVillageProgress,
  readVillage,
  deviceVillage,
  supportProgressOptions,
} from "../../../lib/village.ts";
import type { VillageDraft, SupportProgress } from "../../../lib/village.ts";

export { supportProgressOptions };
export type { SupportProgress };
export type Person = { id: string; label: string; category: string };
export type Task = {
  id: string;
  title: string;
  category: string;
  done: boolean;
  reminderAt?: number;
  notificationId?: string;
};
export type MobileVillage = {
  version: 1;
  village: VillageDraft;
  people: Person[];
  tasks: Task[];
  welcomed: boolean;
};
export const emptyState = (): MobileVillage => ({
  version: 1,
  village: emptyVillage(),
  people: [],
  tasks: [],
  welcomed: false,
});
const clean = (text: unknown, max: number) =>
  typeof text === "string"
    ? text
        .replace(/[\u0000-\u001f\u007f]/g, " ")
        .trim()
        .slice(0, max)
    : "";
const idIsValid = (id: unknown): id is string =>
  typeof id === "string" && /^[a-zA-Z0-9-]{1,80}$/.test(id);

export function decodeState(
  raw: string | null,
  slugs: readonly string[],
): MobileVillage {
  if (!raw) return emptyState();
  if (raw.length > 16000)
    throw new Error(
      "Your saved village could not be read. It has not been overwritten.",
    );
  const input = JSON.parse(raw);
  if (
    !input ||
    input.version !== 1 ||
    !input.village ||
    input.village.version !== 1 ||
    !Array.isArray(input.village.needs) ||
    !Array.isArray(input.people) ||
    !Array.isArray(input.tasks)
  )
    throw new Error(
      "Your saved village uses an unrecognised format. It has not been overwritten.",
    );
  const people: Person[] = [];
  const tasks: Task[] = [];
  for (const person of input.people.slice(0, 12)) {
    if (
      !person ||
      !idIsValid(person.id) ||
      people.some((p) => p.id === person.id) ||
      !slugs.includes(person.category)
    )
      continue;
    const label = clean(person.label, 48);
    if (label) people.push({ id: person.id, label, category: person.category });
  }
  for (const task of input.tasks.slice(0, 25)) {
    if (
      !task ||
      !idIsValid(task.id) ||
      tasks.some((t) => t.id === task.id) ||
      !slugs.includes(task.category)
    )
      continue;
    const title = clean(task.title, 96);
    const reminderValid =
      task.done !== true &&
      Number.isSafeInteger(task.reminderAt) &&
      task.reminderAt > 0 &&
      idIsValid(task.notificationId);
    if (title)
      tasks.push({
        id: task.id,
        title,
        category: task.category,
        done: task.done === true,
        ...(reminderValid
          ? { reminderAt: task.reminderAt, notificationId: task.notificationId }
          : {}),
      });
  }
  return {
    version: 1,
    village: deviceVillage(
      readVillage(JSON.stringify(input.village), slugs, []),
    ),
    people,
    tasks,
    welcomed: input.welcomed === true,
  };
}

export function selectSupport(
  state: MobileVillage,
  slug: string,
  selected: boolean,
  slugs: readonly string[],
) {
  return slugs.includes(slug)
    ? {
        ...state,
        village: setVillageNeed(state.village, slug, selected),
        welcomed: state.welcomed || selected,
      }
    : state;
}
export function progressSupport(
  state: MobileVillage,
  slug: string,
  progress: SupportProgress,
) {
  return {
    ...state,
    village: setVillageProgress(state.village, slug, progress),
  };
}
export function addTask(
  state: MobileVillage,
  task: Pick<Task, "id" | "title" | "category">,
  slugs: readonly string[],
) {
  if (state.tasks.length >= 25)
    throw new Error(
      "Your plan has 25 steps. Remove a finished step to make room.",
    );
  const title = clean(task.title, 96);
  if (!title || !idIsValid(task.id) || !slugs.includes(task.category))
    throw new Error("Choose a kind of support and add a short next step.");
  if (state.tasks.some((t) => t.id === task.id)) return state;
  return { ...state, tasks: [...state.tasks, { ...task, title, done: false }] };
}
export function addPerson(
  state: MobileVillage,
  person: Person,
  slugs: readonly string[],
) {
  if (state.people.length >= 12)
    throw new Error(
      "Your village has room for 12 existing supports. Remove one before adding another.",
    );
  const label = clean(person.label, 48);
  if (!label || !idIsValid(person.id) || !slugs.includes(person.category))
    throw new Error("Add a short label and choose a kind of support.");
  if (state.people.some((p) => p.id === person.id)) return state;
  return { ...state, people: [...state.people, { ...person, label }] };
}
export function editPerson(
  state: MobileVillage,
  id: string,
  label: string,
  category: string,
  slugs: readonly string[],
) {
  const value = clean(label, 48);
  if (!value || !slugs.includes(category))
    throw new Error("Add a short label and choose a kind of support.");
  if (!state.people.some((person) => person.id === id))
    throw new Error("This support is no longer in your village.");
  return {
    ...state,
    people: state.people.map((person) =>
      person.id === id ? { ...person, label: value, category } : person,
    ),
  };
}
export function editTask(
  state: MobileVillage,
  id: string,
  title: string,
  category: string,
  slugs: readonly string[],
) {
  const value = clean(title, 96);
  if (!value || !slugs.includes(category))
    throw new Error("Choose a kind of support and add a short next step.");
  if (!state.tasks.some((task) => task.id === id))
    throw new Error("This step is no longer in your plan.");
  // Reminders contain only a task ID, so changing its label needs no reschedule.
  return {
    ...state,
    tasks: state.tasks.map((task) =>
      task.id === id ? { ...task, title: value, category } : task,
    ),
  };
}
export function nextSteps(state: MobileVillage) {
  // Scheduled steps come first, soonest first. Unscheduled steps keep their order.
  return state.tasks
    .filter((task) => !task.done)
    .sort((a, b) => (a.reminderAt ?? Infinity) - (b.reminderAt ?? Infinity));
}
export function finishTask(state: MobileVillage, id: string, done: boolean) {
  return {
    ...state,
    tasks: state.tasks.map((task) =>
      task.id === id
        ? { id: task.id, title: task.title, category: task.category, done }
        : task,
    ),
  };
}
// A delivered, cancelled or interrupted reminder must not still look scheduled.
export function reconcileReminders(
  state: MobileVillage,
  scheduled: readonly string[],
) {
  const pending = new Set(scheduled);
  let changed = false;
  const tasks = state.tasks.map((task) => {
    if (!task.notificationId || pending.has(task.notificationId)) return task;
    changed = true;
    return {
      id: task.id,
      title: task.title,
      category: task.category,
      done: task.done,
    };
  });
  return changed ? { ...state, tasks } : state;
}
export function reminderDate(
  preset: "hour" | "tomorrow" | "week",
  now = new Date(),
) {
  const date = new Date(now);
  if (preset === "hour") date.setTime(date.getTime() + 60 * 60 * 1000);
  else {
    date.setDate(date.getDate() + (preset === "tomorrow" ? 1 : 7));
    date.setHours(9, 0, 0, 0);
  }
  return date;
}
export function shareText(
  state: MobileVillage,
  catalog: { slug: string; title: string }[],
) {
  return [
    "My village",
    ...state.village.needs.map((slug) => {
      const service = catalog.find((s) => s.slug === slug);
      const progress = supportProgressOptions.find(
        (p) => p.value === (state.village.progress[slug] || "exploring"),
      );
      return `${service?.title || slug} — ${progress?.label}`;
    }),
    "",
    "Explore support: https://your-village-site.vercel.app",
  ].join("\n");
}
