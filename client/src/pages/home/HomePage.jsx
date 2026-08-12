import { Button } from "../../components/ui";
import HomeFeature from "./components/HomeFeature";
import ProductPreview from "./components/ProductPreview";

const features = [
  {
    number: "01",
    eyebrow: "Focus",
    title: "Know what deserves your attention.",
    description:
      "Tasks, sessions, priorities, and deadlines are presented around the work that matters next."
  },
  {
    number: "02",
    eyebrow: "Planning",
    title: "Turn a busy week into a clear one.",
    description:
      "Move from scattered commitments to a structured study rhythm without filling your screen with noise."
  },
  {
    number: "03",
    eyebrow: "Knowledge",
    title: "Keep your academic world connected.",
    description:
      "Search, notes, resources, sessions, and planning belong to one workspace instead of separate islands."
  }
];

const workflowSteps = [
  {
    number: "01",
    title: "Capture",
    text: "Give tasks, ideas, resources, and commitments a clear place."
  },
  {
    number: "02",
    title: "Plan",
    text: "Shape the week around deadlines, available time, and real priorities."
  },
  {
    number: "03",
    title: "Focus",
    text: "Open the next task, start a session, and let the rest stay quiet."
  }
];

function HomePage() {
  return (
    <div className="home-page">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero__copy">
          <div className="home-hero__eyebrow">
            <span aria-hidden="true" />
            <span>StudyOS · Academic workspace</span>
          </div>

          <h1 id="home-title">
            A calmer way to
            <span>do serious work.</span>
          </h1>

          <p className="home-hero__lead">
            StudyOS brings your study planning, focus sessions,
            tasks, research, and resources into one thoughtful
            workspace designed around clarity.
          </p>

          <div className="home-hero__actions">
            <Button
              to="/signup"
              variant="primary"
              size="lg"
            >
              Create your workspace
              <span aria-hidden="true">↗</span>
            </Button>

            <Button
              to="/login"
              variant="ghost"
              size="lg"
            >
              Sign in
            </Button>
          </div>

          <div className="home-hero__meta">
            <span>Built for focused study</span>
            <span aria-hidden="true" />
            <span>Designed for every screen</span>
            <span aria-hidden="true" />
            <span>Made to grow with you</span>
          </div>
        </div>

        <div className="home-hero__visual">
          <ProductPreview />
        </div>
      </section>

      <section
        className="home-introduction"
        aria-labelledby="home-introduction-title"
      >
        <div className="home-introduction__label">
          <span>01</span>
          <span>The idea</span>
        </div>

        <div className="home-introduction__content">
          <h2 id="home-introduction-title">
            Your study system should help you think,
            not make you manage the system.
          </h2>

          <p>
            StudyOS is designed around a simple principle:
            complexity should exist underneath the experience,
            not inside it.
          </p>
        </div>
      </section>

      <section
        className="home-features"
        aria-labelledby="home-features-title"
      >
        <div className="home-section-heading">
          <div>
            <span className="home-section-heading__eyebrow">
              The experience
            </span>

            <h2 id="home-features-title">
              Everything important.
              Nothing unnecessary.
            </h2>
          </div>

          <p>
            A connected academic workspace with enough depth to
            support serious study and enough restraint to stay
            pleasant every day.
          </p>
        </div>

        <div className="home-feature-grid">
          {features.map((feature) => (
            <HomeFeature
              key={feature.number}
              {...feature}
            />
          ))}
        </div>
      </section>

      <section
        className="home-workflow"
        aria-labelledby="home-workflow-title"
      >
        <div className="home-workflow__intro">
          <div className="home-section-heading__eyebrow">
            A simple rhythm
          </div>

          <h2 id="home-workflow-title">
            From scattered to clear.
          </h2>

          <p>
            StudyOS reduces the distance between knowing what
            needs to happen and actually doing it.
          </p>
        </div>

        <div className="home-workflow__steps">
          {workflowSteps.map((step) => (
            <article
              key={step.number}
              className="home-workflow__step"
            >
              <span className="home-workflow__number">
                {step.number}
              </span>

              <div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        className="home-closing"
        aria-labelledby="home-closing-title"
      >
        <div className="home-closing__content">
          <span className="home-section-heading__eyebrow">
            Begin with clarity
          </span>

          <h2 id="home-closing-title">
            Give your next semester
            a better operating system.
          </h2>

          <p>
            Start with the essentials. Build the workspace around
            the way you actually study.
          </p>
        </div>

        <div className="home-closing__action">
          <Button
            to="/signup"
            variant="primary"
            size="lg"
          >
            Start with StudyOS
            <span aria-hidden="true">↗</span>
          </Button>
        </div>
      </section>
    </div>
  );
}

export default HomePage;