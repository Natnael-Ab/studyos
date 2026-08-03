import { studySeed } from "../data/studySeed";

const workspaceKey = "studyos.workspace.v2";
const legacyTasksKey = "studyos.tasks.v1";

function createId(prefix) {
  const randomId =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(16).slice(2);

  return `${prefix}-${randomId}`;
}

function readStoredWorkspace() {
  if (typeof window === "undefined") {
    return {
      tasks: studySeed.tasks,
      studySessions: studySeed.studySessions
    };
  }

  try {
    const workspaceRaw = window.localStorage.getItem(workspaceKey);

    if (workspaceRaw) {
      const parsed = JSON.parse(workspaceRaw);

      return {
        tasks: Array.isArray(parsed.tasks) ? parsed.tasks : studySeed.tasks,
        studySessions: Array.isArray(parsed.studySessions)
          ? parsed.studySessions
          : studySeed.studySessions
      };
    }

    const legacyRaw = window.localStorage.getItem(legacyTasksKey);

    if (legacyRaw) {
      const parsed = JSON.parse(legacyRaw);

      if (Array.isArray(parsed)) {
        return {
          tasks: parsed,
          studySessions: studySeed.studySessions
        };
      }
    }
  } catch {
    return {
      tasks: studySeed.tasks,
      studySessions: studySeed.studySessions
    };
  }

  return {
    tasks: studySeed.tasks,
    studySessions: studySeed.studySessions
  };
}

function persistWorkspace(workspace) {
  try {
    window.localStorage.setItem(workspaceKey, JSON.stringify(workspace));
  } catch {
    // Keep the app usable even if storage is blocked.
  }
}

export { createId, persistWorkspace, readStoredWorkspace };