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

const attachmentKindOptions = [
  { value: "pdf", label: "PDF" },
  { value: "slide", label: "Slide" },
  { value: "doc", label: "Document" },
  { value: "image", label: "Image" },
  { value: "link", label: "Link" },
  { value: "other", label: "Other" }
];

function createDefaultAttachmentForm() {
  return {
    title: "",
    reference: "",
    kind: "pdf",
    notes: "",
    linkedType: "none",
    linkedId: ""
  };
}

function buildAttachmentForm(attachment) {
  if (!attachment) {
    return createDefaultAttachmentForm();
  }

  return {
    title: attachment.title ?? "",
    reference: attachment.reference ?? "",
    kind: attachment.kind ?? "pdf",
    notes: attachment.notes ?? "",
    linkedType: attachment.linkedType ?? "none",
    linkedId: attachment.linkedId ?? ""
  };
}

function AttachmentComposer({
  attachment,
  tasks,
  studySessions,
  exams,
  subjects,
  onSubmit,
  onCancel
}) {
  const [form, setForm] = useState(() => buildAttachmentForm(attachment));

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
      reference: form.reference.trim(),
      kind: form.kind,
      notes: form.notes.trim(),
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
          placeholder="e.g. Assignment screenshots"
          required
        />

        <Input
          label="Reference"
          name="reference"
          value={form.reference}
          onChange={handleChange}
          placeholder="e.g. biology-notes.pdf"
          required
        />

        <Select label="Kind" name="kind" value={form.kind} onChange={handleChange}>
          {attachmentKindOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>

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
        label="Notes"
        name="notes"
        value={form.notes}
        onChange={handleChange}
        placeholder="Add a short note about this attachment"
      />

      <div className="library-form__actions">
        {attachment ? (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel edit
          </Button>
        ) : null}
        <Button type="submit" variant="primary">
          {attachment ? "Update attachment" : "Save attachment"}
        </Button>
      </div>
    </form>
  );
}

function AttachmentsPanel() {
  const { attachments, addAttachment, updateAttachment, deleteAttachment } =
    useWorkspaceLibrary();
  const { tasks, studySessions, exams, subjects } = useStudyData();

  const [editingAttachmentId, setEditingAttachmentId] = useState(null);
  const [composerVersion, setComposerVersion] = useState(0);

  const editingAttachment = useMemo(
    () => attachments.find((attachment) => attachment.id === editingAttachmentId) ?? null,
    [attachments, editingAttachmentId]
  );

  function handleSave(payload) {
    if (editingAttachment) {
      updateAttachment(editingAttachment.id, payload);
      setEditingAttachmentId(null);
    } else {
      addAttachment(payload);
    }

    setComposerVersion((current) => current + 1);
  }

  function handleEdit(attachment) {
    setEditingAttachmentId(attachment.id);
    setComposerVersion((current) => current + 1);
  }

  function handleCancelEdit() {
    setEditingAttachmentId(null);
    setComposerVersion((current) => current + 1);
  }

  return (
    <Surface className="library-panel">
      <SectionHeader
        eyebrow="Attachments"
        title="Attachment records"
        description="Keep file references and attachment notes organized for later sync and export."
        action={<Badge tone="neutral">{attachments.length} total</Badge>}
      />

      <AttachmentComposer
        key={`${editingAttachment?.id ?? "new"}-${composerVersion}`}
        attachment={editingAttachment}
        tasks={tasks}
        studySessions={studySessions}
        exams={exams}
        subjects={subjects}
        onSubmit={handleSave}
        onCancel={handleCancelEdit}
      />

      {attachments.length > 0 ? (
        <div className="library-list">
          {attachments.map((attachment) => {
            const linkedLabel = resolveLinkedEntityLabel(
              attachment.linkedType,
              attachment.linkedId,
              {
                tasks,
                studySessions,
                exams,
                subjects
              }
            );

            return (
              <article key={attachment.id} className="library-item">
                <div className="library-item__header">
                  <div>
                    <h3 className="library-item__title">{attachment.title}</h3>
                    <p className="library-item__subtitle">
                      {attachment.reference} · {linkedLabel}
                    </p>
                  </div>

                  <Badge tone={attachment.linkedType === "none" ? "neutral" : "accent"}>
                    {attachment.kind}
                  </Badge>
                </div>

                {attachment.notes ? (
                  <p className="library-item__description">{attachment.notes}</p>
                ) : null}

                <div className="library-item__actions">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(attachment)}
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteAttachment(attachment.id)}
                  >
                    Delete
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No attachments recorded yet"
          description="Track filenames and source references in a clean record system."
        />
      )}
    </Surface>
  );
}

export default AttachmentsPanel;