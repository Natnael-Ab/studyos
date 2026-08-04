import { daysUntil, formatDueLabel } from "./studyPlanner";
import { formatSessionDateLabel } from "./studySessionPlanner";

const SEARCH_DEFAULT_FILTERS = {
  type: "all",
  status: "all",
  priority: "all",
  dueWindow: "all",
  sortBy: "relevance"
};

function normalizeText(value) {
  return `${value ?? ""}`.toLowerCase().trim();
}

function tokenizeQuery(query) {
  return normalizeText(query)
    .split(/\s+/)
    .filter(Boolean);
}

function createResultText(item) {
  return normalizeText(
    [
      item.title,
      item.subtitle,
      item.description,
      item.details,
      ...(item.tags ?? [])
    ].join(" ")
  );
}

function createResultScore(item, tokens) {
  if (tokens.length === 0) {
    return 0;
  }

  const title = normalizeText(item.title);
  const subtitle = normalizeText(item.subtitle);
  const description = normalizeText(item.description);
  const details = normalizeText(item.details);
  const tags = normalizeText((item.tags ?? []).join(" "));
  const searchText = createResultText(item);

  let score = 0;

  tokens.forEach((token) => {
    if (title.includes(token)) score += 8;
    if (subtitle.includes(token)) score += 4;
    if (description.includes(token)) score += 3;
    if (details.includes(token)) score += 2;
    if (tags.includes(token)) score += 1;
    if (searchText.includes(token)) score += 1;
  });

  return score;
}

function toDateValue(dateString, suffix = "T23:59:59") {
  return new Date(`${dateString}${suffix}`).getTime();
}

function getDateGroup(dateValue, now = new Date()) {
  const difference = daysUntil(dateValue, now);

  if (difference < 0) {
    return "overdue";
  }

  if (difference === 0) {
    return "today";
  }

  if (difference <= 7) {
    return "week";
  }

  return "upcoming";
}

function createTaskResult(task, subjectName, now = new Date()) {
  const dueGroup = getDateGroup(task.dueDate, now);
  const statusGroup = task.status === "done" ? "completed" : dueGroup === "overdue" ? "overdue" : "open";

  return {
    id: task.id,
    type: "task",
    typeLabel: "Task",
    title: task.title,
    subtitle: subjectName,
    description: task.notes || `Assignment type: ${task.type}`,
    details: `${formatDueLabel(task.dueDate, now)} · ${task.effortMinutes} min`,
    statusGroup,
    statusLabel: task.status === "done" ? "Done" : "Open",
    priority: task.priority,
    dueGroup,
    dueValue: toDateValue(task.dueDate),
    tags: [task.type, task.priority, task.status].filter(Boolean)
  };
}

function createSessionResult(session, subjectName, now = new Date()) {
  const dueGroup = getDateGroup(session.scheduledFor, now);
  const statusGroup = session.status === "completed" ? "completed" : dueGroup === "overdue" ? "overdue" : "open";

  return {
    id: session.id,
    type: "session",
    typeLabel: "Study session",
    title: session.title,
    subtitle: subjectName,
    description: session.notes || `Focus type: ${session.sessionType}`,
    details: `${formatSessionDateLabel(session.scheduledFor, now)} · ${session.durationMinutes} min`,
    statusGroup,
    statusLabel: session.status === "completed" ? "Done" : "Planned",
    priority: session.status === "completed" ? "low" : "medium",
    dueGroup,
    dueValue: new Date(session.scheduledFor).getTime(),
    tags: [session.sessionType, `${session.durationMinutes} min`, session.status].filter(Boolean)
  };
}

function createExamResult(exam, subjectName, now = new Date()) {
  const dueGroup = getDateGroup(exam.date, now);
  const statusGroup = dueGroup === "overdue" ? "overdue" : "upcoming";
  const priority = exam.readiness < 60 ? "high" : "medium";

  return {
    id: exam.id,
    type: "exam",
    typeLabel: "Exam",
    title: exam.title,
    subtitle: subjectName,
    description: `Readiness score: ${exam.readiness}%`,
    details: `${formatDueLabel(exam.date, now)} · readiness ${exam.readiness}%`,
    statusGroup,
    statusLabel: dueGroup === "overdue" ? "Past" : "Upcoming",
    priority,
    dueGroup,
    dueValue: toDateValue(exam.date),
    tags: [priority, `${exam.readiness}%`, dueGroup].filter(Boolean)
  };
}

function matchesTypeFilter(item, filterType) {
  return filterType === "all" || item.type === filterType;
}

function matchesPriorityFilter(item, filterPriority) {
  return filterPriority === "all" || item.priority === filterPriority;
}

function matchesStatusFilter(item, filterStatus) {
  if (filterStatus === "all") {
    return true;
  }

  if (filterStatus === "open") {
    return item.statusGroup === "open" || item.statusGroup === "upcoming";
  }

  if (filterStatus === "completed") {
    return item.statusGroup === "completed";
  }

  if (filterStatus === "upcoming") {
    return item.dueGroup === "today" || item.dueGroup === "week" || item.dueGroup === "upcoming";
  }

  return true;
}

function matchesDueWindowFilter(item, filterDueWindow) {
  if (filterDueWindow === "all") {
    return true;
  }

  return item.dueGroup === filterDueWindow;
}

function searchWorkspace(
  { tasks = [], studySessions = [], exams = [], subjects = [] },
  query,
  filters = SEARCH_DEFAULT_FILTERS,
  now = new Date()
) {
  const subjectMap = new Map(subjects.map((subject) => [subject.id, subject.name]));
  const tokens = tokenizeQuery(query);

  const results = [
    ...tasks.map((task) => createTaskResult(task, subjectMap.get(task.subjectId) ?? "Unknown subject", now)),
    ...studySessions.map((session) =>
      createSessionResult(session, subjectMap.get(session.subjectId) ?? "Unknown subject", now)
    ),
    ...exams.map((exam) => createExamResult(exam, subjectMap.get(exam.subjectId) ?? "Unknown subject", now))
  ].filter((item) => {
    const queryScore = createResultScore(item, tokens);

    if (tokens.length > 0 && queryScore === 0) {
      return false;
    }

    return (
      matchesTypeFilter(item, filters.type) &&
      matchesStatusFilter(item, filters.status) &&
      matchesPriorityFilter(item, filters.priority) &&
      matchesDueWindowFilter(item, filters.dueWindow)
    );
  });

  const sortedResults = [...results].sort((left, right) => {
    if (filters.sortBy === "alpha") {
      return left.title.localeCompare(right.title);
    }

    if (filters.sortBy === "due") {
      const dueDelta = left.dueValue - right.dueValue;
      if (dueDelta !== 0) {
        return dueDelta;
      }

      return right.type.localeCompare(left.type);
    }

    const relevanceDelta = createResultScore(right, tokens) - createResultScore(left, tokens);
    if (relevanceDelta !== 0) {
      return relevanceDelta;
    }

    const dueDelta = left.dueValue - right.dueValue;
    if (dueDelta !== 0) {
      return dueDelta;
    }

    return left.title.localeCompare(right.title);
  });

  return sortedResults.map((item) => ({
    ...item,
    relevance: createResultScore(item, tokens)
  }));
}

function buildSearchInsights(results = []) {
  const total = results.length;
  const tasks = results.filter((item) => item.type === "task").length;
  const sessions = results.filter((item) => item.type === "session").length;
  const exams = results.filter((item) => item.type === "exam").length;
  const overdue = results.filter((item) => item.dueGroup === "overdue").length;
  const dueSoon = results.filter((item) => item.dueGroup === "today" || item.dueGroup === "week").length;
  const completed = results.filter((item) => item.statusGroup === "completed").length;

  return {
    total,
    tasks,
    sessions,
    exams,
    overdue,
    dueSoon,
    completed
  };
}

function groupSearchResults(results = []) {
  const order = [
    { type: "task", label: "Tasks" },
    { type: "session", label: "Study sessions" },
    { type: "exam", label: "Exams" }
  ];

  return order
    .map((group) => ({
      ...group,
      items: results.filter((item) => item.type === group.type)
    }))
    .filter((group) => group.items.length > 0);
}

export {
  SEARCH_DEFAULT_FILTERS,
  buildSearchInsights,
  groupSearchResults,
  searchWorkspace
};