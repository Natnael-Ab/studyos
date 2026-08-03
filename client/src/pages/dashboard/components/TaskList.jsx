import { EmptyState } from "../../../components/ui";
import { formatDueLabel } from "../../../domain/studyPlanner";
import { useStudyData } from "../../../hooks/useStudyData";
import TaskItem from "./TaskItem";

function TaskList({ tasks, onToggle, onEdit, onDelete }) {
  const { subjects } = useStudyData();
  const subjectMap = new Map(subjects.map((subject) => [subject.id, subject.name]));

  if (tasks.length === 0) {
    return (
      <EmptyState
        title="No tasks match the current filters"
        description="Try clearing filters or create a new task to populate this area."
      />
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          subjectName={subjectMap.get(task.subjectId) ?? "Unknown subject"}
          dueLabel={formatDueLabel(task.dueDate)}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default TaskList;