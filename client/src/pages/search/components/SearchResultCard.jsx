import { Badge, Surface } from "../../../components/ui";

function SearchResultCard({ item }) {
  return (
    <Surface as="article" className="search-result-card">
      <div className="search-result-card__header">
        <div className="search-result-card__heading">
          <h3 className="search-result-card__title">{item.title}</h3>
          <p className="search-result-card__subtitle">{item.subtitle}</p>
        </div>

        <div className="search-result-card__badges">
          <Badge tone="neutral">{item.typeLabel}</Badge>
          <Badge tone={item.statusGroup === "completed" ? "neutral" : "accent"}>
            {item.statusLabel}
          </Badge>
        </div>
      </div>

      <p className="search-result-card__description">{item.description}</p>
      <p className="search-result-card__details">{item.details}</p>

      <div className="search-tags">
        {item.tags.map((tag) => (
          <span key={tag} className="search-tag">
            {tag}
          </span>
        ))}
      </div>
    </Surface>
  );
}

export default SearchResultCard;