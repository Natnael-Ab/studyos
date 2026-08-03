import { StatCard } from "../../../components/ui";

const stats = [
  {
    label: "Study streak",
    value: "7 days",
    detail: "Consistent momentum"
  },
  {
    label: "Pending tasks",
    value: "12",
    detail: "Needs review"
  },
  {
    label: "Due this week",
    value: "4",
    detail: "Priority window"
  }
];

function DashboardOverview() {
  return (
    <div className="dashboard-overview">
      {stats.map((stat) => (
        <StatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          detail={stat.detail}
        />
      ))}
    </div>
  );
}

export default DashboardOverview;