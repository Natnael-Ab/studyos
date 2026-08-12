import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Surface
} from "../../../components/ui";
import {
  buildTaskMetrics,
  filterTasks
} from "../../../domain/taskManager";
import { useStudyData } from "../../../hooks/useStudyData";
import { useUiFeedback } from "../../../hooks/useUiFeedback";
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
  const {
    tasks,
    subjects,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus
  } = useStudyData();

  const {
    confirm,
    pushToast
  } = useUiFeedback();

  const [filters, setFilters] =
    useState(defaultFilters);

  const [editingTaskId, setEditingTaskId] =
    useState(null);

  const [composerOpen, setComposerOpen] =
    useState(false);

  const metrics = useMemo(
    () =>
      buildTaskMetrics(tasks),
    [tasks]
  );

  const filteredTasks = useMemo(
    () =>
      filterTasks(
        tasks,
        filters
      ),
    [tasks, filters]
  );

  const editingTask =
    editingTaskId
      ? tasks.find(
          (task) =>
            task.id ===
            editingTaskId
        ) ?? null
      : null;

  const activeFilterCount =
    Object.values(filters).filter(
      (value) =>
        value !== "all"
    ).length;

  function handleSubmit(formValue) {
    if (editingTask) {
      updateTask(
        editingTask.id,
        formValue
      );

      setEditingTaskId(null);
      setComposerOpen(false);

      pushToast({
        title: "Task updated",
        message:
          "Your task changes are saved.",
        tone: "neutral"
      });

      return;
    }

    addTask(formValue);
    setComposerOpen(false);

    pushToast({
      title: "Task added",
      message:
        "The task is now part of your workspace.",
      tone: "accent"
    });
  }

  function handleEdit(task) {
    setEditingTaskId(task.id);
    setComposerOpen(true);

    window.requestAnimationFrame(() => {
      document
        .querySelector(
          ".task-composer"
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
    });
  }

  function handleCancelEdit() {
    setEditingTaskId(null);
    setComposerOpen(false);
  }

  async function handleDelete(task) {
    const confirmed =
      await confirm({
        title: "Delete this task?",
        description:
          `"${task.title}" will be removed from your workspace. This cannot be undone.`,
        confirmLabel:
          "Delete task",
        cancelLabel:
          "Keep task",
        tone: "accent"
      });

    if (!confirmed) {
      return;
    }

    deleteTask(task.id);

    if (
      editingTaskId ===
      task.id
    ) {
      setEditingTaskId(null);
      setComposerOpen(false);
    }

    pushToast({
      title: "Task deleted",
      message:
        "The task was removed from your workspace.",
      tone: "neutral"
    });
  }

  function handleResetFilters() {
    setFilters(defaultFilters);
  }

  function handleToggleComposer() {
    setEditingTaskId(null);

    setComposerOpen(
      (current) =>
        !current
    );
  }

  return (
    <section
      className="task-workspace"
      aria-labelledby="task-workspace-title"
    >
      <div className="task-workspace__header">
        <div className="task-workspace__heading">
          <span className="task-workspace__eyebrow">
            Work queue
          </span>

          <h2 id="task-workspace-title">
            Tasks that move your semester forward.
          </h2>

          <p>
            Capture the next thing quickly, then add detail
            only when the task needs it.
          </p>
        </div>

        <div className="task-workspace__actions">
          <Badge tone="accent">
            {metrics.openTasks} open
          </Badge>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={
              handleToggleComposer
            }
          >
            {composerOpen
              ? "Close builder"
              : "Add task"}
          </Button>
        </div>
      </div>

      <div className="task-workspace__metrics">
        <div className="task-workspace__metric">
          <span>Open</span>
          <strong>
            {metrics.openTasks}
          </strong>
        </div>

        <div className="task-workspace__metric">
          <span>Due soon</span>
          <strong>
            {metrics.dueSoonTasks}
          </strong>
        </div>

        <div className="task-workspace__metric task-workspace__metric--attention">
          <span>Overdue</span>
          <strong>
            {metrics.overdueTasks}
          </strong>
        </div>

        <div className="task-workspace__metric">
          <span>Completed</span>
          <strong>
            {metrics.completedTasks}
          </strong>
        </div>
      </div>

      {composerOpen ? (
        <TaskComposer
          key={
            editingTask?.id ??
            "new"
          }
          subjects={subjects}
          editingTask={editingTask}
          onSubmit={handleSubmit}
          onCancel={
            handleCancelEdit
          }
        />
      ) : (
        <button
          type="button"
          className="task-quick-capture"
          onClick={() => {
            setEditingTaskId(null);
            setComposerOpen(true);
          }}
        >
          <span className="task-quick-capture__plus">
            +
          </span>

          <span className="task-quick-capture__copy">
            <strong>
              Add the next thing
            </strong>

            <span>
              Start with a title. Add the rest when it matters.
            </span>
          </span>

          <span className="task-quick-capture__hint">
            Enter
          </span>
        </button>
      )}

      <Surface className="task-filter-bar">
        <TaskFilters
          filters={filters}
          subjects={subjects}
          onChange={setFilters}
          onClear={
            handleResetFilters
          }
          activeFilterCount={
            activeFilterCount
          }
        />
      </Surface>

      <TaskList
        tasks={filteredTasks}
        onToggle={
          toggleTaskStatus
        }
        onEdit={handleEdit}
        onDelete={
          handleDelete
        }
      />
    </section>
  );
}

export default TaskManagerPanel;