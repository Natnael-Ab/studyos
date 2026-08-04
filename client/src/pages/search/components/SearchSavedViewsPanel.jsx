import { Badge, Button, EmptyState, Input, SectionHeader, Surface } from "../../../components/ui";

function summarizeFilters(filters) {
  const parts = [];

  if (filters.type !== "all") parts.push(filters.type);
  if (filters.status !== "all") parts.push(filters.status);
  if (filters.priority !== "all") parts.push(filters.priority);
  if (filters.dueWindow !== "all") parts.push(filters.dueWindow);

  return parts.length > 0 ? parts.join(" · ") : "All items";
}

function SearchSavedViewsPanel({
  collections,
  activeCollectionId,
  onApplyCollection,
  viewName,
  onViewNameChange,
  onSaveView,
  savedViews,
  activeViewId,
  onApplyView,
  onDeleteView
}) {
  return (
    <Surface className="search-saved-views">
      <SectionHeader
        eyebrow="Saved views"
        title="Smart collections"
        description="Save the exact search and filter combination you use most."
        action={<Badge tone="neutral">{savedViews.length} saved</Badge>}
      />

      <div className="search-saved-views__form">
        <Input
          label="View name"
          value={viewName}
          onChange={(event) => onViewNameChange(event.target.value)}
          placeholder="Weekly revision"
        />

        <Button type="button" variant="primary" onClick={onSaveView}>
          Save current view
        </Button>
      </div>

      <div className="search-collection-grid">
        {collections.map((collection) => (
          <button
            key={collection.id}
            type="button"
            className={`search-collection-card ${
              activeCollectionId === collection.id ? "is-active" : ""
            }`}
            onClick={() => onApplyCollection(collection)}
          >
            <strong className="search-collection-card__title">{collection.label}</strong>
            <span className="search-collection-card__text">{collection.description}</span>
          </button>
        ))}
      </div>

      <div className="search-view-list">
        {savedViews.length > 0 ? (
          savedViews.map((view) => (
            <article
              key={view.id}
              className={`search-view-card ${activeViewId === view.id ? "is-active" : ""}`}
            >
              <div className="search-view-card__header">
                <div>
                  <h3 className="search-view-card__title">{view.name}</h3>
                  <p className="search-view-card__text">
                    {view.query || "No keyword query"}
                  </p>
                </div>
                <Badge tone="neutral">{summarizeFilters(view.filters)}</Badge>
              </div>

              <div className="search-view-card__actions">
                <Button type="button" variant="ghost" size="sm" onClick={() => onApplyView(view)}>
                  Load
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => onDeleteView(view.id)}>
                  Delete
                </Button>
              </div>
            </article>
          ))
        ) : (
          <EmptyState
            title="No saved views yet"
            description="Save a search once and reuse it instantly from this panel."
          />
        )}
      </div>
    </Surface>
  );
}

export default SearchSavedViewsPanel;