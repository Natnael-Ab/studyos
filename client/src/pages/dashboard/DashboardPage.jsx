import {
  Badge,
  Button,
  EmptyState,
  Progress,
  SectionHeader,
  StatCard,
  Surface
} from "../../components/ui";
import { PageTransition, Reveal } from "../../components/motion";

const priorities = [
  "Finish biology revision",
  "Submit design assignment",
  "Review economics notes"
];

function DashboardPage() {
  return (
    <PageTransition>
      <section className="page dashboard-page">
        <Reveal className="dashboard-hero">
          <div className="dashboard-hero__content">
            <Badge tone="accent">Live workspace</Badge>
            <h1 className="page__title">Your calm study command center.</h1>
            <p className="page__text">
              StudyOS organizes daily priorities, deadlines, and study rhythm into a
              premium workspace that stays readable on every screen.
            </p>
          </div>

          <div className="dashboard-hero__actions">
            <Button type="button" variant="primary">
              Start focus session
            </Button>
            <Button type="button" variant="ghost">
              Review this week
            </Button>
          </div>
        </Reveal>

        <div className="dashboard-overview">
          <Reveal delay={0.05}>
            <StatCard label="Study streak" value="7 days" detail="Consistent momentum" />
          </Reveal>
          <Reveal delay={0.1}>
            <StatCard label="Pending tasks" value="12" detail="Needs review" />
          </Reveal>
          <Reveal delay={0.15}>
            <StatCard label="Due this week" value="4" detail="Priority window" />
          </Reveal>
        </div>

        <div className="dashboard-layout">
          <Reveal>
            <Surface className="dashboard-panel">
              <SectionHeader
                eyebrow="Today"
                title="Today’s priorities"
                description="Keep the most important work visible and easy to act on."
              />

              <ul className="agenda-list">
                {priorities.map((item) => (
                  <li key={item} className="agenda-item">
                    <div className="agenda-item__top">
                      <div>
                        <h3 className="agenda-item__title">{item}</h3>
                        <p className="agenda-item__meta">Today · focus block ready</p>
                      </div>
                      <Badge tone="neutral">Priority</Badge>
                    </div>
                  </li>
                ))}
              </ul>

              <Progress value={68} label="Weekly momentum" />
            </Surface>
          </Reveal>

          <Reveal delay={0.08}>
            <Surface className="dashboard-panel">
              <SectionHeader
                eyebrow="Week"
                title="Weekly plan"
                description="See the rhythm of the week without switching between screens."
              />

              <div className="plan-list">
                <article className="plan-card">
                  <div className="plan-card__header">
                    <h3 className="plan-card__title">Monday</h3>
                    <Badge tone="accent">Planned</Badge>
                  </div>
                  <p className="plan-card__text">Map the week and clear backlog</p>
                </article>

                <article className="plan-card">
                  <div className="plan-card__header">
                    <h3 className="plan-card__title">Wednesday</h3>
                    <Badge tone="accent">Planned</Badge>
                  </div>
                  <p className="plan-card__text">Deep study block for core subjects</p>
                </article>

                <article className="plan-card">
                  <div className="plan-card__header">
                    <h3 className="plan-card__title">Friday</h3>
                    <Badge tone="accent">Planned</Badge>
                  </div>
                  <p className="plan-card__text">Review tasks and prepare next deadlines</p>
                </article>
              </div>

              <EmptyState
                title="No synced calendar yet"
                description="This area will later show class schedules, deadlines, and session timing."
              />
            </Surface>
          </Reveal>
        </div>
      </section>
    </PageTransition>
  );
}

export default DashboardPage;