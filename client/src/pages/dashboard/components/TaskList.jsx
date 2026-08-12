import {
  EmptyState
} from "../../../components/ui";
import {
  formatDueLabel
} from "../../../domain/studyPlanner";
import { useStudyData } from "../../../hooks/useStudyData";
import TaskItem from "./TaskItem";

function TaskList({
  tasks,
  onToggle,
  onEdit,
  onDelete
}) {
  const {
    subjects
  } = useStudyData();

  const subjectMap =
    new Map(
      subjects.map(
        (subject) => [
          subject.id,
          subject.name
        ]
      )
    );

  if (tasks.length === 0) {
    return (
      <div className="task-list-empty">
        <EmptyState
          title="Nothing in this view"
          description="Try another view or add a new task to start building your work queue."
        />
      </div>
    );
  }

  return (
    <div
      className="task-list"
      aria-label="Task list"
    >
      {tasks.map(
        (task) => (
          <TaskItem
            key={task.id}
            task={task}
            subjectName={
              subjectMap.get(
                task.subjectId
              ) ??
              "Unknown subject"
            }
            dueLabel={formatDueLabel(
              task.dueDate
            )}
            onToggle={
              onToggle
            }
            onEdit={
              onEdit
            }
            onDelete={
              onDelete
            }
          />
        )
      )}
    </div>
  );
}

export default TaskList;