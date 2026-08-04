import { StatCard } from "../../../components/ui";

function SearchMetrics({ summary }) {
  const cards = [
    {
      label: "Matched",
      value: String(summary.total),
      detail: "All visible results"
    },
    {
      label: "Due soon",
      value: String(summary.dueSoon),
      detail: "Today or this week"
    },
    {
      label: "Overdue",
      value: String(summary.overdue),
      detail: "Needs attention"
    },
    {
      label: "Completed",
      value: String(summary.completed),
      detail: "Finished items"
    }
  ];

  return (
    <div className="search-metrics">
      {cards.map((card) => (
        <StatCard
          key={card.label}
          label={card.label}
          value={card.value}
          detail={card.detail}
        />
      ))}
    </div>
  );
}

export default SearchMetrics;