import { EmptyState } from "../../../components/ui";
import { useStudyData } from "../../../hooks/useStudyData";
import SessionItem from "./SessionItem";

function SessionList({ sessions, onToggle, onEdit, onDelete }) {
  const { subjects } = useStudyData();
  const subjectMap = new Map(subjects.map((subject) => [subject.id, subject.name]));

  if (sessions.length === 0) {
    return (
      <EmptyState
        title="No sessions match the current filters"
        description="Change the filters or add a new session to build the study plan."
      />
    );
  }

  return (
    <div className="session-list">
      {sessions.map((session) => (
        <SessionItem
          key={session.id}
          session={session}
          subjectName={subjectMap.get(session.subjectId) ?? "Unknown subject"}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default SessionList;