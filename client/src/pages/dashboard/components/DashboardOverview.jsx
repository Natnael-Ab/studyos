import { StatCard } from "../../../components/ui";
import { buildStudySnapshot } from "../../../domain/studyPlanner";
import { studySeed } from "../../../data/studySeed";

const snapshot = buildStudySnapshot(studySeed);

function DashboardOverview() {
  return (
    <div className="dashboard-overview">
      {snapshot.summaryCards.map((card) => (
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

export default DashboardOverview;