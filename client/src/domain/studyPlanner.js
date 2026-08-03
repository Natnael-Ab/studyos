function startOfDay(value) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

function daysUntil(targetDate, baseDate = new Date()) {
  const target = startOfDay(targetDate).getTime();
  const base = startOfDay(baseDate).getTime();
  return Math.round((target - base) / (1000 * 60 * 60 * 24));
}

function isSameDay(first, second) {
  return startOfDay(first).getTime() === startOfDay(second).getTime();
}

function formatDueLabel(dueDate, now = new Date()) {
  const difference = daysUntil(dueDate, now);

  if (difference === 0) {
    return "Today";
  }

  if (difference === 1) {
    return "Tomorrow";
  }

  if (difference > 1 && difference <= 6) {
    return `In ${difference} days`;
  }

  if (difference === -1) {
    return "Yesterday";
  }

  if (difference < 0) {
    return `${Math.abs(difference)} days overdue`;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric"
  }).format(new Date(dueDate));
}

const priorityWeight = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1
};

function getPriorityWeight(priority) {
  return priorityWeight[priority] ?? 0;
}

function getSubjectMap(subjects) {
  return new Map(subjects.map((subject) => [subject.id, subject]));
}

function getSubjectProgress(subjectId, tasks) {
  const subjectTasks = tasks.filter((task) => task.subjectId === subjectId);
  const completed = subjectTasks.filter((task) => task.status === "done").length;
  const total = subjectTasks.length;
  const remaining = total - completed;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  return {
    completed,
    total,
    remaining,
    progress
  };
}

function sortTasksForFocus(tasks, now = new Date()) {
  return [...tasks].sort((left, right) => {
    const leftDone = left.status === "done";
    const rightDone = right.status === "done";

    if (leftDone !== rightDone) {
      return leftDone ? 1 : -1;
    }

    const priorityDelta = getPriorityWeight(right.priority) - getPriorityWeight(left.priority);
    if (priorityDelta !== 0) {
      return priorityDelta;
    }

    const dueDelta = new Date(left.dueDate).getTime() - new Date(right.dueDate).getTime();
    if (dueDelta !== 0) {
      return dueDelta;
    }

    return left.effortMinutes - right.effortMinutes;
  });
}

function buildStudySnapshot(studyData, now = new Date()) {
  const subjects = studyData.subjects ?? [];
  const tasks = studyData.tasks ?? [];
  const studySessions = studyData.studySessions ?? [];
  const exams = studyData.exams ?? [];
  const subjectMap = getSubjectMap(subjects);

  const openTasks = tasks.filter((task) => task.status !== "done");
  const dueSoonTasks = openTasks.filter((task) => daysUntil(task.dueDate, now) <= 7);
  const completedTasks = tasks.filter((task) => task.status === "done").length;
  const momentum = tasks.length === 0 ? 0 : Math.round((completedTasks / tasks.length) * 100);

  const focusTasks = sortTasksForFocus(openTasks, now)
    .slice(0, 3)
    .map((task) => ({
      id: task.id,
      title: task.title,
      subjectName: subjectMap.get(task.subjectId)?.name ?? "Unknown subject",
      dueLabel: formatDueLabel(task.dueDate, now),
      priorityLabel: task.priority,
      priorityTone: task.priority === "critical" || task.priority === "high" ? "accent" : "neutral"
    }));

  const subjectProgress = subjects
    .map((subject) => {
      const progress = getSubjectProgress(subject.id, tasks);

      return {
        id: subject.id,
        name: subject.name,
        code: subject.code,
        ...progress
      };
    })
    .sort((left, right) => right.progress - left.progress);

  const upcomingExam = [...exams]
    .sort((left, right) => new Date(left.date).getTime() - new Date(right.date).getTime())
    .find((exam) => daysUntil(exam.date, now) >= 0);

  const nextExam = upcomingExam
    ? {
        id: upcomingExam.id,
        subjectName: subjectMap.get(upcomingExam.subjectId)?.name ?? "Unknown subject",
        title: upcomingExam.title,
        dueLabel: formatDueLabel(upcomingExam.date, now),
        readiness: upcomingExam.readiness
      }
    : null;

  const summaryCards = [
    {
      label: "Active subjects",
      value: String(subjects.length),
      detail: "Across the current term"
    },
    {
      label: "Open tasks",
      value: String(openTasks.length),
      detail: `${dueSoonTasks.length} due soon`
    },
    {
      label: "Study sessions",
      value: String(studySessions.length),
      detail: "Planned in the queue"
    }
  ];

  return {
    summaryCards,
    focusTasks,
    subjectProgress,
    nextExam,
    momentum
  };
}

export {
  buildStudySnapshot,
  daysUntil,
  formatDueLabel,
  getPriorityWeight,
  getSubjectProgress,
  isSameDay,
  sortTasksForFocus
};