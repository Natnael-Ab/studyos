import { Badge, Button, Input, Surface } from "../../../components/ui";

function SearchHero({ firstName, query, resultCount, onQueryChange, onClear }) {
  return (
    <Surface className="search-hero">
      <div className="search-hero__content">
        <Badge tone="accent">Workspace search</Badge>
        <h1 className="page__title">
          Search your workspace, {firstName}.
        </h1>
        <p className="page__text">
          Find tasks, study sessions, and exams quickly. Build saved views for your
          most common study flows.
        </p>
      </div>

      <div className="search-hero__field">
        <Input
          label="Search everything"
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search tasks, sessions, exams, subjects..."
          autoComplete="off"
        />
      </div>

      <div className="search-hero__actions">
        <Badge tone="neutral">{resultCount} results</Badge>
        <Button to="/planner" variant="ghost">
          Open planner
        </Button>
        <Button type="button" variant="ghost" onClick={onClear}>
          Clear search
        </Button>
      </div>
    </Surface>
  );
}

export default SearchHero;