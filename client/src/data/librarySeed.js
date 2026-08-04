export const librarySeed = {
  notes: [
    {
      id: "note-bio-revision",
      title: "Biology revision notes",
      content: "Focus on cell structure, membrane transport, and exam-style summaries before the next biology session.",
      linkedType: "task",
      linkedId: "task-bio-1",
      tags: ["biology", "revision"],
      createdAt: "2026-08-03T08:00:00.000Z",
      updatedAt: "2026-08-03T08:00:00.000Z"
    },
    {
      id: "note-focus-rhythm",
      title: "Focus rhythm guide",
      content: "Use 50 minute study blocks with a short reset after each session. Keep the hardest work in the first block.",
      linkedType: "session",
      linkedId: "session-1",
      tags: ["focus", "planner"],
      createdAt: "2026-08-03T09:30:00.000Z",
      updatedAt: "2026-08-03T09:30:00.000Z"
    }
  ],
  resources: [
    {
      id: "resource-design-guide",
      title: "Portfolio case study guide",
      url: "https://example.com/portfolio-guide",
      description: "Reference for portfolio structure, case study layout, and presentation flow.",
      category: "design",
      subjectId: "subject-design",
      linkedType: "task",
      linkedId: "task-design-1",
      createdAt: "2026-08-03T10:00:00.000Z",
      updatedAt: "2026-08-03T10:00:00.000Z"
    },
    {
      id: "resource-bio-slides",
      title: "Biology lecture slides",
      url: "https://example.com/biology-slides",
      description: "Lecture slide reference for the current biology unit.",
      category: "reference",
      subjectId: "subject-biology",
      linkedType: "subject",
      linkedId: "subject-biology",
      createdAt: "2026-08-03T10:20:00.000Z",
      updatedAt: "2026-08-03T10:20:00.000Z"
    }
  ],
  attachments: [
    {
      id: "attachment-design-shot",
      title: "Design mockup screenshot",
      reference: "studyos-hero.png",
      kind: "image",
      notes: "Keep this as a presentation asset for the portfolio case study.",
      linkedType: "task",
      linkedId: "task-design-1",
      createdAt: "2026-08-03T11:00:00.000Z",
      updatedAt: "2026-08-03T11:00:00.000Z"
    },
    {
      id: "attachment-exam-checklist",
      title: "Revision checklist PDF",
      reference: "exam-prep-checklist.pdf",
      kind: "pdf",
      notes: "Checklist for exam prep and weekly revision planning.",
      linkedType: "exam",
      linkedId: "exam-1",
      createdAt: "2026-08-03T11:20:00.000Z",
      updatedAt: "2026-08-03T11:20:00.000Z"
    }
  ]
};