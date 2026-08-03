import { useCallback, useEffect, useMemo, useState } from "react";
import StudyDataContext from "./StudyDataContext";
import { createId, persistWorkspace, readStoredWorkspace } from "./studyWorkspaceStorage";
import { studySeed } from "../data/studySeed";

function StudyDataProvider({ children }) {
  const initialWorkspace = readStoredWorkspace();
  const [tasks, setTasks] = useState(initialWorkspace.tasks);
  const [studySessions, setStudySessions] = useState(initialWorkspace.studySessions);

  useEffect(() => {
    persistWorkspace({
      tasks,
      studySessions
    });
  }, [tasks, studySessions]);

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
              title: (updates.title ?? task.title).trim(),
              notes: (updates.notes ?? task.notes).trim(),
              effortMinutes: Number(updates.effortMinutes ?? task.effortMinutes),
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

  const addStudySession = useCallback((sessionInput) => {
    const now = new Date().toISOString();

    const nextSession = {
      id: createId("session"),
      title: sessionInput.title.trim(),
      notes: sessionInput.notes.trim(),
      subjectId: sessionInput.subjectId,
      scheduledFor: sessionInput.scheduledFor,
      durationMinutes: Number(sessionInput.durationMinutes),
      status: sessionInput.status,
      sessionType: sessionInput.sessionType,
      createdAt: now,
      updatedAt: now
    };

    setStudySessions((current) => [nextSession, ...current]);
    return nextSession;
  }, []);

  const updateStudySession = useCallback((sessionId, updates) => {
    setStudySessions((current) =>
      current.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              ...updates,
              title: (updates.title ?? session.title).trim(),
              notes: (updates.notes ?? session.notes).trim(),
              durationMinutes: Number(updates.durationMinutes ?? session.durationMinutes),
              updatedAt: new Date().toISOString()
            }
          : session
      )
    );
  }, []);

  const deleteStudySession = useCallback((sessionId) => {
    setStudySessions((current) => current.filter((session) => session.id !== sessionId));
  }, []);

  const toggleStudySessionStatus = useCallback((sessionId) => {
    setStudySessions((current) =>
      current.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              status: session.status === "completed" ? "planned" : "completed",
              updatedAt: new Date().toISOString()
            }
          : session
      )
    );
  }, []);

  const value = useMemo(
    () => ({
      student: studySeed.student,
      subjects: studySeed.subjects,
      exams: studySeed.exams,
      tasks,
      studySessions,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskStatus,
      addStudySession,
      updateStudySession,
      deleteStudySession,
      toggleStudySessionStatus
    }),
    [
      addStudySession,
      addTask,
      deleteStudySession,
      deleteTask,
      studySessions,
      tasks,
      toggleStudySessionStatus,
      toggleTaskStatus,
      updateStudySession,
      updateTask
    ]
  );

  return <StudyDataContext.Provider value={value}>{children}</StudyDataContext.Provider>;
}

export default StudyDataProvider;