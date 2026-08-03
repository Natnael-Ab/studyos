import { Button, Select, Surface } from "../../../components/ui";

function SessionFilters({ filters, subjects, onChange, onClear }) {
  function handleChange(event) {
    const { name, value } = event.target;
    onChange((current) => ({
      ...current,
      [name]: value
    }));
  }

  return (
    <Surface className="session-filters">
      <div className="session-filters__grid">
        <Select label="Status" name="status" value={filters.status} onChange={handleChange}>
          <option value="all">All statuses</option>
          <option value="planned">Planned</option>
          <option value="completed">Completed</option>
        </Select>

        <Select label="Subject" name="subjectId" value={filters.subjectId} onChange={handleChange}>
          <option value="all">All subjects</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </Select>

        <Select
          label="Type"
          name="sessionType"
          value={filters.sessionType}
          onChange={handleChange}
        >
          <option value="all">All types</option>
          <option value="focus">Focus</option>
          <option value="revision">Revision</option>
          <option value="reading">Reading</option>
          <option value="practice">Practice</option>
        </Select>

        <Select label="Window" name="window" value={filters.window} onChange={handleChange}>
          <option value="all">All sessions</option>
          <option value="today">Today</option>
          <option value="week">This week</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
        </Select>
      </div>

      <div className="session-filters__actions">
        <Button type="button" variant="ghost" size="sm" onClick={onClear}>
          Clear filters
        </Button>
      </div>
    </Surface>
  );
}

export default SessionFilters;