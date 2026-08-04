import { useEffect, useMemo, useState } from "react";
import { Badge, Surface } from "../../components/ui";
import { PageTransition, Reveal } from "../../components/motion";
import { useStudyData } from "../../hooks/useStudyData";
import { useWorkspaceAccess } from "../../hooks/useWorkspaceAccess";
import {
  buildSearchInsights,
  groupSearchResults,
  searchWorkspace,
  SEARCH_DEFAULT_FILTERS
} from "../../domain/search";
import {
  createSavedSearchView,
  loadSavedSearchViews,
  persistSavedSearchViews
} from "./searchViewsStorage";
import SearchHero from "./components/SearchHero";
import SearchToolbar from "./components/SearchToolbar";
import SearchMetrics from "./components/SearchMetrics";
import SearchSavedViewsPanel from "./components/SearchSavedViewsPanel";
import SearchResults from "./components/SearchResults";

const smartCollections = [
  {
    id: "all",
    label: "All items",
    description: "Everything in the workspace",
    filters: SEARCH_DEFAULT_FILTERS
  },
  {
    id: "today",
    label: "Today",
    description: "Items due today",
    filters: { ...SEARCH_DEFAULT_FILTERS, dueWindow: "today" }
  },
  {
    id: "week",
    label: "This week",
    description: "Tasks and sessions in the next 7 days",
    filters: { ...SEARCH_DEFAULT_FILTERS, dueWindow: "week" }
  },
  {
    id: "overdue",
    label: "Overdue",
    description: "Needs attention now",
    filters: { ...SEARCH_DEFAULT_FILTERS, dueWindow: "overdue" }
  },
  {
    id: "tasks",
    label: "Tasks",
    description: "Assignments and projects",
    filters: { ...SEARCH_DEFAULT_FILTERS, type: "task" }
  },
  {
    id: "sessions",
    label: "Sessions",
    description: "Focus blocks and revision",
    filters: { ...SEARCH_DEFAULT_FILTERS, type: "session" }
  },
  {
    id: "exams",
    label: "Exams",
    description: "Exam and readiness items",
    filters: { ...SEARCH_DEFAULT_FILTERS, type: "exam" }
  }
];

function SearchPage() {
  const { tasks, studySessions, exams, subjects } = useStudyData();
  const { profile } = useWorkspaceAccess();

  const firstName =
    profile.fullName.trim().split(/\s+/).filter(Boolean)[0] || "there";

  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState(SEARCH_DEFAULT_FILTERS);
  const [savedViews, setSavedViews] = useState(loadSavedSearchViews);
  const [viewName, setViewName] = useState("");
  const [activeViewId, setActiveViewId] = useState(null);
  const [activeCollectionId, setActiveCollectionId] = useState("all");

  useEffect(() => {
    persistSavedSearchViews(savedViews);
  }, [savedViews]);

  const results = useMemo(
    () =>
      searchWorkspace(
        {
          tasks,
          studySessions,
          exams,
          subjects
        },
        query,
        filters
      ),
    [tasks, studySessions, exams, subjects, query, filters]
  );

  const summary = useMemo(() => buildSearchInsights(results), [results]);
  const groups = useMemo(() => groupSearchResults(results), [results]);

  function handleQueryChange(value) {
    setQuery(value);
    setActiveViewId(null);
    setActiveCollectionId(null);
  }

  function handleFiltersChange(updater) {
    setFilters(updater);
    setActiveViewId(null);
    setActiveCollectionId(null);
  }

  function handleResetFilters() {
    setQuery("");
    setFilters(SEARCH_DEFAULT_FILTERS);
    setActiveViewId(null);
    setActiveCollectionId("all");
  }

  function handleApplyCollection(collection) {
    setQuery("");
    setFilters({ ...SEARCH_DEFAULT_FILTERS, ...collection.filters });
    setActiveCollectionId(collection.id);
    setActiveViewId(null);
  }

  function handleSaveView() {
    const label = viewName.trim() || "Saved view";
    const nextView = createSavedSearchView({
      name: label,
      query,
      filters
    });

    let nextActiveViewId = nextView.id;

    setSavedViews((current) => {
      const existingIndex = current.findIndex(
        (view) => view.name.toLowerCase() === label.toLowerCase()
      );

      if (existingIndex >= 0) {
        nextActiveViewId = current[existingIndex].id;

        const next = [...current];
        next[existingIndex] = {
          ...current[existingIndex],
          ...nextView,
          id: current[existingIndex].id,
          createdAt: current[existingIndex].createdAt
        };

        return next;
      }

      return [nextView, ...current];
    });

    setActiveViewId(nextActiveViewId);
    setActiveCollectionId(null);
    setViewName("");
  }

  function handleApplyView(view) {
    setQuery(view.query);
    setFilters(view.filters);
    setActiveViewId(view.id);
    setActiveCollectionId(null);
  }

  function handleDeleteView(viewId) {
    setSavedViews((current) => current.filter((view) => view.id !== viewId));

    if (activeViewId === viewId) {
      setActiveViewId(null);
    }
  }

  return (
    <PageTransition>
      <section className="page search-page">
        <Reveal>
          <SearchHero
            firstName={firstName}
            query={query}
            resultCount={results.length}
            onQueryChange={handleQueryChange}
            onClear={handleResetFilters}
          />
        </Reveal>

        <Reveal>
          <SearchMetrics summary={summary} />
        </Reveal>

        <div className="search-layout">
          <div className="search-main">
            <Reveal>
              <SearchToolbar
                filters={filters}
                onChange={handleFiltersChange}
                onResetFilters={handleResetFilters}
              />
            </Reveal>

            <Reveal delay={0.04}>
              <SearchResults groups={groups} resultCount={results.length} />
            </Reveal>
          </div>

          <aside className="search-side">
            <Reveal>
              <SearchSavedViewsPanel
                collections={smartCollections}
                activeCollectionId={activeCollectionId}
                onApplyCollection={handleApplyCollection}
                viewName={viewName}
                onViewNameChange={setViewName}
                onSaveView={handleSaveView}
                savedViews={savedViews}
                activeViewId={activeViewId}
                onApplyView={handleApplyView}
                onDeleteView={handleDeleteView}
              />
            </Reveal>

            <Reveal delay={0.04}>
              <Surface className="search-tip-card">
                <Badge tone="accent">Search tip</Badge>
                <h2 className="search-tip-card__title">
                  Build a rhythm, not a one-off search.
                </h2>
                <p className="search-tip-card__text">
                  Save recurring views like weekly revision, overdue tasks, or exam prep.
                  That keeps StudyOS fast even as your workspace grows.
                </p>
              </Surface>
            </Reveal>
          </aside>
        </div>
      </section>
    </PageTransition>
  );
}

export default SearchPage;