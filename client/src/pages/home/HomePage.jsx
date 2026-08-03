import { Badge, Button, SectionHeader, StatCard, Surface } from "../../components/ui";

const highlights = [
  {
    title: "Protected access",
    text: "A clear entry flow that feels like a real product."
  },
  {
    title: "First launch setup",
    text: "Set your goals, term, hours, and subjects."
  },
  {
    title: "Responsive workspace",
    text: "Calm on mobile, tablet, desktop, and large screens."
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
          StudyOS is built for students who want a calm, professional workspace
          that keeps tasks, sessions, and progress organized in one place.
        </p>

        <div className="hero__actions">
          <Button to="/signup" variant="primary">
            Get started
          </Button>
          <Button to="/login" variant="ghost">
            Sign in
          </Button>
        </div>
      </div>

      <SectionHeader
        eyebrow="Why it works"
        title="Designed to feel serious from the first tap"
        description="The product flow is clean, premium, and ready for the deeper academic systems that follow."
      />

      <div className="metric-grid">
        <StatCard label="Entry flow" value="4 steps" detail="Sign up, verify, setup, enter" />
        <StatCard label="Study rhythm" value="Ready" detail="Tasks and sessions later connect" />
        <StatCard label="Layout" value="Responsive" detail="Mobile, tablet, desktop, large" />
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