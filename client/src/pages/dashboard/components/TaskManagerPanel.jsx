import { useMemo, useState } from "react";
import { Badge, Button, SectionHeader, Surface } from "../../../components/ui";
import { buildTaskMetrics, filterTasks } from "../../../domain/taskManager";
import { useStudyData } from "../../../hooks/useStudyData";
import DeadlineSummary from "./DeadlineSummary";
import TaskComposer from "./TaskComposer";
import TaskFilters from "./TaskFilters";
import TaskList from "./TaskList";

const defaultFilters = {
  status: "all",
  priority: "all",
  subjectId: "all",
  deadline: "all"
};

function TaskManagerPanel() {
  const { tasks, subjects, addTask, updateTask, deleteTask, toggleTaskStatus } =
    useStudyData();
  const [filters, setFilters] = useState(defaultFilters);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const metrics = useMemo(() => buildTaskMetrics(tasks), [tasks]);
  const filteredTasks = useMemo(() => filterTasks(tasks, filters), [tasks, filters]);

  const editingTask = editingTaskId
    ? tasks.find((task) => task.id === editingTaskId) ?? null
    : null;

  function handleSubmit(formValue) {
    if (editingTask) {
      updateTask(editingTask.id, formValue);
      setEditingTaskId(null);
      return;
    }

    addTask(formValue);
  }

  function handleEdit(task) {
    setEditingTaskId(task.id);
  }

  function handleCancelEdit() {
    setEditingTaskId(null);
  }

  function handleResetFilters() {
    setFilters(defaultFilters);
  }

  return (
    <Surface className="task-manager">
      <SectionHeader
        eyebrow="Tasks"
        title="Task and deadline system"
        description="Create, organize, and complete assignments with clear deadline awareness."
        action={
          <div className="task-manager__header-action">
            <Badge tone="accent">{metrics.openTasks} open</Badge>
            <Button type="button" variant="ghost" size="sm" onClick={handleResetFilters}>
              Reset filters
            </Button>
          </div>
        }
      />

      <DeadlineSummary />

      <TaskComposer
        key={editingTask?.id ?? "new"}
        subjects={subjects}
        editingTask={editingTask}
        onSubmit={handleSubmit}
        onCancel={handleCancelEdit}
      />

      <TaskFilters
        filters={filters}
        subjects={subjects}
        onChange={setFilters}
        onClear={handleResetFilters}
      />

      <TaskList
        tasks={filteredTasks}
        onToggle={toggleTaskStatus}
        onEdit={handleEdit}
        onDelete={deleteTask}
      />
    </Surface>
  );
}

export default TaskManagerPanel;