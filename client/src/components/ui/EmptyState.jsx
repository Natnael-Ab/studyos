import Surface from "./Surface";

function EmptyState({ title, description, action }) {
  return (
    <Surface className="empty-state">
      <h3 className="empty-state__title">{title}</h3>
      <p className="empty-state__description">{description}</p>
      {action ? <div className="empty-state__action">{action}</div> : null}
    </Surface>
  );
}

export default EmptyState;