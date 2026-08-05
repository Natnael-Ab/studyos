import { useCallback, useEffect, useMemo, useState } from "react";
import WorkspaceLibraryContext from "./WorkspaceLibraryContext";
import { createId, loadWorkspaceLibrary, persistWorkspaceLibrary } from "./workspaceLibraryStorage";

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
  const allowed = new Set(["none", "task", "session", "exam", "subject"]);
  return allowed.has(value) ? value : "none";
}

function WorkspaceLibraryProvider({ children }) {
  const [library, setLibrary] = useState(loadWorkspaceLibrary);

  useEffect(() => {
    persistWorkspaceLibrary(library);
  }, [library]);

  const addNote = useCallback((noteInput) => {
    const now = new Date().toISOString();

    const nextNote = {
      id: createId("note"),
      title: normalizeText(noteInput.title),
      content: normalizeText(noteInput.content),
      tags: normalizeTags(noteInput.tags),
      linkedType: normalizeLinkedType(noteInput.linkedType),
      linkedId: normalizeText(noteInput.linkedId),
      createdAt: now,
      updatedAt: now
    };

    setLibrary((current) => ({
      ...current,
      notes: [nextNote, ...current.notes]
    }));

    return nextNote;
  }, []);

  const updateNote = useCallback((noteId, updates) => {
    setLibrary((current) => ({
      ...current,
      notes: current.notes.map((note) =>
        note.id === noteId
          ? {
              ...note,
              title: normalizeText(updates.title ?? note.title),
              content: normalizeText(updates.content ?? note.content),
              tags: updates.tags !== undefined ? normalizeTags(updates.tags) : note.tags,
              linkedType:
                updates.linkedType !== undefined ? normalizeLinkedType(updates.linkedType) : note.linkedType,
              linkedId:
                updates.linkedType === "none" ? "" : normalizeText(updates.linkedId ?? note.linkedId),
              updatedAt: new Date().toISOString()
            }
          : note
      )
    }));
  }, []);

  const deleteNote = useCallback((noteId) => {
    setLibrary((current) => ({
      ...current,
      notes: current.notes.filter((note) => note.id !== noteId)
    }));
  }, []);

  const addResource = useCallback((resourceInput) => {
    const now = new Date().toISOString();

    const nextResource = {
      id: createId("resource"),
      title: normalizeText(resourceInput.title),
      url: normalizeText(resourceInput.url),
      description: normalizeText(resourceInput.description),
      category: normalizeText(resourceInput.category, "reference"),
      subjectId: normalizeText(resourceInput.subjectId),
      linkedType: normalizeLinkedType(resourceInput.linkedType),
      linkedId: normalizeText(resourceInput.linkedId),
      createdAt: now,
      updatedAt: now
    };

    setLibrary((current) => ({
      ...current,
      resources: [nextResource, ...current.resources]
    }));

    return nextResource;
  }, []);

  const updateResource = useCallback((resourceId, updates) => {
    setLibrary((current) => ({
      ...current,
      resources: current.resources.map((resource) =>
        resource.id === resourceId
          ? {
              ...resource,
              title: normalizeText(updates.title ?? resource.title),
              url: normalizeText(updates.url ?? resource.url),
              description: normalizeText(updates.description ?? resource.description),
              category: normalizeText(updates.category ?? resource.category, "reference"),
              subjectId: normalizeText(updates.subjectId ?? resource.subjectId),
              linkedType:
                updates.linkedType !== undefined
                  ? normalizeLinkedType(updates.linkedType)
                  : resource.linkedType,
              linkedId:
                updates.linkedType === "none" ? "" : normalizeText(updates.linkedId ?? resource.linkedId),
              updatedAt: new Date().toISOString()
            }
          : resource
      )
    }));
  }, []);

  const deleteResource = useCallback((resourceId) => {
    setLibrary((current) => ({
      ...current,
      resources: current.resources.filter((resource) => resource.id !== resourceId)
    }));
  }, []);

  const addAttachment = useCallback((attachmentInput) => {
    const now = new Date().toISOString();

    const nextAttachment = {
      id: createId("attachment"),
      title: normalizeText(attachmentInput.title),
      reference: normalizeText(attachmentInput.reference),
      kind: normalizeText(attachmentInput.kind, "other"),
      notes: normalizeText(attachmentInput.notes),
      linkedType: normalizeLinkedType(attachmentInput.linkedType),
      linkedId: normalizeText(attachmentInput.linkedId),
      createdAt: now,
      updatedAt: now
    };

    setLibrary((current) => ({
      ...current,
      attachments: [nextAttachment, ...current.attachments]
    }));

    return nextAttachment;
  }, []);

  const updateAttachment = useCallback((attachmentId, updates) => {
    setLibrary((current) => ({
      ...current,
      attachments: current.attachments.map((attachment) =>
        attachment.id === attachmentId
          ? {
              ...attachment,
              title: normalizeText(updates.title ?? attachment.title),
              reference: normalizeText(updates.reference ?? attachment.reference),
              kind: normalizeText(updates.kind ?? attachment.kind, "other"),
              notes: normalizeText(updates.notes ?? attachment.notes),
              linkedType:
                updates.linkedType !== undefined
                  ? normalizeLinkedType(updates.linkedType)
                  : attachment.linkedType,
              linkedId:
                updates.linkedType === "none"
                  ? ""
                  : normalizeText(updates.linkedId ?? attachment.linkedId),
              updatedAt: new Date().toISOString()
            }
          : attachment
      )
    }));
  }, []);

  const deleteAttachment = useCallback((attachmentId) => {
    setLibrary((current) => ({
      ...current,
      attachments: current.attachments.filter((attachment) => attachment.id !== attachmentId)
    }));
  }, []);

  const value = useMemo(
    () => ({
      notes: library.notes,
      resources: library.resources,
      attachments: library.attachments,
      addNote,
      updateNote,
      deleteNote,
      addResource,
      updateResource,
      deleteResource,
      addAttachment,
      updateAttachment,
      deleteAttachment
    }),
    [
      addAttachment,
      addNote,
      addResource,
      deleteAttachment,
      deleteNote,
      deleteResource,
      library.attachments,
      library.notes,
      library.resources,
      updateAttachment,
      updateNote,
      updateResource
    ]
  );

  return <WorkspaceLibraryContext.Provider value={value}>{children}</WorkspaceLibraryContext.Provider>;
}

export default WorkspaceLibraryProvider;