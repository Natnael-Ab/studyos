import { Badge, EmptyState, SectionHeader, Surface } from "../../../components/ui";
import SearchResultCard from "./SearchResultCard";

function SearchResults({ groups, resultCount }) {
  if (resultCount === 0) {
    return (
      <Surface className="search-results">
        <EmptyState
          title="No results found"
          description="Try a broader keyword, reduce filters, or load a saved view."
        />
      </Surface>
    );
  }

  return (
    <div className="search-results">
      {groups.map((group) => (
        <Surface key={group.type} className="search-results__group">
          <SectionHeader
            eyebrow="Results"
            title={group.label}
            description={`${group.items.length} item${group.items.length === 1 ? "" : "s"} found`}
            action={<Badge tone="neutral">{group.items.length}</Badge>}
          />

          <div className="search-results__list">
            {group.items.map((item) => (
              <SearchResultCard key={`${item.type}-${item.id}`} item={item} />
            ))}
          </div>
        </Surface>
      ))}
    </div>
  );
}

export default SearchResults;