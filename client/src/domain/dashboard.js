import {
  buildTaskMetrics
} from "./taskManager";

import {
  buildSessionMetrics,
  formatSessionDateLabel
} from "./studySessionPlanner";

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

function isSameCalendarDay(
  first,
  second
) {
  const firstDate = new Date(first);
  const secondDate = new Date(second);

  return (
    firstDate.getFullYear() ===
      secondDate.getFullYear() &&
    firstDate.getMonth() ===
      secondDate.getMonth() &&
    firstDate.getDate() ===
      secondDate.getDate()
  );
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
  const subjectMap = new Map(
    subjects.map((subject) => [
      subject.id,
      subject
    ])
  );

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

  const openTasks =
    tasks.filter(
      (task) =>
        task.status !== "done"
    );

  const completedTasks =
    tasks.filter(
      (task) =>
        task.status === "done"
    );

  const todayTasks =
    openTasks
      .filter((task) =>
        isSameCalendarDay(
          task.dueDate,
          now
        )
      )
      .sort((left, right) => {
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
      });

  const overdueTasks =
    openTasks
      .filter(
        (task) =>
          daysUntil(
            task.dueDate,
            now
          ) < 0
      )
      .sort((left, right) => {
        const leftDays =
          daysUntil(
            left.dueDate,
            now
          );

        const rightDays =
          daysUntil(
            right.dueDate,
            now
          );

        if (leftDays !== rightDays) {
          return leftDays - rightDays;
        }

        return (
          getPriorityWeight(
            right.priority
          ) -
          getPriorityWeight(
            left.priority
          )
        );
      });

  const nextTask =
    sortTasksForFocus(
      openTasks
    )[0] ?? null;

  const enrichedNextTask =
    nextTask
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
      : null;

  const nextSession =
    sessionMetrics.nextSession
      ? {
          ...sessionMetrics.nextSession,
          subjectName:
            subjectMap.get(
              sessionMetrics
                .nextSession
                .subjectId
            )?.name ??
            "Unknown subject",
          dateLabel:
            formatSessionDateLabel(
              sessionMetrics
                .nextSession
                .scheduledFor,
              now
            )
        }
      : null;

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

  const enrichedNextExam =
    nextExam
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
      : null;

  const todayStudyMinutes =
    studySessions
      .filter((session) =>
        isSameCalendarDay(
          session.scheduledFor,
          now
        )
      )
      .reduce(
        (
          total,
          session
        ) =>
          total +
          Number(
            session.durationMinutes ??
              0
          ),
        0
      );

  const completedTaskCount =
    completedTasks.length;

  const taskProgress =
    tasks.length === 0
      ? 0
      : Math.round(
          (completedTaskCount /
            tasks.length) *
            100
        );

  const dueSoonTasks =
    openTasks.filter((task) => {
      const difference =
        daysUntil(
          task.dueDate,
          now
        );

      return (
        difference >= 0 &&
        difference <= 3
      );
    });

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

    dueSoonTasks:
      dueSoonTasks.slice(0, 4),

    nextTask:
      enrichedNextTask,

    nextSession,

    nextExam:
      enrichedNextExam
  };
}

export {
  buildDashboardSnapshot,
  getDayGreeting
};