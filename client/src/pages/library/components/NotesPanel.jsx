import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  EmptyState,
  Input,
  SectionHeader,
  Select,
  Surface,
  Textarea
} from "../../../components/ui";
import {
  buildLinkedOptions,
  LIBRARY_LINK_TYPES,
  resolveLinkedEntityLabel
} from "../../../domain/library";
import { useStudyData } from "../../../hooks/useStudyData";
import { useWorkspaceLibrary } from "../../../hooks/useWorkspaceLibrary";

function createDefaultNoteForm() {
  return {
    title: "",
    content: "",
    tags: "",
    linkedType: "none",
    linkedId: ""
  };
}

function buildNoteForm(note) {
  if (!note) {
    return createDefaultNoteForm();
  }

  return {
    title: note.title ?? "",
    content: note.content ?? "",
    tags: Array.isArray(note.tags) ? note.tags.join(", ") : "",
    linkedType: note.linkedType ?? "none",
    linkedId: note.linkedId ?? ""
  };
}

function parseTags(value) {
  return `${value}`
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function NoteComposer({ note, tasks, studySessions, exams, subjects, onSubmit, onCancel }) {
  const [form, setForm] = useState(() => buildNoteForm(note));

  const linkedOptions = useMemo(
    () =>
      buildLinkedOptions(form.linkedType, {
        tasks,
        studySessions,
        exams,
        subjects
      }),
    [exams, form.linkedType, studySessions, subjects, tasks]
  );

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value
    }));
  }

  function handleLinkedTypeChange(event) {
    const nextType = event.target.value;
    const nextOptions = buildLinkedOptions(nextType, {
      tasks,
      studySessions,
      exams,
      subjects
    });

    setForm((current) => ({
      ...current,
      linkedType: nextType,
      linkedId: nextType === "none" ? "" : nextOptions[0]?.value ?? ""
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    onSubmit({
      title: form.title.trim(),
      content: form.content.trim(),
      tags: parseTags(form.tags),
      linkedType: form.linkedType,
      linkedId: form.linkedType === "none" ? "" : form.linkedId
    });
  }

  return (
    <form className="library-form" onSubmit={handleSubmit}>
      <div className="library-form-grid">
        <Input
          label="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Biology revision summary"
          required
        />

        <Select
          label="Link type"
          name="linkedType"
          value={form.linkedType}
          onChange={handleLinkedTypeChange}
        >
          {LIBRARY_LINK_TYPES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>

        {form.linkedType !== "none" ? (
          <Select
            label="Linked item"
            name="linkedId"
            value={form.linkedId}
            onChange={handleChange}
          >
            {linkedOptions.length > 0 ? (
              linkedOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))
            ) : (
              <option value="">No linked items available</option>
            )}
          </Select>
        ) : null}
      </div>

      <Textarea
        label="Note content"
        name="content"
        value={form.content}
        onChange={handleChange}
        placeholder="Write clean study notes or quick revision cues"
        required
      />

      <Input
        label="Tags"
        name="tags"
        value={form.tags}
        onChange={handleChange}
        placeholder="biology, revision, exam prep"
      />

      <div className="library-form__actions">
        {note ? (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel edit
          </Button>
        ) : null}
        <Button type="submit" variant="primary">
          {note ? "Update note" : "Save note"}
        </Button>
      </div>
    </form>
  );
}

function NotesPanel() {
  const { notes, addNote, updateNote, deleteNote } = useWorkspaceLibrary();
  const { tasks, studySessions, exams, subjects } = useStudyData();

  const [editingNoteId, setEditingNoteId] = useState(null);
  const [composerVersion, setComposerVersion] = useState(0);

  const editingNote = useMemo(
    () => notes.find((note) => note.id === editingNoteId) ?? null,
    [editingNoteId, notes]
  );

  function handleSave(payload) {
    if (editingNote) {
      updateNote(editingNote.id, payload);
      setEditingNoteId(null);
    } else {
      addNote(payload);
    }

    setComposerVersion((current) => current + 1);
  }

  function handleEdit(note) {
    setEditingNoteId(note.id);
    setComposerVersion((current) => current + 1);
  }

  function handleCancelEdit() {
    setEditingNoteId(null);
    setComposerVersion((current) => current + 1);
  }

  return (
    <Surface className="library-panel">
      <SectionHeader
        eyebrow="Notes"
        title="Study notes"
        description="Capture revision notes and link them to tasks, sessions, exams, or subjects."
        action={<Badge tone="neutral">{notes.length} total</Badge>}
      />

      <NoteComposer
        key={`${editingNote?.id ?? "new"}-${composerVersion}`}
        note={editingNote}
        tasks={tasks}
        studySessions={studySessions}
        exams={exams}
        subjects={subjects}
        onSubmit={handleSave}
        onCancel={handleCancelEdit}
      />

      {notes.length > 0 ? (
        <div className="library-list">
          {notes.map((note) => {
            const linkedLabel = resolveLinkedEntityLabel(note.linkedType, note.linkedId, {
              tasks,
              studySessions,
              exams,
              subjects
            });

            return (
              <article key={note.id} className="library-item">
                <div className="library-item__header">
                  <div>
                    <h3 className="library-item__title">{note.title}</h3>
                    <p className="library-item__subtitle">{linkedLabel}</p>
                  </div>

                  <Badge tone={note.linkedType === "none" ? "neutral" : "accent"}>
                    Note
                  </Badge>
                </div>

                <p className="library-item__description">{note.content}</p>

                {note.tags.length > 0 ? (
                  <div className="library-chip-list">
                    {note.tags.map((tag) => (
                      <span key={tag} className="library-chip">
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="library-item__actions">
                  <Button type="button" variant="ghost" size="sm" onClick={() => handleEdit(note)}>
                    Edit
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => deleteNote(note.id)}>
                    Delete
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No notes saved yet"
          description="Create a premium note set for revision, planning, or exam prep."
        />
      )}
    </Surface>
  );
}

export default NotesPanel;