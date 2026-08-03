import { useMemo, useState } from "react";
import {
  Button,
  Input,
  SectionHeader,
  Select,
  Surface,
  Textarea
} from "../../../components/ui";
import {
  combineDateAndTime,
  createDefaultSessionSchedule,
  splitDateAndTime
} from "../../../domain/studySessionPlanner";

function buildDefaultSession(subjectId = "") {
  const schedule = createDefaultSessionSchedule(2);

  return {
    title: "",
    notes: "",
    subjectId,
    scheduledDate: schedule.scheduledDate,
    scheduledTime: schedule.scheduledTime,
    durationMinutes: 50,
    status: "planned",
    sessionType: "focus"
  };
}

function buildEditingSession(editingSession, subjectId = "") {
  if (!editingSession) {
    return buildDefaultSession(subjectId);
  }

  return {
    title: editingSession.title ?? "",
    notes: editingSession.notes ?? "",
    subjectId: editingSession.subjectId ?? subjectId,
    ...splitDateAndTime(editingSession.scheduledFor),
    durationMinutes: editingSession.durationMinutes ?? 50,
    status: editingSession.status ?? "planned",
    sessionType: editingSession.sessionType ?? "focus"
  };
}

function SessionComposer({ subjects, editingSession, onSubmit, onCancel }) {
  const initialSubjectId = subjects[0]?.id ?? "";
  const initialForm = useMemo(
    () => buildEditingSession(editingSession, initialSubjectId),
    [editingSession, initialSubjectId]
  );

  const [form, setForm] = useState(initialForm);

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
      title: form.title.trim(),
      notes: form.notes.trim(),
      subjectId: form.subjectId,
      scheduledFor: combineDateAndTime(form.scheduledDate, form.scheduledTime),
      durationMinutes: Number(form.durationMinutes),
      status: form.status,
      sessionType: form.sessionType
    });

    if (!editingSession) {
      setForm(buildDefaultSession(initialSubjectId));
    }
  }

  return (
    <Surface className="session-composer">
      <SectionHeader
        eyebrow="Planner"
        title={editingSession ? "Edit study session" : "Create study session"}
        description="Plan focused study blocks with clear time and subject context."
        action={
          editingSession ? (
            <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
              Cancel edit
            </Button>
          ) : null
        }
      />

      <form className="session-form" onSubmit={handleSubmit}>
        <div className="session-form-grid">
          <Input
            label="Session title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Biology focus block"
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
            label="Date"
            name="scheduledDate"
            type="date"
            value={form.scheduledDate}
            onChange={handleChange}
            required
          />

          <Input
            label="Time"
            name="scheduledTime"
            type="time"
            value={form.scheduledTime}
            onChange={handleChange}
            required
          />

          <Input
            label="Duration"
            name="durationMinutes"
            type="number"
            min="10"
            step="5"
            value={form.durationMinutes}
            onChange={handleChange}
            required
          />

          <Select
            label="Status"
            name="status"
            value={form.status}
            onChange={handleChange}
            required
          >
            <option value="planned">Planned</option>
            <option value="completed">Completed</option>
          </Select>

          <Select
            label="Type"
            name="sessionType"
            value={form.sessionType}
            onChange={handleChange}
            required
          >
            <option value="focus">Focus</option>
            <option value="revision">Revision</option>
            <option value="reading">Reading</option>
            <option value="practice">Practice</option>
          </Select>
        </div>

        <Textarea
          label="Notes"
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Add reminders, reading links, or study goals"
        />

        <div className="session-form__actions">
          <Button type="submit" variant="primary">
            {editingSession ? "Save session" : "Add session"}
          </Button>
        </div>
      </form>
    </Surface>
  );
}

export default SessionComposer;