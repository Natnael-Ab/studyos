import {
  formatSessionDateLabel,
  sortSessions,
  toLocalDateInput
} from "./studySessionPlanner";

import {
  daysUntil,
  formatDueLabel,
  sortTasksForFocus
} from "./studyPlanner";

function startOfDay(value) {
  const date = new Date(value);

  date.setHours(
    0,
    0,
    0,
    0
  );

  return date;
}

function toDateKey(value) {
  if (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(
      value
    )
  ) {
    return value;
  }

  return toLocalDateInput(
    new Date(value)
  );
}

function addDays(
  date,
  amount
) {
  const next = new Date(date);

  next.setDate(
    next.getDate() +
      amount
  );

  return next;
}

function getWeekStart(
  date,
  weekStartDay = "monday"
) {
  const start =
    startOfDay(date);

  const desiredStartIndex =
    weekStartDay === "sunday"
      ? 0
      : 1;

  const currentDayIndex =
    start.getDay();

  const difference =
    (
      currentDayIndex -
      desiredStartIndex +
      7
    ) % 7;

  start.setDate(
    start.getDate() -
      difference
  );

  return start;
}

function formatShortWeekday(
  date
) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      weekday: "short"
    }
  ).format(date);
}

function formatMonthDay(
  date
) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric"
    }
  ).format(date);
}

function formatMonthLabel(
  date
) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "long",
      year: "numeric"
    }
  ).format(date);
}

function getSubjectMap(
  subjects = []
) {
  return new Map(
    subjects.map(
      (subject) => [
        subject.id,
        subject
      ]
    )
  );
}

function getSubjectName(
  subjectMap,
  subjectId,
  fallback
) {
  return (
    subjectMap.get(
      subjectId
    )?.name ??
    fallback
  );
}

function buildAgendaItemFromTask(
  task,
  subjectName,
  now = new Date()
) {
  return {
    id: task.id,
    kind: "task",
    title: task.title,
    subtitle: subjectName,
    meta: `${formatDueLabel(
      task.dueDate,
      now
    )} · ${
      task.effortMinutes
    } min`,
    tone:
      task.priority ===
        "critical" ||
      task.priority ===
        "high"
        ? "accent"
        : "neutral",
    dueValue:
      new Date(
        `${task.dueDate}T23:59:59`
      ).getTime()
  };
}

function buildAgendaItemFromSession(
  session,
  subjectName,
  now = new Date()
) {
  return {
    id: session.id,
    kind: "session",
    title: session.title,
    subtitle: subjectName,
    meta: `${formatSessionDateLabel(
      session.scheduledFor,
      now
    )} · ${
      session.durationMinutes
    } min`,
    tone:
      session.status ===
      "completed"
        ? "neutral"
        : "accent",
    dueValue:
      new Date(
        session.scheduledFor
      ).getTime()
  };
}

function buildPlannerSnapshot({
  tasks = [],
  studySessions = [],
  exams = [],
  subjects = [],
  profile = {},
  settings = {}
}, now = new Date()) {
  const weekStartDay =
    settings?.workspace
      ?.weekStartDay ??
    "monday";

  const subjectMap =
    getSubjectMap(
      subjects
    );

  const weekStart =
    getWeekStart(
      now,
      weekStartDay
    );

  const weekDays =
    Array.from(
      {
        length: 7
      },
      (_, index) => {
        const date =
          addDays(
            weekStart,
            index
          );

        const dateKey =
          toDateKey(date);

        const dayTasks =
          sortTasksForFocus(
            tasks.filter(
              (task) =>
                task.status !==
                  "done" &&
                task.dueDate ===
                  dateKey
            ),
            now
          );

        const daySessions =
          sortSessions(
            studySessions.filter(
              (session) =>
                toDateKey(
                  session.scheduledFor
                ) === dateKey
            )
          );

        const dayItems = [
          ...daySessions.map(
            (session) =>
              buildAgendaItemFromSession(
                session,
                getSubjectName(
                  subjectMap,
                  session.subjectId,
                  "Study session"
                ),
                now
              )
          ),

          ...dayTasks.map(
            (task) =>
              buildAgendaItemFromTask(
                task,
                getSubjectName(
                  subjectMap,
                  task.subjectId,
                  "Task"
                ),
                now
              )
          )
        ].sort(
          (left, right) =>
            left.dueValue -
            right.dueValue
        );

        const taskMinutes =
          dayTasks.reduce(
            (
              sum,
              task
            ) =>
              sum +
              Number(
                task.effortMinutes ??
                  0
              ),
            0
          );

        const sessionMinutes =
          daySessions.reduce(
            (
              sum,
              session
            ) =>
              sum +
              Number(
                session.durationMinutes ??
                  0
              ),
            0
          );

        return {
          date,
          dateKey,

          label:
            formatShortWeekday(
              date
            ),

          dateLabel:
            formatMonthDay(
              date
            ),

          isToday:
            startOfDay(
              date
            ).getTime() ===
            startOfDay(
              now
            ).getTime(),

          tasks: dayTasks,

          sessions:
            daySessions,

          items:
            dayItems,

          taskMinutes,

          sessionMinutes,

          totalMinutes:
            taskMinutes +
            sessionMinutes,

          count:
            dayTasks.length +
            daySessions.length
        };
      }
    );

  const calendarAnchor =
    new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

  const calendarStart =
    getWeekStart(
      calendarAnchor,
      weekStartDay
    );

  const monthDays =
    Array.from(
      {
        length: 42
      },
      (_, index) => {
        const date =
          addDays(
            calendarStart,
            index
          );

        const dateKey =
          toDateKey(date);

        const isCurrentMonth =
          date.getMonth() ===
          calendarAnchor.getMonth();

        const taskCount =
          tasks.filter(
            (task) =>
              task.dueDate ===
              dateKey
          ).length;

        const sessionCount =
          studySessions.filter(
            (session) =>
              toDateKey(
                session.scheduledFor
              ) === dateKey
          ).length;

        const examCount =
          exams.filter(
            (exam) =>
              exam.date ===
              dateKey
          ).length;

        return {
          date,
          dateKey,
          isCurrentMonth,

          isToday:
            startOfDay(
              date
            ).getTime() ===
            startOfDay(
              now
            ).getTime(),

          label:
            date.getDate(),

          taskCount,

          sessionCount,

          examCount,

          hasItems:
            taskCount +
              sessionCount +
              examCount >
            0
        };
      }
    );

  const todayKey =
    toDateKey(now);

  const todayTasks =
    sortTasksForFocus(
      tasks.filter(
        (task) =>
          task.status !==
            "done" &&
          task.dueDate ===
            todayKey
      ),
      now
    );

  const todaySessions =
    sortSessions(
      studySessions.filter(
        (session) =>
          toDateKey(
            session.scheduledFor
          ) === todayKey
      )
    );

  const todayItems = [
    ...todaySessions.map(
      (session) =>
        buildAgendaItemFromSession(
          session,
          getSubjectName(
            subjectMap,
            session.subjectId,
            "Study session"
          ),
          now
        )
    ),

    ...todayTasks.map(
      (task) =>
        buildAgendaItemFromTask(
          task,
          getSubjectName(
            subjectMap,
            task.subjectId,
            "Task"
          ),
          now
        )
    )
  ].sort(
    (left, right) =>
      left.dueValue -
      right.dueValue
  );

  const weekTaskCount =
    weekDays.reduce(
      (
        sum,
        day
      ) =>
        sum +
        day.tasks.length,
      0
    );

  const weekSessionCount =
    weekDays.reduce(
      (
        sum,
        day
      ) =>
        sum +
        day.sessions.length,
      0
    );

  const weekTaskMinutes =
    weekDays.reduce(
      (
        sum,
        day
      ) =>
        sum +
        day.taskMinutes,
      0
    );

  const weekSessionMinutes =
    weekDays.reduce(
      (
        sum,
        day
      ) =>
        sum +
        day.sessionMinutes,
      0
    );

  const activeWeekDays =
    weekDays.filter(
      (day) =>
        day.count > 0
    ).length;

  const currentMonthDays =
    monthDays.filter(
      (day) =>
        day.isCurrentMonth
    );

  const activeMonthDays =
    currentMonthDays.filter(
      (day) =>
        day.hasItems
    ).length;

  const currentMonthItemCount =
    currentMonthDays.reduce(
      (
        sum,
        day
      ) =>
        sum +
        day.taskCount +
        day.sessionCount +
        day.examCount,
      0
    );

  const nextTask =
    sortTasksForFocus(
      tasks.filter(
        (task) =>
          task.status !==
          "done"
      ),
      now
    )[0] ?? null;

  const nextSession =
    sortSessions(
      studySessions.filter(
        (session) =>
          session.status ===
            "planned" &&
          new Date(
            session.scheduledFor
          ).getTime() >=
            now.getTime()
      )
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

  const nextItem = (() => {
    const taskTime =
      nextTask
        ? new Date(
            `${nextTask.dueDate}T23:59:59`
          ).getTime()
        : Number.POSITIVE_INFINITY;

    const sessionTime =
      nextSession
        ? new Date(
            nextSession.scheduledFor
          ).getTime()
        : Number.POSITIVE_INFINITY;

    if (
      taskTime ===
        Number.POSITIVE_INFINITY &&
      sessionTime ===
        Number.POSITIVE_INFINITY
    ) {
      return null;
    }

    if (
      sessionTime <=
      taskTime
    ) {
      return {
        kind: "session",

        title:
          nextSession.title,

        subjectName:
          getSubjectName(
            subjectMap,
            nextSession.subjectId,
            "Study session"
          ),

        meta:
          formatSessionDateLabel(
            nextSession.scheduledFor,
            now
          )
      };
    }

    return {
      kind: "task",

      title:
        nextTask.title,

      subjectName:
        getSubjectName(
          subjectMap,
          nextTask.subjectId,
          "Task"
        ),

      meta:
        formatDueLabel(
          nextTask.dueDate,
          now
        )
    };
  })();

  const todayMinutes =
    todayItems.reduce(
      (
        sum,
        item
      ) => {
        const source =
          item.kind ===
          "session"
            ? todaySessions.find(
                (session) =>
                  session.id ===
                  item.id
              )
            : todayTasks.find(
                (task) =>
                  task.id ===
                  item.id
              );

        return (
          sum +
          Number(
            source
              ?.durationMinutes ??
              source
                ?.effortMinutes ??
              0
          )
        );
      },
      0
    );

  return {
    monthLabel:
      formatMonthLabel(
        calendarAnchor
      ),

    weekStart,

    weekDays,

    monthDays,

    todayItems,

    todayTasks,

    todaySessions,

    todayMinutes,

    todayTaskCount:
      todayTasks.length,

    todaySessionCount:
      todaySessions.length,

    weekTaskCount,

    weekSessionCount,

    weekTaskMinutes,

    weekSessionMinutes,

    weekTotalMinutes:
      weekTaskMinutes +
      weekSessionMinutes,

    activeWeekDays,

    activeMonthDays,

    currentMonthItemCount,

    nextItem,

    nextExam,

    subjectMap,

    termName:
      profile.termName ||
      "Current term"
  };
}

export {
  buildPlannerSnapshot,
  getWeekStart,
  toDateKey
};