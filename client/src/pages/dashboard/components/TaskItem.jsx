import { Badge, Button, Surface } from "../../../components/ui";

function TaskItem({ task, subjectName, dueLabel, onToggle, onEdit, onDelete }) {
  const isComplete = task.status === "done";
  const priorityTone =
    task.priority === "critical" || task.priority === "high" ? "accent" : "neutral";

  return (
    <Surface as="article" className={`task-item ${isComplete ? "is-complete" : ""}`}>
      <div className="task-item__top">
        <div className="task-item__content">
          <h3 className="task-item__title">{task.title}</h3>
          <p className="task-item__meta">
            {subjectName} · {dueLabel} · {task.effortMinutes} min
          </p>
          {task.notes ? <p className="task-item__notes">{task.notes}</p> : null}
        </div>

        <div className="task-item__badges">
          <Badge tone={priorityTone}>{task.priority}</Badge>
          <Badge tone={isComplete ? "neutral" : "accent"}>
            {isComplete ? "Done" : "Open"}
          </Badge>
        </div>
      </div>

      <div className="task-item__actions">
        <Button type="button" variant="ghost" size="sm" onClick={() => onToggle(task.id)}>
          {isComplete ? "Reopen" : "Mark done"}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => onEdit(task)}>
          Edit
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => onDelete(task.id)}>
          Delete
        </Button>
      </div>
    </Surface>
  );
}

export default TaskItem;