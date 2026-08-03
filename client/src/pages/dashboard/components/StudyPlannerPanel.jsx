import { useMemo, useState } from "react";
import { Badge, Button, SectionHeader, StatCard, Surface } from "../../../components/ui";
import { useStudyData } from "../../../hooks/useStudyData";
import { buildSessionMetrics, filterSessions } from "../../../domain/studySessionPlanner";
import FocusTimer from "./FocusTimer";
import SessionComposer from "./SessionComposer";
import SessionFilters from "./SessionFilters";
import SessionList from "./SessionList";

const defaultFilters = {
  status: "all",
  subjectId: "all",
  sessionType: "all",
  window: "all"
};

function StudyPlannerPanel() {
  const {
    studySessions,
    subjects,
    addStudySession,
    updateStudySession,
    deleteStudySession,
    toggleStudySessionStatus
  } = useStudyData();

  const [filters, setFilters] = useState(defaultFilters);
  const [editingSessionId, setEditingSessionId] = useState(null);

  const metrics = useMemo(() => buildSessionMetrics(studySessions), [studySessions]);
  const filteredSessions = useMemo(
    () => filterSessions(studySessions, filters),
    [studySessions, filters]
  );

  const editingSession = editingSessionId
    ? studySessions.find((session) => session.id === editingSessionId) ?? null
    : null;

  function handleSubmit(formValue) {
    if (editingSession) {
      updateStudySession(editingSession.id, formValue);
      setEditingSessionId(null);
      return;
    }

    addStudySession(formValue);
  }

  function handleEdit(session) {
    setEditingSessionId(session.id);
  }

  function handleCancelEdit() {
    setEditingSessionId(null);
  }

  function handleResetFilters() {
    setFilters(defaultFilters);
  }

  return (
    <Surface className="study-planner">
      <SectionHeader
        eyebrow="Planner"
        title="Study session planner"
        description="Build a weekly rhythm with focus blocks, revision sessions, and study reminders."
        action={
          <div className="study-planner__header-action">
            <Badge tone="accent">{metrics.totalSessions} sessions</Badge>
            <Button type="button" variant="ghost" size="sm" onClick={handleResetFilters}>
              Reset filters
            </Button>
          </div>
        }
      />

      <div className="study-planner__summary">
        <StatCard label="Planned" value={String(metrics.plannedSessions)} detail="Upcoming sessions" />
        <StatCard label="Completed" value={String(metrics.completedSessions)} detail="Tracked sessions" />
        <StatCard label="Today" value={String(metrics.todaySessions)} detail="Sessions scheduled today" />
        <StatCard label="Focus minutes" value={String(metrics.focusMinutes)} detail="Planned study time" />
      </div>

      <div className="study-planner__grid">
        <FocusTimer
          key={metrics.nextSession?.id ?? "focus-timer"}
          defaultMinutes={metrics.nextSession?.durationMinutes ?? 50}
        />

        <SessionComposer
          key={editingSession?.id ?? "new-session"}
          subjects={subjects}
          editingSession={editingSession}
          onSubmit={handleSubmit}
          onCancel={handleCancelEdit}
        />
      </div>

      <SessionFilters
        filters={filters}
        subjects={subjects}
        onChange={setFilters}
        onClear={handleResetFilters}
      />

      <SessionList
        sessions={filteredSessions}
        onToggle={toggleStudySessionStatus}
        onEdit={handleEdit}
        onDelete={deleteStudySession}
      />
    </Surface>
  );
}

export default StudyPlannerPanel;