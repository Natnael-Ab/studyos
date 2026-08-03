import { Button, Select, Surface } from "../../../components/ui";

function TaskFilters({ filters, subjects, onChange, onClear }) {
  function handleChange(event) {
    const { name, value } = event.target;
    onChange((current) => ({
      ...current,
      [name]: value
    }));
  }

  return (
    <Surface className="task-filters">
      <div className="task-filters__grid">
        <Select label="Status" name="status" value={filters.status} onChange={handleChange}>
          <option value="all">All statuses</option>
          <option value="todo">To do</option>
          <option value="in-progress">In progress</option>
          <option value="done">Done</option>
        </Select>

        <Select
          label="Priority"
          name="priority"
          value={filters.priority}
          onChange={handleChange}
        >
          <option value="all">All priorities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </Select>

        <Select
          label="Subject"
          name="subjectId"
          value={filters.subjectId}
          onChange={handleChange}
        >
          <option value="all">All subjects</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </Select>

        <Select
          label="Deadline"
          name="deadline"
          value={filters.deadline}
          onChange={handleChange}
        >
          <option value="all">All deadlines</option>
          <option value="today">Today</option>
          <option value="week">Next 7 days</option>
          <option value="overdue">Overdue</option>
        </Select>
      </div>

      <div className="task-filters__actions">
        <Button type="button" variant="ghost" size="sm" onClick={onClear}>
          Clear filters
        </Button>
      </div>
    </Surface>
  );
}

export default TaskFilters;