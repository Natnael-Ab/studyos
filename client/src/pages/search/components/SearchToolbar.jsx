import { Button, Select, Surface } from "../../../components/ui";

function SearchToolbar({ filters, onChange, onResetFilters }) {
  function update(field, value) {
    onChange((current) => ({
      ...current,
      [field]: value
    }));
  }

  return (
    <Surface className="search-toolbar">
      <div className="search-toolbar__grid">
        <Select
          label="Type"
          value={filters.type}
          onChange={(event) => update("type", event.target.value)}
        >
          <option value="all">All types</option>
          <option value="task">Tasks</option>
          <option value="session">Study sessions</option>
          <option value="exam">Exams</option>
        </Select>

        <Select
          label="Status"
          value={filters.status}
          onChange={(event) => update("status", event.target.value)}
        >
          <option value="all">All statuses</option>
          <option value="open">Open</option>
          <option value="completed">Completed</option>
          <option value="upcoming">Upcoming</option>
        </Select>

        <Select
          label="Priority"
          value={filters.priority}
          onChange={(event) => update("priority", event.target.value)}
        >
          <option value="all">All priorities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </Select>

        <Select
          label="Time"
          value={filters.dueWindow}
          onChange={(event) => update("dueWindow", event.target.value)}
        >
          <option value="all">All dates</option>
          <option value="today">Today</option>
          <option value="week">This week</option>
          <option value="overdue">Overdue</option>
          <option value="upcoming">Upcoming</option>
        </Select>

        <Select
          label="Sort"
          value={filters.sortBy}
          onChange={(event) => update("sortBy", event.target.value)}
        >
          <option value="relevance">Relevance</option>
          <option value="due">Soonest due</option>
          <option value="alpha">Alphabetical</option>
        </Select>
      </div>

      <div className="search-toolbar__actions">
        <Button type="button" variant="ghost" size="sm" onClick={onResetFilters}>
          Reset filters
        </Button>
      </div>
    </Surface>
  );
}

export default SearchToolbar;