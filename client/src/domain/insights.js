import {
  buildSessionMetrics
} from "./studySessionPlanner";

import {
  buildTaskMetrics
} from "./taskManager";

import {
  daysUntil,
  formatDueLabel,
  sortTasksForFocus
} from "./studyPlanner";

function clamp(
  value,
  min,
  max
) {
  return Math.min(
    max,
    Math.max(
      min,
      value
    )
  );
}

function isSameCalendarDay(
  left,
  right
) {
  const leftDate =
    new Date(left);

  const rightDate =
    new Date(right);

  return (
    leftDate.getFullYear() ===
      rightDate.getFullYear() &&
    leftDate.getMonth() ===
      rightDate.getMonth() &&
    leftDate.getDate() ===
      rightDate.getDate()
  );
}

function startOfDay(
  value
) {
  const date =
    new Date(value);

  date.setHours(
    0,
    0,
    0,
    0
  );

  return date;
}

function getDayDifference(
  target,
  now
) {
  return Math.round(
    (
      startOfDay(target).getTime() -
      startOfDay(now).getTime()
    ) /
      86400000
  );
}

function getLoadLabel(
  score
) {
  if (score >= 9) {
    return "Heavy";
  }

  if (score >= 5) {
    return "Active";
  }

  return "Light";
}

function getRiskLabel(
  riskScore
) {
  if (riskScore >= 75) {
    return "High risk";
  }

  if (riskScore >= 45) {
    return "Watch";
  }

  return "Stable";
}

function getRiskTone(
  riskScore
) {
  if (riskScore >= 75) {
    return "accent";
  }

  if (riskScore >= 45) {
    return "accent";
  }

  return "neutral";
}

function getWorkloadInsight(
  {
    overdueTasks,
    dueSoonTasks,
    plannedMinutes,
    openTasks
  }
) {
  if (
    overdueTasks >= 2
  ) {
    return {
      label: "Needs attention",
      title:
        "Your workload is carrying unresolved pressure.",
      description:
        `${overdueTasks} tasks are already overdue. Clear the oldest or highest-priority item before adding more work.`,
      tone: "accent"
    };
  }

  if (
    dueSoonTasks >= 3
  ) {
    return {
      label: "Plan ahead",
      title:
        "Several tasks are converging soon.",
      description:
        `${dueSoonTasks} open tasks are due within the next few days. Protect focused time before the deadline window gets crowded.`,
      tone: "accent"
    };
  }

  if (
    plannedMinutes < 120 &&
    openTasks > 0
  ) {
    return {
      label: "Underplanned",
      title:
        "Your study plan may be lighter than the workload.",
      description:
        "There is active work in the queue but not much planned focus time. Add one realistic session instead of trying to catch up all at once.",
      tone: "neutral"
    };
  }

  return {
    label: "Steady",
    title:
      "Your current workload looks manageable.",
    description:
      "There is no immediate overload signal. Keep the current pace and review again after the next study block.",
    tone: "neutral"
  };
}

function buildWeekBuckets(
  {
    tasks,
    studySessions
  },
  now
) {
  return Array.from(
    {
      length: 7
    },
    (_, index) => {
      const date =
        new Date(now);

      date.setDate(
        date.getDate() + index
      );

      const taskItems =
        tasks.filter(
          (task) =>
            task.status !==
              "done" &&
            isSameCalendarDay(
              task.dueDate,
              date
            )
        );

      const sessionItems =
        studySessions.filter(
          (session) =>
            session.status ===
              "planned" &&
            isSameCalendarDay(
              session.scheduledFor,
              date
            )
        );

      const taskMinutes =
        taskItems.reduce(
          (
            total,
            task
          ) =>
            total +
            Number(
              task.effortMinutes ||
                0
            ),
          0
        );

      const focusMinutes =
        sessionItems.reduce(
          (
            total,
            session
          ) =>
            total +
            Number(
              session.durationMinutes ||
                0
            ),
          0
        );

      const highPriority =
        taskItems.filter(
          (task) =>
            task.priority ===
              "critical" ||
            task.priority ===
              "high"
        ).length;

      const totalMinutes =
        taskMinutes +
        focusMinutes;

      return {
        date,
        dayLabel:
          new Intl.DateTimeFormat(
            "en-US",
            {
              weekday: "short"
            }
          ).format(date),
        dateLabel:
          new Intl.DateTimeFormat(
            "en-US",
            {
              day: "numeric"
            }
          ).format(date),
        taskCount:
          taskItems.length,
        sessionCount:
          sessionItems.length,
        taskMinutes,
        focusMinutes,
        totalMinutes,
        highPriority,
        isToday:
          index === 0
      };
    }
  );
}

function buildInsightsSnapshot(
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

  const completedTasks =
    tasks.filter(
      (task) =>
        task.status === "done"
    );

  const nextTask =
    sortTasksForFocus(
      openTasks,
      now
    )[0] ?? null;

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

  const workloadBySubject =
    subjects
      .map(
        (subject) => {
          const subjectTasks =
            tasks.filter(
              (task) =>
                task.subjectId ===
                subject.id
            );

          const subjectSessions =
            studySessions.filter(
              (session) =>
                session.subjectId ===
                subject.id
            );

          const completed =
            subjectTasks.filter(
              (task) =>
                task.status ===
                "done"
            ).length;

          const open =
            subjectTasks.filter(
              (task) =>
                task.status !==
                "done"
            );

          const overdue =
            open.filter(
              (task) =>
                daysUntil(
                  task.dueDate,
                  now
                ) < 0
            );

          const dueSoon =
            open.filter(
              (task) => {
                const difference =
                  daysUntil(
                    task.dueDate,
                    now
                  );

                return (
                  difference >=
                    0 &&
                  difference <=
                    3
                );
              }
            );

          const taskMinutes =
            open.reduce(
              (
                total,
                task
              ) =>
                total +
                Number(
                  task.effortMinutes ||
                    0
                ),
              0
            );

          const sessionMinutes =
            subjectSessions
              .filter(
                (session) =>
                  session.status ===
                  "planned"
              )
              .reduce(
                (
                  total,
                  session
                ) =>
                  total +
                  Number(
                    session.durationMinutes ||
                      0
                  ),
                0
              );

          const highPriority =
            open.filter(
              (task) =>
                task.priority ===
                  "critical" ||
                task.priority ===
                  "high"
            ).length;

          const completionRate =
            subjectTasks.length ===
            0
              ? 0
              : Math.round(
                  (
                    completed /
                    subjectTasks.length
                  ) *
                    100
                );

          const loadScore =
            open.length * 2 +
            overdue.length * 4 +
            dueSoon.length * 2 +
            highPriority * 2 +
            subjectMinutesScore(
              taskMinutes +
                sessionMinutes
            );

          const riskScore =
            clamp(
              overdue.length *
                30 +
                dueSoon.length *
                  12 +
                highPriority *
                  10 -
                completionRate *
                  0.15,
              0,
              100
            );

          return {
            id: subject.id,
            name: subject.name,
            code: subject.code,
            openTasks:
              open.length,
            completedTasks:
              completed,
            overdueTasks:
              overdue.length,
            dueSoonTasks:
              dueSoon.length,
            highPriorityTasks:
              highPriority,
            sessionCount:
              subjectSessions.length,
            taskMinutes,
            sessionMinutes,
            totalMinutes:
              taskMinutes +
              sessionMinutes,
            completionRate,
            loadScore,
            loadLabel:
              getLoadLabel(
                loadScore
              ),
            riskScore,
            riskLabel:
              getRiskLabel(
                riskScore
              ),
            riskTone:
              getRiskTone(
                riskScore
              )
          };
        }
      )
      .sort(
        (left, right) =>
          right.riskScore -
          left.riskScore
      );

  const weeklyWorkload =
    buildWeekBuckets(
      {
        tasks,
        studySessions
      },
      now
    );

  const weeklyPeak =
    weeklyWorkload.reduce(
      (
        peak,
        day
      ) =>
        day.totalMinutes >
        peak.totalMinutes
          ? day
          : peak,
      weeklyWorkload[0]
    );

  const plannedMinutes =
    weeklyWorkload.reduce(
      (
        total,
        day
      ) =>
        total +
        day.focusMinutes,
      0
    );

  const workloadMinutes =
    weeklyWorkload.reduce(
      (
        total,
        day
      ) =>
        total +
        day.totalMinutes,
      0
    );

  const riskSubject =
    workloadBySubject[0] ??
    null;

  const sessionCompletionRate =
    sessionMetrics.totalSessions ===
    0
      ? 0
      : Math.round(
          (
            sessionMetrics.completedSessions /
            sessionMetrics.totalSessions
          ) *
            100
        );

  const completionMomentum =
    tasks.length === 0
      ? 0
      : Math.round(
          (
            completedTasks.length /
            tasks.length
          ) *
            100
        );

  const studyConsistency =
    sessionMetrics.totalSessions ===
    0
      ? 0
      : clamp(
          Math.round(
            (
              sessionCompletionRate +
              Math.min(
                100,
                (
                  sessionMetrics
                    .todaySessions /
                  Math.max(
                    1,
                    3
                  )
                ) *
                  100
              )
            ) /
              2
          ),
          0,
          100
        );

  const workloadInsight =
    getWorkloadInsight({
      overdueTasks:
        taskMetrics.overdueTasks,
      dueSoonTasks:
        taskMetrics.dueSoonTasks,
      plannedMinutes,
      openTasks:
        taskMetrics.openTasks
    });

  const recommendations = [];

  if (
    taskMetrics.overdueTasks >
    0
  ) {
    recommendations.push({
      id: "overdue",
      label: "Priority",
      tone: "accent",
      title:
        "Clear overdue work before adding more.",
      description:
        `${taskMetrics.overdueTasks} open task${
          taskMetrics.overdueTasks ===
          1
            ? ""
            : "s"
        } are already beyond their deadline.`,
      action: "Open tasks"
    });
  }

  if (
    weeklyPeak &&
    weeklyPeak.totalMinutes >=
      180
  ) {
    recommendations.push({
      id: "peak",
      label: "Balance",
      tone: "neutral",
      title:
        `Your heaviest day is ${weeklyPeak.dayLabel}.`,
      description:
        `${weeklyPeak.totalMinutes} minutes of tasks and planned focus land on ${weeklyPeak.dayLabel}. Move one block earlier if that day is already busy.`,
      action: "Open planner"
    });
  }

  if (
    nextExam &&
    daysUntil(
      nextExam.date,
      now
    ) <= 7
  ) {
    recommendations.push({
      id: "exam",
      label: "Exam",
      tone: "accent",
      title:
        "An exam is inside the next week.",
      description:
        `${subjectMap.get(
          nextExam.subjectId
        )?.name ?? "One subject"} is at ${nextExam.readiness}% readiness with an exam ${formatDueLabel(
          nextExam.date,
          now
        )}.`,
      action: "Review plan"
    });
  }

  if (
    plannedMinutes <
      120 &&
    taskMetrics.openTasks >
      0
  ) {
    recommendations.push({
      id: "underplanned",
      label: "Plan",
      tone: "neutral",
      title:
        "The queue is larger than the focus plan.",
      description:
        `${taskMetrics.openTasks} open tasks are supported by only ${plannedMinutes} planned focus minutes this week.`,
      action: "Add focus"
    });
  }

  if (
    recommendations.length ===
    0
  ) {
    recommendations.push({
      id: "steady",
      label: "Steady",
      tone: "neutral",
      title:
        "Your current workload has no major warning signal.",
      description:
        "Keep the current rhythm and use the planner to protect your next focused block.",
      action: "Stay on track"
    });
  }

  const nextTaskSummary =
    nextTask
      ? {
          title:
            nextTask.title,
          subjectName:
            subjectMap.get(
              nextTask.subjectId
            )?.name ??
            "Unknown subject",
          dueLabel:
            formatDueLabel(
              nextTask.dueDate,
              now
            ),
          priority:
            nextTask.priority,
          effortMinutes:
            nextTask.effortMinutes
        }
      : null;

  const nextSessionSummary =
    sessionMetrics.nextSession
      ? {
          title:
            sessionMetrics
              .nextSession.title,
          subjectName:
            subjectMap.get(
              sessionMetrics
                .nextSession
                .subjectId
            )?.name ??
            "Study session",
          dueLabel:
            formatSessionDateLabelSafe(
              sessionMetrics
                .nextSession
                .scheduledFor,
              now
            ),
          durationMinutes:
            sessionMetrics
              .nextSession
              .durationMinutes
        }
      : null;

  const nextExamSummary =
    nextExam
      ? {
          title:
            nextExam.title,
          subjectName:
            subjectMap.get(
              nextExam.subjectId
            )?.name ??
            "Unknown subject",
          dueLabel:
            formatDueLabel(
              nextExam.date,
              now
            ),
          readiness:
            nextExam.readiness,
          daysRemaining:
            daysUntil(
              nextExam.date,
              now
            )
        }
      : null;

  return {
    taskMetrics,
    sessionMetrics,
    completionMomentum,
    sessionCompletionRate,
    studyConsistency,
    workloadMinutes,
    plannedMinutes,
    weeklyPeak,
    weeklyWorkload,
    workloadInsight,
    workloadBySubject,
    recommendations,
    nextTask:
      nextTaskSummary,
    nextSession:
      nextSessionSummary,
    nextExam:
      nextExamSummary,
    riskSubject
  };
}

function subjectMinutesScore(
  minutes
) {
  if (minutes >= 180) {
    return 4;
  }

  if (minutes >= 90) {
    return 2;
  }

  return 0;
}

function formatSessionDateLabelSafe(
  value,
  now
) {
  const date =
    new Date(value);

  const difference =
    getDayDifference(
      date,
      now
    );

  const time =
    new Intl.DateTimeFormat(
      "en-US",
      {
        hour: "numeric",
        minute: "2-digit"
      }
    ).format(date);

  if (difference === 0) {
    return `Today · ${time}`;
  }

  if (difference === 1) {
    return `Tomorrow · ${time}`;
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    }
  ).format(date);
}

export {
  buildInsightsSnapshot
};