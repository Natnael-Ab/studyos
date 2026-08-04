import { librarySeed } from "../data/librarySeed";

const storageKey = "studyos.library.v1";

const allowedLinkedTypes = new Set(["none", "task", "session", "exam", "subject"]);

function createId(prefix) {
  const randomId =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(16).slice(2);

  return `${prefix}-${randomId}`;
}

function nowTimestamp() {
  return new Date().toISOString();
}

function normalizeText(value, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function normalizeTags(value) {
  if (Array.isArray(value)) {
    return [...new Set(value.map((item) => normalizeText(item)).filter(Boolean))];
  }

  if (typeof value === "string") {
    return [...new Set(value.split(",").map((item) => normalizeText(item)).filter(Boolean))];
  }

  return [];
}

function normalizeLinkedType(value) {
  return allowedLinkedTypes.has(value) ? value : "none";
}

function normalizeTimestamp(value) {
  return typeof value === "string" && value ? value : nowTimestamp();
}

function normalizeNote(item = {}) {
  return {
    ...item,
    id: typeof item.id === "string" ? item.id : createId("note"),
    title: normalizeText(item.title, "Untitled note"),
    content: normalizeText(item.content),
    linkedType: normalizeLinkedType(item.linkedType),
    linkedId: normalizeText(item.linkedId),
    tags: normalizeTags(item.tags),
    createdAt: normalizeTimestamp(item.createdAt),
    updatedAt: normalizeTimestamp(item.updatedAt)
  };
}

function normalizeResource(item = {}) {
  return {
    ...item,
    id: typeof item.id === "string" ? item.id : createId("resource"),
    title: normalizeText(item.title, "Untitled resource"),
    url: normalizeText(item.url),
    description: normalizeText(item.description),
    category: normalizeText(item.category, "reference"),
    subjectId: normalizeText(item.subjectId),
    linkedType: normalizeLinkedType(item.linkedType),
    linkedId: normalizeText(item.linkedId),
    createdAt: normalizeTimestamp(item.createdAt),
    updatedAt: normalizeTimestamp(item.updatedAt)
  };
}

function normalizeAttachment(item = {}) {
  return {
    ...item,
    id: typeof item.id === "string" ? item.id : createId("attachment"),
    title: normalizeText(item.title, "Untitled attachment"),
    reference: normalizeText(item.reference),
    kind: normalizeText(item.kind, "other"),
    notes: normalizeText(item.notes),
    linkedType: normalizeLinkedType(item.linkedType),
    linkedId: normalizeText(item.linkedId),
    createdAt: normalizeTimestamp(item.createdAt),
    updatedAt: normalizeTimestamp(item.updatedAt)
  };
}

function createDefaultLibraryState() {
  return {
    notes: librarySeed.notes.map((item) => normalizeNote(item)),
    resources: librarySeed.resources.map((item) => normalizeResource(item)),
    attachments: librarySeed.attachments.map((item) => normalizeAttachment(item))
  };
}

function normalizeLibraryState(input) {
  if (!input || typeof input !== "object") {
    return createDefaultLibraryState();
  }

  return {
    notes: Array.isArray(input.notes) ? input.notes.map((item) => normalizeNote(item)) : createDefaultLibraryState().notes,
    resources: Array.isArray(input.resources)
      ? input.resources.map((item) => normalizeResource(item))
      : createDefaultLibraryState().resources,
    attachments: Array.isArray(input.attachments)
      ? input.attachments.map((item) => normalizeAttachment(item))
      : createDefaultLibraryState().attachments
  };
}

function loadWorkspaceLibrary() {
  if (typeof window === "undefined") {
    return createDefaultLibraryState();
  }

  try {
    const raw = window.localStorage.getItem(storageKey);

    if (!raw) {
      return createDefaultLibraryState();
    }

    return normalizeLibraryState(JSON.parse(raw));
  } catch {
    return createDefaultLibraryState();
  }
}

function persistWorkspaceLibrary(library) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(library));
  } catch {
    // Keep the app usable even if storage is blocked.
  }
}

export {
  createDefaultLibraryState,
  createId,
  loadWorkspaceLibrary,
  persistWorkspaceLibrary
};