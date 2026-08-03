import { useMemo } from "react";
import { buildStudySnapshot } from "../../../domain/studyPlanner";
import { useStudyData } from "../../../hooks/useStudyData";
import { StatCard } from "../../../components/ui";

function DashboardOverview() {
  const { subjects, tasks, studySessions, exams } = useStudyData();

  const snapshot = useMemo(
    () =>
      buildStudySnapshot({
        subjects,
        tasks,
        studySessions,
        exams
      }),
    [subjects, tasks, studySessions, exams]
  );

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