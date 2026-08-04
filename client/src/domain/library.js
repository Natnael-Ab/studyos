import { formatDueLabel, sortTasksForFocus } from "./studyPlanner";
import { formatSessionDateLabel, sortSessions } from "./studySessionPlanner";

const LIBRARY_LINK_TYPES = [
  { value: "none", label: "None" },
  { value: "task", label: "Task" },
  { value: "session", label: "Study session" },
  { value: "exam", label: "Exam" },
  { value: "subject", label: "Subject" }
];

function createSubjectMap(subjects = []) {
  return new Map(subjects.map((subject) => [subject.id, subject]));
}

function getSubjectLabel(subject) {
  if (!subject) {
    return "Unknown subject";
  }

  return subject.code ? `${subject.name} · ${subject.code}` : subject.name;
}

function buildLinkedOptions(linkType, { tasks = [], studySessions = [], exams = [], subjects = [] } = {}, now = new Date()) {
  const subjectMap = createSubjectMap(subjects);

  if (linkType === "task") {
    return sortTasksForFocus(tasks).map((task) => ({
      value: task.id,
      label: `${task.title} · ${subjectMap.get(task.subjectId)?.name ?? "Unknown subject"} · ${formatDueLabel(task.dueDate, now)}`
    }));
  }

  if (linkType === "session") {
    return sortSessions(studySessions).map((session) => ({
      value: session.id,
      label: `${session.title} · ${subjectMap.get(session.subjectId)?.name ?? "Unknown subject"} · ${formatSessionDateLabel(session.scheduledFor, now)}`
    }));
  }

  if (linkType === "exam") {
    return [...exams]
      .sort((left, right) => new Date(left.date).getTime() - new Date(right.date).getTime())
      .map((exam) => ({
        value: exam.id,
        label: `${exam.title} · ${subjectMap.get(exam.subjectId)?.name ?? "Unknown subject"} · ${formatDueLabel(exam.date, now)}`
      }));
  }

  if (linkType === "subject") {
    return subjects.map((subject) => ({
      value: subject.id,
      label: getSubjectLabel(subject)
    }));
  }

  return [];
}

function resolveLinkedEntityLabel(linkType, linkId, { tasks = [], studySessions = [], exams = [], subjects = [] } = {}) {
  if (!linkType || linkType === "none" || !linkId) {
    return "Unlinked";
  }

  const subjectMap = createSubjectMap(subjects);

  if (linkType === "task") {
    return tasks.find((task) => task.id === linkId)?.title ?? "Task";
  }

  if (linkType === "session") {
    return studySessions.find((session) => session.id === linkId)?.title ?? "Study session";
  }

  if (linkType === "exam") {
    return exams.find((exam) => exam.id === linkId)?.title ?? "Exam";
  }

  if (linkType === "subject") {
    return getSubjectLabel(subjectMap.get(linkId));
  }

  return "Linked item";
}

function buildLibrarySummary({ notes = [], resources = [], attachments = [] } = {}) {
  const linkedItems = [...notes, ...resources, ...attachments].filter(
    (item) => item.linkedType && item.linkedType !== "none" && item.linkedId
  ).length;

  return {
    notes: notes.length,
    resources: resources.length,
    attachments: attachments.length,
    linkedItems,
    totalItems: notes.length + resources.length + attachments.length
  };
}

function buildLibraryExportPayload(
  {
    profile = {},
    settings = {},
    tasks = [],
    studySessions = [],
    exams = [],
    subjects = [],
    notes = [],
    resources = [],
    attachments = []
  } = {},
  now = new Date()
) {
  const workspace = { tasks, studySessions, exams, subjects };
  const summary = buildLibrarySummary({ notes, resources, attachments });

  return {
    exportedAt: now.toISOString(),
    profile: {
      fullName: profile.fullName ?? "",
      email: profile.email ?? "",
      goalType: profile.goalType ?? "",
      termName: profile.termName ?? "",
      weeklyStudyHours: profile.weeklyStudyHours ?? 0,
      sessionLength: profile.sessionLength ?? 0,
      studyMode: profile.studyMode ?? "",
      subjects: Array.isArray(profile.subjects) ? [...profile.subjects] : []
    },
    settings,
    summary,
    workspace,
    notes: notes.map((note) => ({
      ...note,
      linkedLabel: resolveLinkedEntityLabel(note.linkedType, note.linkedId, workspace)
    })),
    resources: resources.map((resource) => ({
      ...resource,
      linkedLabel: resolveLinkedEntityLabel(resource.linkedType, resource.linkedId, workspace),
      subjectLabel: getSubjectLabel(subjects.find((subject) => subject.id === resource.subjectId))
    })),
    attachments: attachments.map((attachment) => ({
      ...attachment,
      linkedLabel: resolveLinkedEntityLabel(attachment.linkedType, attachment.linkedId, workspace)
    }))
  };
}

function escapeCsv(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function buildLibraryCsv(payload = {}) {
  const rows = [];

  (payload.notes ?? []).forEach((note) => {
    rows.push({
      section: "Note",
      title: note.title ?? "",
      description: note.content ?? "",
      extra: Array.isArray(note.tags) ? note.tags.join("; ") : "",
      linkedTo: note.linkedLabel ?? "Unlinked",
      createdAt: note.createdAt ?? "",
      updatedAt: note.updatedAt ?? ""
    });
  });

  (payload.resources ?? []).forEach((resource) => {
    rows.push({
      section: "Resource",
      title: resource.title ?? "",
      description: resource.description ?? "",
      extra: resource.category ?? "",
      linkedTo: resource.linkedLabel ?? "Unlinked",
      createdAt: resource.createdAt ?? "",
      updatedAt: resource.updatedAt ?? ""
    });
  });

  (payload.attachments ?? []).forEach((attachment) => {
    rows.push({
      section: "Attachment",
      title: attachment.title ?? "",
      description: attachment.notes ?? "",
      extra: `${attachment.kind ?? ""} · ${attachment.reference ?? ""}`.trim(),
      linkedTo: attachment.linkedLabel ?? "Unlinked",
      createdAt: attachment.createdAt ?? "",
      updatedAt: attachment.updatedAt ?? ""
    });
  });

  const header = ["section", "title", "description", "extra", "linkedTo", "createdAt", "updatedAt"];

  return [header.join(",")]
    .concat(
      rows.map((row) => header.map((key) => escapeCsv(row[key])).join(","))
    )
    .join("\n");
}

export {
  LIBRARY_LINK_TYPES,
  buildLinkedOptions,
  buildLibraryCsv,
  buildLibraryExportPayload,
  buildLibrarySummary,
  resolveLinkedEntityLabel
};