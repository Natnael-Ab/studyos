import { daysUntil, formatDueLabel, sortTasksForFocus } from "./studyPlanner";

function toDateInputValue(date = new Date()) {
  const local = new Date(date);
  const offset = local.getTimezoneOffset() * 60000;
  return new Date(local.getTime() - offset).toISOString().slice(0, 10);
}

function createDefaultDueDate(daysAhead = 1) {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return toDateInputValue(date);
}

function normalizeTaskInput(input) {
  return {
    title: input.title.trim(),
    notes: (input.notes ?? "").trim(),
    subjectId: input.subjectId,
    priority: input.priority,
    status: input.status,
    dueDate: input.dueDate,
    effortMinutes: Number(input.effortMinutes),
    type: input.type
  };
}

function matchesDeadlineWindow(task, deadline, now) {
  const difference = daysUntil(task.dueDate, now);

  switch (deadline) {
    case "today":
      return difference === 0;
    case "overdue":
      return difference < 0;
    case "week":
      return difference >= 0 && difference <= 7;
    default:
      return true;
  }
}

function filterTasks(tasks, filters, now = new Date()) {
  const filtered = tasks.filter((task) => {
    const matchesStatus = filters.status === "all" || task.status === filters.status;
    const matchesPriority =
      filters.priority === "all" || task.priority === filters.priority;
    const matchesSubject =
      filters.subjectId === "all" || task.subjectId === filters.subjectId;
    const matchesDeadlineWindow = matchesDeadline(
      task,
      filters.deadline,
      now
    );

    return (
      matchesStatus &&
      matchesPriority &&
      matchesSubject &&
      matchesDeadlineWindow
    );
  });

  return sortTasksForFocus(filtered, now);
}

function matchesDeadline(task, deadline, now = new Date()) {
  return matchesDeadlineWindow(task, deadline, now);
}

function buildTaskMetrics(tasks, now = new Date()) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "done").length;
  const openTasks = tasks.filter((task) => task.status !== "done").length;
  const overdueTasks = tasks.filter((task) => daysUntil(task.dueDate, now) < 0).length;
  const dueSoonTasks = tasks.filter((task) => {
    const difference = daysUntil(task.dueDate, now);
    return difference >= 0 && difference <= 3 && task.status !== "done";
  }).length;
  const completionRate =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return {
    totalTasks,
    openTasks,
    completedTasks,
    overdueTasks,
    dueSoonTasks,
    completionRate
  };
}

function getTaskSubtitle(task, subjectName, now = new Date()) {
  return `${subjectName} · ${formatDueLabel(task.dueDate, now)} · ${task.effortMinutes} min`;
}

export {
  buildTaskMetrics,
  createDefaultDueDate,
  filterTasks,
  getTaskSubtitle,
  normalizeTaskInput,
  toDateInputValue
};