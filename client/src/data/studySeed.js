export const studySeed = {
  student: {
    name: "StudyOS Student",
    term: "Current term"
  },
  subjects: [
    {
      id: "subject-math",
      name: "Mathematics",
      code: "MTH 201"
    },
    {
      id: "subject-biology",
      name: "Biology",
      code: "BIO 204"
    },
    {
      id: "subject-economics",
      name: "Economics",
      code: "ECO 110"
    },
    {
      id: "subject-design",
      name: "Design",
      code: "DSN 130"
    }
  ],
  tasks: [
    {
      id: "task-math-1",
      subjectId: "subject-math",
      title: "Problem set 4",
      priority: "critical",
      status: "in-progress",
      dueDate: "2026-08-05",
      effortMinutes: 90,
      type: "assignment"
    },
    {
      id: "task-bio-1",
      subjectId: "subject-biology",
      title: "Revise cell structure notes",
      priority: "high",
      status: "todo",
      dueDate: "2026-08-04",
      effortMinutes: 45,
      type: "revision"
    },
    {
      id: "task-econ-1",
      subjectId: "subject-economics",
      title: "Prepare chapter summary",
      priority: "medium",
      status: "todo",
      dueDate: "2026-08-08",
      effortMinutes: 60,
      type: "study"
    },
    {
      id: "task-design-1",
      subjectId: "subject-design",
      title: "Refine portfolio case study",
      priority: "high",
      status: "done",
      dueDate: "2026-08-03",
      effortMinutes: 120,
      type: "project"
    },
    {
      id: "task-math-2",
      subjectId: "subject-math",
      title: "Review formulas before class",
      priority: "medium",
      status: "todo",
      dueDate: "2026-08-06",
      effortMinutes: 30,
      type: "revision"
    }
  ],
  studySessions: [
    {
      id: "session-1",
      subjectId: "subject-math",
      title: "Deep focus block",
      scheduledFor: "2026-08-03T16:00:00",
      durationMinutes: 50,
      status: "planned"
    },
    {
      id: "session-2",
      subjectId: "subject-biology",
      title: "Revision sprint",
      scheduledFor: "2026-08-04T18:00:00",
      durationMinutes: 40,
      status: "planned"
    },
    {
      id: "session-3",
      subjectId: "subject-economics",
      title: "Reading and summary",
      scheduledFor: "2026-08-06T14:00:00",
      durationMinutes: 60,
      status: "planned"
    }
  ],
  exams: [
    {
      id: "exam-1",
      subjectId: "subject-biology",
      title: "Midterm exam",
      date: "2026-08-12",
      readiness: 72
    },
    {
      id: "exam-2",
      subjectId: "subject-math",
      title: "Topic assessment",
      date: "2026-08-19",
      readiness: 58
    }
  ]
};