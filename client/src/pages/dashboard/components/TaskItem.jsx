import {
  Badge,
  Button
} from "../../../components/ui";

const priorityLabels = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low"
};

function TaskItem({
  task,
  subjectName,
  dueLabel,
  onToggle,
  onEdit,
  onDelete
}) {
  const isComplete =
    task.status === "done";

  const priorityTone =
    task.priority === "critical" ||
    task.priority === "high"
      ? "accent"
      : "neutral";

  const statusLabel =
    isComplete
      ? "Completed"
      : task.status ===
        "in-progress"
      ? "In progress"
      : "Open";

  return (
    <article
      className={`task-item task-item--premium ${
        isComplete
          ? "is-complete"
          : ""
      }`}
    >
      <button
        type="button"
        className={`task-item__check ${
          isComplete
            ? "is-complete"
            : ""
        }`}
        onClick={() =>
          onToggle(
            task.id
          )
        }
        aria-label={
          isComplete
            ? `Reopen ${task.title}`
            : `Mark ${task.title} complete`
        }
      >
        {isComplete
          ? "✓"
          : ""}
      </button>

      <div className="task-item__main">
        <div className="task-item__heading">
          <div className="task-item__title-group">
            <div className="task-item__eyebrow">
              <span>
                {subjectName}
              </span>

              <span aria-hidden="true">
                ·
              </span>

              <span>
                {task.type}
              </span>
            </div>

            <h3 className="task-item__title">
              {task.title}
            </h3>
          </div>

          <div className="task-item__badges">
            <Badge
              tone={priorityTone}
            >
              {
                priorityLabels[
                  task.priority
                ]
              }
            </Badge>

            <Badge
              tone={
                isComplete
                  ? "neutral"
                  : "accent"
              }
            >
              {statusLabel}
            </Badge>
          </div>
        </div>

        <div className="task-item__meta-row">
          <span>
            <strong>
              Due
            </strong>
            {" "}
            {dueLabel}
          </span>

          <span>
            <strong>
              Effort
            </strong>
            {" "}
            {task.effortMinutes}
            {" "}
            min
          </span>
        </div>

        {task.notes ? (
          <p className="task-item__notes">
            {task.notes}
          </p>
        ) : null}

        <div className="task-item__actions">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              onToggle(
                task.id
              )
            }
          >
            {isComplete
              ? "Reopen"
              : "Complete"}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              onEdit(task)
            }
          >
            Edit
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              onDelete(task)
            }
          >
            Delete
          </Button>
        </div>
      </div>
    </article>
  );
}

export default TaskItem;