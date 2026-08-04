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

const resourceCategoryOptions = [
  { value: "reference", label: "Reference" },
  { value: "lecture", label: "Lecture" },
  { value: "tutorial", label: "Tutorial" },
  { value: "tool", label: "Tool" },
  { value: "reading", label: "Reading" },
  { value: "portfolio", label: "Portfolio" },
  { value: "other", label: "Other" }
];

function createDefaultResourceForm(subjectId = "") {
  return {
    title: "",
    url: "",
    description: "",
    category: "reference",
    subjectId,
    linkedType: "none",
    linkedId: ""
  };
}

function buildResourceForm(resource, subjectId = "") {
  if (!resource) {
    return createDefaultResourceForm(subjectId);
  }

  return {
    title: resource.title ?? "",
    url: resource.url ?? "",
    description: resource.description ?? "",
    category: resource.category ?? "reference",
    subjectId: resource.subjectId ?? subjectId,
    linkedType: resource.linkedType ?? "none",
    linkedId: resource.linkedId ?? ""
  };
}

function ResourceComposer({
  resource,
  initialSubjectId,
  tasks,
  studySessions,
  exams,
  subjects,
  onSubmit,
  onCancel
}) {
  const [form, setForm] = useState(() => buildResourceForm(resource, initialSubjectId));

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
      url: form.url.trim(),
      description: form.description.trim(),
      category: form.category,
      subjectId: form.subjectId,
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
          placeholder="e.g. Biology lecture slides"
          required
        />

        <Input
          label="URL"
          name="url"
          type="url"
          value={form.url}
          onChange={handleChange}
          placeholder="https://..."
          required
        />

        <Select
          label="Category"
          name="category"
          value={form.category}
          onChange={handleChange}
        >
          {resourceCategoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>

        <Select
          label="Subject"
          name="subjectId"
          value={form.subjectId}
          onChange={handleChange}
        >
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
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
        label="Description"
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Add a short explanation of why this resource matters"
      />

      <div className="library-form__actions">
        {resource ? (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel edit
          </Button>
        ) : null}
        <Button type="submit" variant="primary">
          {resource ? "Update resource" : "Save resource"}
        </Button>
      </div>
    </form>
  );
}

function ResourcesPanel() {
  const { resources, addResource, updateResource, deleteResource } = useWorkspaceLibrary();
  const { tasks, studySessions, exams, subjects } = useStudyData();

  const initialSubjectId = subjects[0]?.id ?? "";
  const [editingResourceId, setEditingResourceId] = useState(null);
  const [composerVersion, setComposerVersion] = useState(0);

  const editingResource = useMemo(
    () => resources.find((resource) => resource.id === editingResourceId) ?? null,
    [editingResourceId, resources]
  );

  function handleSave(payload) {
    if (editingResource) {
      updateResource(editingResource.id, payload);
      setEditingResourceId(null);
    } else {
      addResource(payload);
    }

    setComposerVersion((current) => current + 1);
  }

  function handleEdit(resource) {
    setEditingResourceId(resource.id);
    setComposerVersion((current) => current + 1);
  }

  function handleCancelEdit() {
    setEditingResourceId(null);
    setComposerVersion((current) => current + 1);
  }

  return (
    <Surface className="library-panel">
      <SectionHeader
        eyebrow="Resources"
        title="Reference library"
        description="Keep reading links, tools, and study references connected to your subjects."
        action={<Badge tone="neutral">{resources.length} total</Badge>}
      />

      <ResourceComposer
        key={`${editingResource?.id ?? "new"}-${composerVersion}`}
        resource={editingResource}
        initialSubjectId={initialSubjectId}
        tasks={tasks}
        studySessions={studySessions}
        exams={exams}
        subjects={subjects}
        onSubmit={handleSave}
        onCancel={handleCancelEdit}
      />

      {resources.length > 0 ? (
        <div className="library-list">
          {resources.map((resource) => {
            const subject = subjects.find((item) => item.id === resource.subjectId);
            const linkedLabel = resolveLinkedEntityLabel(resource.linkedType, resource.linkedId, {
              tasks,
              studySessions,
              exams,
              subjects
            });

            return (
              <article key={resource.id} className="library-item">
                <div className="library-item__header">
                  <div>
                    <h3 className="library-item__title">{resource.title}</h3>
                    <p className="library-item__subtitle">
                      {resource.category} · {subject ? subject.name : "Unassigned subject"} · {linkedLabel}
                    </p>
                  </div>

                  <Badge tone={resource.linkedType === "none" ? "neutral" : "accent"}>
                    Resource
                  </Badge>
                </div>

                {resource.description ? (
                  <p className="library-item__description">{resource.description}</p>
                ) : null}

                <a
                  className="library-link"
                  href={resource.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {resource.url}
                </a>

                <div className="library-item__actions">
                  <Button type="button" variant="ghost" size="sm" onClick={() => handleEdit(resource)}>
                    Edit
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => deleteResource(resource.id)}>
                    Delete
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No resources saved yet"
          description="Collect reading links, tools, and study references in one refined place."
        />
      )}
    </Surface>
  );
}

export default ResourcesPanel;