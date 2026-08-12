import { useMemo, useState } from "react";
import {
  Button,
  Input,
  Select,
  Textarea
} from "../../../components/ui";
import {
  createDefaultDueDate,
  toDateInputValue
} from "../../../domain/taskManager";

const buildDefaultTask = (
  subjectId = ""
) => ({
  title: "",
  notes: "",
  subjectId,
  priority: "medium",
  status: "todo",
  dueDate:
    createDefaultDueDate(1),
  effortMinutes: 30,
  type: "study"
});

function TaskComposer({
  subjects,
  editingTask,
  onSubmit,
  onCancel
}) {
  const initialSubjectId =
    subjects[0]?.id ?? "";

  const initialForm = useMemo(
    () => {
      if (editingTask) {
        return {
          title:
            editingTask.title ??
            "",
          notes:
            editingTask.notes ??
            "",
          subjectId:
            editingTask.subjectId ??
            initialSubjectId,
          priority:
            editingTask.priority ??
            "medium",
          status:
            editingTask.status ??
            "todo",
          dueDate:
            editingTask.dueDate ??
            createDefaultDueDate(1),
          effortMinutes:
            editingTask.effortMinutes ??
            30,
          type:
            editingTask.type ??
            "study"
        };
      }

      return buildDefaultTask(
        initialSubjectId
      );
    },
    [
      editingTask,
      initialSubjectId
    ]
  );

  const [form, setForm] =
    useState(initialForm);

  const [error, setError] =
    useState("");

  const isEditing =
    Boolean(editingTask);

  function handleChange(event) {
    const {
      name,
      value
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value
    }));

    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    const title =
      form.title.trim();

    if (!title) {
      setError(
        "Give the task a clear title before saving."
      );
      return;
    }

    const effortMinutes =
      Number(
        form.effortMinutes
      );

    if (
      !Number.isFinite(
        effortMinutes
      ) ||
      effortMinutes < 10
    ) {
      setError(
        "Effort must be at least 10 minutes."
      );
      return;
    }

    if (!form.subjectId) {
      setError(
        "Choose the subject this task belongs to."
      );
      return;
    }

    onSubmit({
      ...form,
      title,
      notes:
        form.notes.trim(),
      effortMinutes,
      dueDate:
        toDateInputValue(
          form.dueDate
        )
    });
  }

  return (
    <section
      className={`task-composer ${
        isEditing
          ? "task-composer--editing"
          : ""
      }`}
      aria-labelledby="task-composer-title"
    >
      <div className="task-composer__header">
        <div>
          <span className="task-composer__eyebrow">
            {isEditing
              ? "Editing task"
              : "Quick task builder"}
          </span>

          <h3 id="task-composer-title">
            {isEditing
              ? "Refine the task."
              : "Capture the next thing."}
          </h3>

          <p>
            {isEditing
              ? "Update only what changed. Everything else stays connected."
              : "Start with the essentials. Add notes and context without leaving the workflow."}
          </p>
        </div>

        {isEditing ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
          >
            Cancel
          </Button>
        ) : null}
      </div>

      <form
        className="task-composer__form"
        onSubmit={handleSubmit}
      >
        <div className="task-composer__primary">
          <Input
            label="Task title"
            name="title"
            value={form.title}
            onChange={
              handleChange
            }
            placeholder="What needs to happen?"
            autoFocus
            required
          />

          <div className="task-composer__primary-grid">
            <Select
              label="Subject"
              name="subjectId"
              value={
                form.subjectId
              }
              onChange={
                handleChange
              }
              required
            >
              {subjects.map(
                (subject) => (
                  <option
                    key={
                      subject.id
                    }
                    value={
                      subject.id
                    }
                  >
                    {subject.name}
                  </option>
                )
              )}
            </Select>

            <Input
              label="Due"
              name="dueDate"
              type="date"
              value={
                form.dueDate
              }
              onChange={
                handleChange
              }
              required
            />

            <Select
              label="Priority"
              name="priority"
              value={
                form.priority
              }
              onChange={
                handleChange
              }
            >
              <option value="critical">
                Critical
              </option>
              <option value="high">
                High
              </option>
              <option value="medium">
                Medium
              </option>
              <option value="low">
                Low
              </option>
            </Select>

            <Input
              label="Effort"
              name="effortMinutes"
              type="number"
              min="10"
              step="5"
              value={
                form.effortMinutes
              }
              onChange={
                handleChange
              }
              required
            />
          </div>
        </div>

        <div className="task-composer__secondary">
          <div className="task-composer__secondary-grid">
            <Select
              label="Type"
              name="type"
              value={form.type}
              onChange={
                handleChange
              }
            >
              <option value="assignment">
                Assignment
              </option>
              <option value="revision">
                Revision
              </option>
              <option value="study">
                Study
              </option>
              <option value="project">
                Project
              </option>
            </Select>

            {isEditing ? (
              <Select
                label="Status"
                name="status"
                value={
                  form.status
                }
                onChange={
                  handleChange
                }
              >
                <option value="todo">
                  To do
                </option>
                <option value="in-progress">
                  In progress
                </option>
                <option value="done">
                  Completed
                </option>
              </Select>
            ) : null}
          </div>

          <Textarea
            label="Notes"
            name="notes"
            value={form.notes}
            onChange={
              handleChange
            }
            placeholder="Optional context, instructions, links, or reminders"
          />
        </div>

        {error ? (
          <div
            className="task-composer__error"
            role="alert"
          >
            {error}
          </div>
        ) : null}

        <div className="task-composer__footer">
          <span>
            {isEditing
              ? "Changes stay local until the backend is connected."
              : "A small task with a clear next action is better than a perfect plan."}
          </span>

          <Button
            type="submit"
            variant="primary"
          >
            {isEditing
              ? "Save changes"
              : "Add task"}

            <span aria-hidden="true">
              ↗
            </span>
          </Button>
        </div>
      </form>
    </section>
  );
}

export default TaskComposer;