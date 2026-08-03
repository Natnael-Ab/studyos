import { Badge, Button, SectionHeader, StatCard, Surface } from "../../components/ui";

const highlights = [
  {
    title: "Today view",
    text: "See what matters now without digging through clutter."
  },
  {
    title: "Study planning",
    text: "Turn deadlines into a clear weekly workflow."
  },
  {
    title: "Progress tracking",
    text: "Keep momentum visible across subjects and goals."
  }
];

function HomePage() {
  return (
    <section className="page home-page">
      <div className="hero">
        <Badge tone="accent">StudyOS</Badge>
        <h1 className="page__title">
          A premium student operating system for clarity, focus, and momentum.
        </h1>
        <p className="page__text">
          StudyOS is designed as a calm, professional workspace for students who
          need a clear way to manage tasks, study time, and deadlines across every
          device.
        </p>

        <div className="hero__actions">
          <Button to="/dashboard" variant="primary">
            Open workspace
          </Button>
          <Button to="/login" variant="ghost">
            Sign in
          </Button>
        </div>
      </div>

      <SectionHeader
        eyebrow="Overview"
        title="Built for structured academic momentum"
        description="The interface stays calm while the product remains useful in daily student life."
      />

      <div className="metric-grid">
        <StatCard label="Focus blocks" value="12" detail="Scheduled this week" />
        <StatCard label="Active subjects" value="5" detail="Across current term" />
        <StatCard label="Upcoming deadlines" value="8" detail="Visible at a glance" />
      </div>

      <div className="feature-grid">
        {highlights.map((item) => (
          <Surface key={item.title} className="feature-card">
            <h2 className="feature-card__title">{item.title}</h2>
            <p className="feature-card__text">{item.text}</p>
          </Surface>
        ))}
      </div>
    </section>
  );
}

export default HomePage;