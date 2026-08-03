import { useMemo, useState } from "react";
import {
  Button,
  Input,
  SectionHeader,
  Select,
  Surface,
  Textarea
} from "../../../components/ui";
import { createDefaultDueDate, toDateInputValue } from "../../../domain/taskManager";

const buildDefaultTask = (subjectId = "") => ({
  title: "",
  notes: "",
  subjectId,
  priority: "medium",
  status: "todo",
  dueDate: createDefaultDueDate(1),
  effortMinutes: 30,
  type: "study"
});

function TaskComposer({ subjects, editingTask, onSubmit, onCancel }) {
  const initialSubjectId = subjects[0]?.id ?? "";

  const initialForm = useMemo(() => {
    if (editingTask) {
      return {
        title: editingTask.title ?? "",
        notes: editingTask.notes ?? "",
        subjectId: editingTask.subjectId ?? initialSubjectId,
        priority: editingTask.priority ?? "medium",
        status: editingTask.status ?? "todo",
        dueDate: editingTask.dueDate ?? createDefaultDueDate(1),
        effortMinutes: editingTask.effortMinutes ?? 30,
        type: editingTask.type ?? "study"
      };
    }

    return buildDefaultTask(initialSubjectId);
  }, [editingTask, initialSubjectId]);

  const [form, setForm] = useState(initialForm);

  const title = editingTask ? "Edit task" : "Create task";

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    onSubmit({
      ...form,
      title: form.title.trim(),
      notes: form.notes.trim(),
      effortMinutes: Number(form.effortMinutes),
      dueDate: toDateInputValue(form.dueDate)
    });

    if (!editingTask) {
      setForm(buildDefaultTask(initialSubjectId));
    }
  }

  return (
    <Surface className="task-composer">
      <SectionHeader
        eyebrow="Task builder"
        title={title}
        description="Create assignments, revision items, and project work with clear deadlines."
        action={
          editingTask ? (
            <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
              Cancel edit
            </Button>
          ) : null
        }
      />

      <form className="task-form" onSubmit={handleSubmit}>
        <div className="task-form-grid">
          <Input
            label="Task title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Prepare chemistry summary"
            required
          />

          <Select
            label="Subject"
            name="subjectId"
            value={form.subjectId}
            onChange={handleChange}
            required
          >
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </Select>

          <Input
            label="Due date"
            name="dueDate"
            type="date"
            value={form.dueDate}
            onChange={handleChange}
            required
          />

          <Input
            label="Effort"
            name="effortMinutes"
            type="number"
            min="10"
            step="5"
            value={form.effortMinutes}
            onChange={handleChange}
            required
          />

          <Select
            label="Priority"
            name="priority"
            value={form.priority}
            onChange={handleChange}
            required
          >
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </Select>

          <Select
            label="Status"
            name="status"
            value={form.status}
            onChange={handleChange}
            required
          >
            <option value="todo">To do</option>
            <option value="in-progress">In progress</option>
            <option value="done">Done</option>
          </Select>

          <Select
            label="Type"
            name="type"
            value={form.type}
            onChange={handleChange}
            required
          >
            <option value="assignment">Assignment</option>
            <option value="revision">Revision</option>
            <option value="study">Study</option>
            <option value="project">Project</option>
          </Select>
        </div>

        <Textarea
          label="Notes"
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Add quick instructions, links, or reminders"
        />

        <div className="task-form__actions">
          <Button type="submit" variant="primary">
            {editingTask ? "Save changes" : "Add task"}
          </Button>
        </div>
      </form>
    </Surface>
  );
}

export default TaskComposer;