import {
  buildSessionMetrics
} from "./studySessionPlanner";

import {
  buildTaskMetrics
} from "./taskManager";

import {
  daysUntil,
  formatDueLabel,
  getPriorityWeight,
  sortTasksForFocus
} from "./studyPlanner";

function getDayGreeting(
  hour = new Date().getHours()
) {
  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 18) {
    return "Good afternoon";
  }

  return "Good evening";
}

function buildDashboardSnapshot(
  {
    subjects = [],
    tasks = [],
    studySessions = [],
    exams = []
  },
  now = new Date()
) {
  const taskMetrics =
    buildTaskMetrics(
      tasks,
      now
    );

  const sessionMetrics =
    buildSessionMetrics(
      studySessions,
      now
    );

  const subjectMap =
    new Map(
      subjects.map(
        (subject) => [
          subject.id,
          subject
        ]
      )
    );

  const openTasks =
    tasks.filter(
      (task) =>
        task.status !== "done"
    );

  const todayTasks =
    openTasks
      .filter(
        (task) =>
          daysUntil(
            task.dueDate,
            now
          ) === 0
      )
      .sort(
        (left, right) => {
          const priorityDelta =
            getPriorityWeight(
              right.priority
            ) -
            getPriorityWeight(
              left.priority
            );

          if (priorityDelta !== 0) {
            return priorityDelta;
          }

          return (
            Number(
              left.effortMinutes ?? 0
            ) -
            Number(
              right.effortMinutes ?? 0
            )
          );
        }
      );

  const overdueTasks =
    openTasks
      .filter(
        (task) =>
          daysUntil(
            task.dueDate,
            now
          ) < 0
      )
      .sort(
        (left, right) => {
          const overdueDelta =
            daysUntil(
              left.dueDate,
              now
            ) -
            daysUntil(
              right.dueDate,
              now
            );

          if (overdueDelta !== 0) {
            return overdueDelta;
          }

          return (
            getPriorityWeight(
              right.priority
            ) -
            getPriorityWeight(
              left.priority
            )
          );
        }
      );

  const nextTask =
    sortTasksForFocus(
      openTasks
    )[0] ?? null;

  const nextSession =
    sessionMetrics.nextSession ??
    null;

  const nextExam =
    [...exams]
      .sort(
        (left, right) =>
          new Date(
            left.date
          ).getTime() -
          new Date(
            right.date
          ).getTime()
      )
      .find(
        (exam) =>
          daysUntil(
            exam.date,
            now
          ) >= 0
      ) ?? null;

  const todayStudyMinutes =
    studySessions
      .filter(
        (session) => {
          const sessionDate =
            new Date(
              session.scheduledFor
            );

          return (
            sessionDate.getFullYear() ===
              now.getFullYear() &&
            sessionDate.getMonth() ===
              now.getMonth() &&
            sessionDate.getDate() ===
              now.getDate()
          );
        }
      )
      .reduce(
        (total, session) =>
          total +
          Number(
            session.durationMinutes ??
              0
          ),
        0
      );

  const completedTasks =
    tasks.filter(
      (task) =>
        task.status === "done"
    ).length;

  const taskProgress =
    tasks.length === 0
      ? 0
      : Math.round(
          (completedTasks /
            tasks.length) *
            100
        );

  const upcomingTasks =
    openTasks
      .filter(
        (task) => {
          const difference =
            daysUntil(
              task.dueDate,
              now
            );

          return (
            difference >= 0 &&
            difference <= 7
          );
        }
      )
      .sort(
        (left, right) =>
          new Date(
            left.dueDate
          ).getTime() -
          new Date(
            right.dueDate
          ).getTime()
      );

  return {
    greeting: getDayGreeting(
      now.getHours()
    ),

    taskMetrics,

    sessionMetrics,

    taskProgress,

    todayStudyMinutes,

    todayTasks:
      todayTasks.slice(0, 4),

    overdueTasks:
      overdueTasks.slice(0, 3),

    upcomingTasks:
      upcomingTasks.slice(0, 4),

    nextTask: nextTask
      ? {
          ...nextTask,
          subjectName:
            subjectMap.get(
              nextTask.subjectId
            )?.name ??
            "Unknown subject",
          dueLabel:
            formatDueLabel(
              nextTask.dueDate,
              now
            )
        }
      : null,

    nextSession:
      nextSession
        ? {
            ...nextSession,
            subjectName:
              subjectMap.get(
                nextSession.subjectId
              )?.name ??
              "Unknown subject"
          }
        : null,

    nextExam: nextExam
      ? {
          ...nextExam,
          subjectName:
            subjectMap.get(
              nextExam.subjectId
            )?.name ??
            "Unknown subject",
          dueLabel:
            formatDueLabel(
              nextExam.date,
              now
            )
        }
      : null
  };
}

export {
  buildDashboardSnapshot,
  getDayGreeting
};