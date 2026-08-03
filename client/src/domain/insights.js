import { buildSessionMetrics, formatSessionDateLabel } from "./studySessionPlanner";
import { buildTaskMetrics } from "./taskManager";
import { daysUntil, formatDueLabel, sortTasksForFocus } from "./studyPlanner";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getLoadLabel(loadScore) {
  if (loadScore >= 8) {
    return "Heavy";
  }

  if (loadScore >= 5) {
    return "Active";
  }

  return "Light";
}

function buildInsightsSnapshot({ subjects = [], tasks = [], studySessions = [], exams = [] }, now = new Date()) {
  const taskMetrics = buildTaskMetrics(tasks, now);
  const sessionMetrics = buildSessionMetrics(studySessions, now);
  const subjectMap = new Map(subjects.map((subject) => [subject.id, subject]));

  const openTasks = tasks.filter((task) => task.status !== "done");
  const nextTask = sortTasksForFocus(openTasks)[0] ?? null;

  const nextExam =
    [...exams]
      .sort((left, right) => new Date(left.date).getTime() - new Date(right.date).getTime())
      .find((exam) => daysUntil(exam.date, now) >= 0) ?? null;

  const workloadBySubject = subjects
    .map((subject) => {
      const subjectTasks = tasks.filter((task) => task.subjectId === subject.id);
      const subjectSessions = studySessions.filter((session) => session.subjectId === subject.id);
      const completedTasks = subjectTasks.filter((task) => task.status === "done").length;
      const openTasksCount = subjectTasks.filter((task) => task.status !== "done").length;
      const overdueTasks = subjectTasks.filter((task) => task.status !== "done" && daysUntil(task.dueDate, now) < 0).length;
      const completionRate =
        subjectTasks.length === 0 ? 0 : Math.round((completedTasks / subjectTasks.length) * 100);
      const loadScore = openTasksCount * 2 + overdueTasks * 3 + subjectSessions.length;

      return {
        id: subject.id,
        name: subject.name,
        code: subject.code,
        completedTasks,
        openTasks: openTasksCount,
        overdueTasks,
        sessionCount: subjectSessions.length,
        completionRate,
        loadScore,
        loadLabel: getLoadLabel(loadScore)
      };
    })
    .sort((left, right) => right.loadScore - left.loadScore);

  const sessionCompletionRate =
    sessionMetrics.totalSessions === 0
      ? 0
      : Math.round((sessionMetrics.completedSessions / sessionMetrics.totalSessions) * 100);

  const productivityScore = clamp(
    Math.round(
      taskMetrics.completionRate * 0.5 +
        sessionCompletionRate * 0.25 +
        Math.min(sessionMetrics.focusMinutes, 240) / 240 * 15 -
        taskMetrics.overdueTasks * 6 -
        Math.max(0, taskMetrics.dueSoonTasks - 2) * 2
    ),
    0,
    100
  );

  const recommendations = [];

  if (taskMetrics.overdueTasks > 0) {
    recommendations.push({
      title: "Clear overdue work first",
      description: `${taskMetrics.overdueTasks} overdue task${taskMetrics.overdueTasks > 1 ? "s" : ""} need attention before adding more work.`,
      tone: "accent",
      label: "Priority"
    });
  }

  if (taskMetrics.dueSoonTasks > 0) {
    recommendations.push({
      title: "Reserve a focus block",
      description: `${taskMetrics.dueSoonTasks} task${taskMetrics.dueSoonTasks > 1 ? "s are" : " is"} due soon. Protect time for the next 48 hours.`,
      tone: "neutral",
      label: "Plan"
    });
  }

  if (sessionMetrics.focusMinutes < 180) {
    recommendations.push({
      title: "Add more study time",
      description: "Your planned study time is still low. Add one or two focus blocks to stabilize the week.",
      tone: "neutral",
      label: "Balance"
    });
  }

  if (nextExam) {
    recommendations.push({
      title: "Prepare for the next exam",
      description: `${subjectMap.get(nextExam.subjectId)?.name ?? "A subject"} has an exam coming up. Build revision around readiness ${nextExam.readiness}%.`,
      tone: "accent",
      label: "Exam"
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      title: "Maintain the current rhythm",
      description: "Your workload looks balanced. Keep the same pace and review progress at the end of the week.",
      tone: "neutral",
      label: "Steady"
    });
  }

  const nextTaskSummary = nextTask
    ? {
        title: nextTask.title,
        subjectName: subjectMap.get(nextTask.subjectId)?.name ?? "Unknown subject",
        dueLabel: formatDueLabel(nextTask.dueDate, now),
        priority: nextTask.priority
      }
    : null;

  const nextSessionSummary = sessionMetrics.nextSession
    ? {
        title: sessionMetrics.nextSession.title,
        subjectName: subjectMap.get(sessionMetrics.nextSession.subjectId)?.name ?? "Unknown subject",
        dueLabel: formatSessionDateLabel(sessionMetrics.nextSession.scheduledFor, now),
        durationMinutes: sessionMetrics.nextSession.durationMinutes
      }
    : null;

  const nextExamSummary = nextExam
    ? {
        title: nextExam.title,
        subjectName: subjectMap.get(nextExam.subjectId)?.name ?? "Unknown subject",
        dueLabel: formatDueLabel(nextExam.date, now),
        readiness: nextExam.readiness
      }
    : null;

  return {
    taskMetrics,
    sessionMetrics,
    productivityScore,
    workloadBySubject,
    recommendations,
    nextTask: nextTaskSummary,
    nextSession: nextSessionSummary,
    nextExam: nextExamSummary
  };
}

export { buildInsightsSnapshot };