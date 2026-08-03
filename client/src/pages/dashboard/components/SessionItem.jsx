import { Badge, Button, Surface } from "../../../components/ui";
import { formatSessionDateLabel, formatSessionTypeLabel } from "../../../domain/studySessionPlanner";

function SessionItem({ session, subjectName, onToggle, onEdit, onDelete }) {
  const isComplete = session.status === "completed";

  return (
    <Surface as="article" className={`session-item ${isComplete ? "is-complete" : ""}`}>
      <div className="session-item__top">
        <div className="session-item__content">
          <h3 className="session-item__title">{session.title}</h3>
          <p className="session-item__meta">
            {subjectName} · {formatSessionDateLabel(session.scheduledFor)} · {session.durationMinutes} min
          </p>
          {session.notes ? <p className="session-item__notes">{session.notes}</p> : null}
        </div>

        <div className="session-item__badges">
          <Badge tone="neutral">{formatSessionTypeLabel(session.sessionType)}</Badge>
          <Badge tone={isComplete ? "neutral" : "accent"}>
            {isComplete ? "Done" : "Planned"}
          </Badge>
        </div>
      </div>

      <div className="session-item__actions">
        <Button type="button" variant="ghost" size="sm" onClick={() => onToggle(session.id)}>
          {isComplete ? "Reopen" : "Mark done"}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => onEdit(session)}>
          Edit
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => onDelete(session.id)}>
          Delete
        </Button>
      </div>
    </Surface>
  );
}

export default SessionItem;