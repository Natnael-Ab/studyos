import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { studySeed } from "../data/studySeed";

const StudyDataContext = createContext(null);
const storageKey = "studyos.tasks.v1";

function createId(prefix) {
  const randomId =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(16).slice(2);

  return `${prefix}-${randomId}`;
}

function readStoredTasks() {
  if (typeof window === "undefined") {
    return studySeed.tasks;
  }

  try {
    const raw = window.localStorage.getItem(storageKey);

    if (!raw) {
      return studySeed.tasks;
    }

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return studySeed.tasks;
    }

    return parsed;
  } catch {
    return studySeed.tasks;
  }
}

function StudyDataProvider({ children }) {
  const [tasks, setTasks] = useState(readStoredTasks);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = useCallback((taskInput) => {
    const now = new Date().toISOString();

    const nextTask = {
      id: createId("task"),
      title: taskInput.title.trim(),
      notes: taskInput.notes.trim(),
      subjectId: taskInput.subjectId,
      priority: taskInput.priority,
      status: taskInput.status,
      dueDate: taskInput.dueDate,
      effortMinutes: Number(taskInput.effortMinutes),
      type: taskInput.type,
      createdAt: now,
      updatedAt: now
    };

    setTasks((current) => [nextTask, ...current]);
    return nextTask;
  }, []);

  const updateTask = useCallback((taskId, updates) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId
          ? {
              ...task,
              ...updates,
              title: updates.title.trim(),
              notes: updates.notes.trim(),
              effortMinutes: Number(updates.effortMinutes),
              updatedAt: new Date().toISOString()
            }
          : task
      )
    );
  }, []);

  const deleteTask = useCallback((taskId) => {
    setTasks((current) => current.filter((task) => task.id !== taskId));
  }, []);

  const toggleTaskStatus = useCallback((taskId) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: task.status === "done" ? "todo" : "done",
              updatedAt: new Date().toISOString()
            }
          : task
      )
    );
  }, []);

  const value = useMemo(
    () => ({
      student: studySeed.student,
      subjects: studySeed.subjects,
      studySessions: studySeed.studySessions,
      exams: studySeed.exams,
      tasks,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskStatus
    }),
    [addTask, deleteTask, tasks, toggleTaskStatus, updateTask]
  );

  return (
    <StudyDataContext.Provider value={value}>
      {children}
    </StudyDataContext.Provider>
  );
}

export { StudyDataContext, StudyDataProvider };