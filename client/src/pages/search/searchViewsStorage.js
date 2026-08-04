import { SEARCH_DEFAULT_FILTERS } from "../../domain/search";

const storageKey = "studyos.search.views.v1";

function createId(prefix) {
  const randomId =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(16).slice(2);

  return `${prefix}-${randomId}`;
}

function normalizeSavedView(view) {
  return {
    id: typeof view.id === "string" ? view.id : createId("view"),
    name: typeof view.name === "string" && view.name.trim() ? view.name.trim() : "Saved view",
    query: typeof view.query === "string" ? view.query : "",
    filters: {
      ...SEARCH_DEFAULT_FILTERS,
      ...(view.filters ?? {})
    },
    createdAt: typeof view.createdAt === "string" ? view.createdAt : new Date().toISOString(),
    updatedAt: typeof view.updatedAt === "string" ? view.updatedAt : new Date().toISOString()
  };
}

function loadSavedSearchViews() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(storageKey);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map(normalizeSavedView);
  } catch {
    return [];
  }
}

function persistSavedSearchViews(views) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(views));
  } catch {
    // Keep the workspace usable even if storage is blocked.
  }
}

function createSavedSearchView({ name, query, filters }) {
  const now = new Date().toISOString();

  return normalizeSavedView({
    id: createId("view"),
    name,
    query,
    filters,
    createdAt: now,
    updatedAt: now
  });
}

export {
  createSavedSearchView,
  loadSavedSearchViews,
  persistSavedSearchViews
};