import {
  useMemo,
  useState
} from "react";

import {
  StatCard
} from "../../components/ui";

import {
  PageTransition,
  Reveal
} from "../../components/motion";

import {
  useStudyData
} from "../../hooks/useStudyData";

import {
  useWorkspaceAccess
} from "../../hooks/useWorkspaceAccess";

import {
  useWorkspaceSettings
} from "../../hooks/useWorkspaceSettings";

import {
  buildPlannerSnapshot
} from "../../domain/planner";

import PlannerHero from "./components/PlannerHero";
import PlannerNavigation from "./components/PlannerNavigation";
import TodayPanel from "./components/TodayPanel";
import WeeklyPlanner from "./components/WeeklyPlanner";
import CalendarPanel from "./components/CalendarPanel";

function PlannerPage() {
  const {
    tasks,
    studySessions,
    exams,
    subjects
  } = useStudyData();

  const {
    profile
  } = useWorkspaceAccess();

  const {
    settings
  } = useWorkspaceSettings();

  const [
    activeView,
    setActiveView
  ] = useState(
    "today"
  );

  const snapshot =
    useMemo(
      () =>
        buildPlannerSnapshot({
          tasks,
          studySessions,
          exams,
          subjects,
          profile,
          settings
        }),
      [
        tasks,
        studySessions,
        exams,
        subjects,
        profile,
        settings
      ]
    );

  const summaryCards =
    useMemo(
      () => {
        if (
          activeView ===
          "today"
        ) {
          return [
            {
              label: "Today",
              value: String(
                snapshot.todayTaskCount +
                  snapshot.todaySessionCount
              ),
              detail:
                "Agenda items"
            },

            {
              label: "Study time",
              value: `${snapshot.todayMinutes}m`,
              detail:
                "Tasks and sessions"
            },

            {
              label: "Next up",
              value:
                snapshot.nextItem
                  ? "1"
                  : "—",
              detail:
                snapshot.nextItem
                  ? snapshot
                      .nextItem
                      .subjectName
                  : "No immediate item"
            },

            {
              label: "Exam",
              value:
                snapshot.nextExam
                  ? `${snapshot.nextExam.readiness}%`
                  : "—",
              detail:
                snapshot.nextExam
                  ? "Readiness"
                  : "No upcoming exam"
            }
          ];
        }

        if (
          activeView ===
          "week"
        ) {
          return [
            {
              label: "Open days",
              value: String(
                snapshot.activeWeekDays
              ),
              detail:
                "With planned work"
            },

            {
              label: "Week load",
              value: `${snapshot.weekTotalMinutes}m`,
              detail:
                "Tasks plus sessions"
            },

            {
              label: "Tasks",
              value: String(
                snapshot.weekTaskCount
              ),
              detail: `${snapshot.weekTaskMinutes}m effort`
            },

            {
              label: "Sessions",
              value: String(
                snapshot.weekSessionCount
              ),
              detail: `${snapshot.weekSessionMinutes}m planned`
            }
          ];
        }

        return [
          {
            label: "Active days",
            value: String(
              snapshot.activeMonthDays
            ),
            detail:
              "This month"
          },

          {
            label: "Month items",
            value: String(
              snapshot.currentMonthItemCount
            ),
            detail:
              "Tasks, sessions and exams"
          },

          {
            label: "Week load",
            value: `${snapshot.weekTotalMinutes}m`,
            detail:
              "Current week"
          },

          {
            label: "Next exam",
            value:
              snapshot.nextExam
                ? `${snapshot.nextExam.readiness}%`
                : "—",
            detail:
              snapshot.nextExam
                ? snapshot
                    .nextExam
                    .title
                : "No exam scheduled"
          }
        ];
      },
      [
        activeView,
        snapshot
      ]
    );

  return (
    <PageTransition>
      <section className="page planner-page planner-page--premium">
        <Reveal>
          <PlannerHero
            snapshot={snapshot}
            activeView={activeView}
          />
        </Reveal>

        <Reveal delay={0.02}>
          <PlannerNavigation
            activeView={
              activeView
            }
            onChange={
              setActiveView
            }
          />
        </Reveal>

        <div className="planner-summary-grid planner-summary-grid--premium">
          {summaryCards.map(
            (card) => (
              <Reveal
                key={
                  card.label
                }
              >
                <StatCard
                  label={
                    card.label
                  }
                  value={
                    card.value
                  }
                  detail={
                    card.detail
                  }
                />
              </Reveal>
            )
          )}
        </div>

        {activeView ===
        "today" ? (
          <div className="planner-view planner-view--today">
            <Reveal>
              <TodayPanel
                snapshot={
                  snapshot
                }
              />
            </Reveal>

            {snapshot.nextExam ? (
              <Reveal delay={0.04}>
                <div className="planner-exam-card planner-exam-card--premium">
                  <div>
                    <span className="planner-exam-card__eyebrow">
                      Exam watch
                    </span>

                    <h2>
                      {
                        snapshot
                          .nextExam
                          .title
                      }
                    </h2>

                    <p>
                      {
                        snapshot
                          .nextExam
                          .subjectName
                      }
                      {" · "}
                      {
                        snapshot
                          .nextExam
                          .dueLabel
                      }
                    </p>
                  </div>

                  <span className="planner-exam-card__readiness">
                    {
                      snapshot
                        .nextExam
                        .readiness
                    }%
                    {" "}
                    ready
                  </span>
                </div>
              </Reveal>
            ) : null}
          </div>
        ) : null}

        {activeView ===
        "week" ? (
          <div className="planner-view planner-view--week">
            <Reveal>
              <WeeklyPlanner
                snapshot={
                  snapshot
                }
              />
            </Reveal>

            <Reveal delay={0.04}>
              <TodayPanel
                snapshot={
                  snapshot
                }
              />
            </Reveal>
          </div>
        ) : null}

        {activeView ===
        "month" ? (
          <div className="planner-view planner-view--month">
            <Reveal>
              <CalendarPanel
                snapshot={
                  snapshot
                }
              />
            </Reveal>

            <Reveal delay={0.04}>
              <WeeklyPlanner
                snapshot={
                  snapshot
                }
              />
            </Reveal>
          </div>
        ) : null}

        <div className="planner-page__footer-note">
          <span>
            Planning principle
          </span>

          <p>
            Put important work into
            the week before the week
            becomes important work.
          </p>
        </div>
      </section>
    </PageTransition>
  );
}

export default PlannerPage;