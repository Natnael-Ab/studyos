import { formatSessionDateLabel, sortSessions, toLocalDateInput } from "./studySessionPlanner";
import { daysUntil, formatDueLabel, sortTasksForFocus } from "./studyPlanner";

function startOfDay(value) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

function toDateKey(value) {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  return toLocalDateInput(new Date(value));
}

function addDays(date, amount) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function getWeekStart(date, weekStartDay = "monday") {
  const start = startOfDay(date);
  const desiredStartIndex = weekStartDay === "sunday" ? 0 : 1;
  const currentDayIndex = start.getDay();
  const difference = (currentDayIndex - desiredStartIndex + 7) % 7;
  start.setDate(start.getDate() - difference);
  return start;
}

function formatShortWeekday(date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short"
  }).format(date);
}

function formatMonthDay(date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric"
  }).format(date);
}

function formatMonthLabel(date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric"
  }).format(date);
}

function buildAgendaItemFromTask(task, subjectName, now = new Date()) {
  return {
    id: task.id,
    kind: "task",
    title: task.title,
    subtitle: subjectName,
    meta: `${formatDueLabel(task.dueDate, now)} · ${task.effortMinutes} min`,
    tone: task.priority === "critical" || task.priority === "high" ? "accent" : "neutral",
    dueValue: new Date(`${task.dueDate}T23:59:59`).getTime()
  };
}

function buildAgendaItemFromSession(session, subjectName, now = new Date()) {
  return {
    id: session.id,
    kind: "session",
    title: session.title,
    subtitle: subjectName,
    meta: `${formatSessionDateLabel(session.scheduledFor, now)} · ${session.durationMinutes} min`,
    tone: session.status === "completed" ? "neutral" : "accent",
    dueValue: new Date(session.scheduledFor).getTime()
  };
}

function buildPlannerSnapshot(
  {
    tasks = [],
    studySessions = [],
    exams = [],
    profile = {},
    settings = {}
  },
  now = new Date()
) {
  const weekStartDay = settings?.workspace?.weekStartDay ?? "monday";
  const subjectMap = new Map((profile.subjects ?? []).map((name, index) => [`subject-${index}`, name]));

  const weekStart = getWeekStart(now, weekStartDay);
  const weekDays = Array.from({ length: 7 }, (_, index) => {
    const date = addDays(weekStart, index);
    const dateKey = toDateKey(date);

    const dayTasks = sortTasksForFocus(
      tasks.filter((task) => task.status !== "done" && task.dueDate === dateKey)
    );

    const daySessions = sortSessions(
      studySessions.filter((session) => toDateKey(session.scheduledFor) === dateKey)
    );

    const dayItems = [
      ...daySessions.map((session) =>
        buildAgendaItemFromSession(
          session,
          profile.subjects?.find((subject) => subject === session.subjectId) ?? "Study session",
          now
        )
      ),
      ...dayTasks.map((task) =>
        buildAgendaItemFromTask(
          task,
          profile.subjects?.find((subject) => subject === task.subjectId) ?? "Task",
          now
        )
      )
    ].sort((left, right) => left.dueValue - right.dueValue);

    return {
      date,
      dateKey,
      label: formatShortWeekday(date),
      dateLabel: formatMonthDay(date),
      isToday: startOfDay(date).getTime() === startOfDay(now).getTime(),
      tasks: dayTasks,
      sessions: daySessions,
      items: dayItems,
      count: dayTasks.length + daySessions.length
    };
  });

  const calendarAnchor = new Date(now.getFullYear(), now.getMonth(), 1);
  const calendarStart = getWeekStart(calendarAnchor, weekStartDay);
  const monthLabel = formatMonthLabel(calendarAnchor);

  const monthDays = Array.from({ length: 42 }, (_, index) => {
    const date = addDays(calendarStart, index);
    const dateKey = toDateKey(date);
    const isCurrentMonth = date.getMonth() === calendarAnchor.getMonth();

    const taskCount = tasks.filter((task) => task.dueDate === dateKey).length;
    const sessionCount = studySessions.filter((session) => toDateKey(session.scheduledFor) === dateKey).length;

    return {
      date,
      dateKey,
      isCurrentMonth,
      isToday: startOfDay(date).getTime() === startOfDay(now).getTime(),
      label: date.getDate(),
      taskCount,
      sessionCount,
      hasItems: taskCount + sessionCount > 0
    };
  });

  const todayKey = toDateKey(now);
  const todayTasks = sortTasksForFocus(
    tasks.filter((task) => task.status !== "done" && task.dueDate === todayKey)
  );
  const todaySessions = sortSessions(
    studySessions.filter((session) => toDateKey(session.scheduledFor) === todayKey)
  );

  const todayItems = [
    ...todaySessions.map((session) =>
      buildAgendaItemFromSession(session, profile.subjects?.[0] ?? "Study session", now)
    ),
    ...todayTasks.map((task) =>
      buildAgendaItemFromTask(task, profile.subjects?.[0] ?? "Task", now)
    )
  ].sort((left, right) => left.dueValue - right.dueValue);

  const weekTaskCount = weekDays.reduce((sum, day) => sum + day.tasks.length, 0);
  const weekSessionCount = weekDays.reduce((sum, day) => sum + day.sessions.length, 0);
  const activeDays = monthDays.filter((day) => day.hasItems).length;

  const nextTask = sortTasksForFocus(tasks.filter((task) => task.status !== "done"))[0] ?? null;
  const nextSession =
    sortSessions(
      studySessions.filter((session) => new Date(session.scheduledFor).getTime() >= now.getTime())
    )[0] ?? null;

  const nextExam =
    [...exams]
      .sort((left, right) => new Date(left.date).getTime() - new Date(right.date).getTime())
      .find((exam) => daysUntil(exam.date, now) >= 0) ?? null;

  const nextItem = (() => {
    const taskTime = nextTask ? new Date(`${nextTask.dueDate}T23:59:59`).getTime() : Number.POSITIVE_INFINITY;
    const sessionTime = nextSession ? new Date(nextSession.scheduledFor).getTime() : Number.POSITIVE_INFINITY;

    if (taskTime === Number.POSITIVE_INFINITY && sessionTime === Number.POSITIVE_INFINITY) {
      return null;
    }

    if (sessionTime <= taskTime) {
      return {
        kind: "session",
        title: nextSession.title,
        subjectName: profile.subjects?.find((subject) => subject === nextSession.subjectId) ?? "Study session",
        meta: formatSessionDateLabel(nextSession.scheduledFor, now)
      };
    }

    return {
      kind: "task",
      title: nextTask.title,
      subjectName: profile.subjects?.find((subject) => subject === nextTask.subjectId) ?? "Task",
      meta: formatDueLabel(nextTask.dueDate, now)
    };
  })();

  return {
    monthLabel,
    weekDays,
    monthDays,
    todayItems,
    todayTasks,
    todaySessions,
    todayTaskCount: todayTasks.length,
    todaySessionCount: todaySessions.length,
    weekTaskCount,
    weekSessionCount,
    activeDays,
    nextItem,
    nextExam,
    subjectMap
  };
}

export { buildPlannerSnapshot, getWeekStart, toDateKey };