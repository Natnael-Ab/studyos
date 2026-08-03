import { daysUntil, isSameDay } from "./studyPlanner";

function toLocalDateInput(date = new Date()) {
  const local = new Date(date);
  const offset = local.getTimezoneOffset() * 60000;
  return new Date(local.getTime() - offset).toISOString().slice(0, 10);
}

function toLocalTimeInput(date = new Date()) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function addHours(date, amount) {
  const next = new Date(date);
  next.setHours(next.getHours() + amount);
  return next;
}

function createDefaultSessionSchedule(hoursAhead = 2) {
  const target = addHours(new Date(), hoursAhead);

  return {
    scheduledDate: toLocalDateInput(target),
    scheduledTime: toLocalTimeInput(target)
  };
}

function combineDateAndTime(dateValue, timeValue) {
  return new Date(`${dateValue}T${timeValue}:00`).toISOString();
}

function splitDateAndTime(isoValue) {
  const date = new Date(isoValue);
  return {
    scheduledDate: toLocalDateInput(date),
    scheduledTime: toLocalTimeInput(date)
  };
}

function capitalize(value) {
  if (!value) {
    return "";
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatSessionTypeLabel(sessionType = "focus") {
  return capitalize(sessionType.replaceAll("-", " "));
}

function formatSessionDateLabel(scheduledFor, now = new Date()) {
  const sessionDate = new Date(scheduledFor);
  const difference = daysUntil(sessionDate, now);

  if (difference === 0) {
    return `Today · ${new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit"
    }).format(sessionDate)}`;
  }

  if (difference === 1) {
    return `Tomorrow · ${new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit"
    }).format(sessionDate)}`;
  }

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(sessionDate);
}

function sortSessions(sessions) {
  return [...sessions].sort((left, right) => {
    const leftCompleted = left.status === "completed";
    const rightCompleted = right.status === "completed";

    if (leftCompleted !== rightCompleted) {
      return leftCompleted ? 1 : -1;
    }

    const timeDelta = new Date(left.scheduledFor).getTime() - new Date(right.scheduledFor).getTime();
    if (timeDelta !== 0) {
      return timeDelta;
    }

    return left.durationMinutes - right.durationMinutes;
  });
}

function matchesSessionWindow(session, window, now) {
  const difference = daysUntil(session.scheduledFor, now);

  switch (window) {
    case "today":
      return isSameDay(session.scheduledFor, now);
    case "week":
      return difference >= 0 && difference <= 7;
    case "upcoming":
      return difference >= 0;
    case "completed":
      return session.status === "completed";
    default:
      return true;
  }
}

function filterSessions(sessions, filters, now = new Date()) {
  const filtered = sessions.filter((session) => {
    const matchesStatus = filters.status === "all" || session.status === filters.status;
    const matchesSubject =
      filters.subjectId === "all" || session.subjectId === filters.subjectId;
    const matchesType = filters.sessionType === "all" || session.sessionType === filters.sessionType;
    const matchesWindow = matchesSessionWindow(session, filters.window, now);

    return matchesStatus && matchesSubject && matchesType && matchesWindow;
  });

  return sortSessions(filtered);
}

function buildSessionMetrics(sessions, now = new Date()) {
  const totalSessions = sessions.length;
  const plannedSessions = sessions.filter((session) => session.status === "planned").length;
  const completedSessions = sessions.filter((session) => session.status === "completed").length;
  const todaySessions = sessions.filter((session) => isSameDay(session.scheduledFor, now)).length;
  const focusMinutes = sessions
    .filter((session) => session.status === "planned")
    .reduce((sum, session) => sum + Number(session.durationMinutes || 0), 0);

  const nextSession = sortSessions(
    sessions.filter(
      (session) => session.status === "planned" && daysUntil(session.scheduledFor, now) >= 0
    )
  )[0] ?? null;

  return {
    totalSessions,
    plannedSessions,
    completedSessions,
    todaySessions,
    focusMinutes,
    nextSession
  };
}

export {
  buildSessionMetrics,
  combineDateAndTime,
  createDefaultSessionSchedule,
  filterSessions,
  formatSessionDateLabel,
  formatSessionTypeLabel,
  sortSessions,
  splitDateAndTime,
  toLocalDateInput,
  toLocalTimeInput
};