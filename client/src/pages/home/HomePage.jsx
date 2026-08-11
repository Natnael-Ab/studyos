import { Button } from "../../components/ui";

const featureItems = [
  {
    number: "01",
    title: "One clear place",
    text: "Tasks, sessions, planning, research, and resources stay connected without turning the screen into a control panel."
  },
  {
    number: "02",
    title: "Designed around attention",
    text: "StudyOS puts the next useful action first and keeps secondary information quiet until you need it."
  },
  {
    number: "03",
    title: "A system that grows",
    text: "Begin with the essentials and expand into a deeper academic workflow without replacing the way you already work."
  }
];

const previewTasks = [
  { title: "Research methods", meta: "45 min", done: true },
  { title: "Read chapter 4", meta: "25 min", done: false },
  { title: "Review exam plan", meta: "10 min", done: false }
];

function PreviewTask({ title, meta, done }) {
  return (
    <div className="home-page__preview-task">
      <span
        className={`home-page__preview-check ${done ? "is-complete" : ""}`}
        aria-hidden="true"
      >
        {done ? "✓" : null}
      </span>
      <span className="home-page__preview-task-title">{title}</span>
      <span className="home-page__preview-task-meta">{meta}</span>
    </div>
  );
}

function HomePage() {
  return (
    <div className="home-page">
      <section className="home-page__hero" aria-labelledby="home-title">
        <div className="home-page__hero-copy">
          <div className="home-page__eyebrow-row">
            <span className="home-page__eyebrow-dot" aria-hidden="true" />
            <span className="home-page__eyebrow">
              A calmer academic operating system
            </span>
          </div>

          <h1 id="home-title" className="page__title home-page__title">
            Make space for the work that matters.
          </h1>

          <p className="page__text home-page__lead">
            StudyOS brings planning, focus, tasks, sessions, search, and academic
            resources into one quiet workspace built around clarity.
          </p>

          <div className="home-page__actions">
            <Button to="/signup" variant="primary" size="lg">
              Create your workspace
              <span aria-hidden="true">↗</span>
            </Button>

            <Button to="/login" variant="ghost" size="lg">
              Sign in
            </Button>
          </div>

          <div
            className="home-page__confidence"
            aria-label="StudyOS qualities"
          >
            <span>Focused</span>
            <i aria-hidden="true" />
            <span>Connected</span>
            <i aria-hidden="true" />
            <span>Thoughtful</span>
          </div>
        </div>

        <div className="home-page__product-wrap">
          <div
            className="home-page__product-orbit home-page__product-orbit--one"
            aria-hidden="true"
          />

          <div
            className="home-page__product-orbit home-page__product-orbit--two"
            aria-hidden="true"
          />

          <div
            className="home-page__product"
            aria-label="StudyOS product preview"
          >
            <div className="home-page__product-topbar">
              <div className="home-page__product-brand">
                <span
                  className="home-page__product-brand-mark"
                  aria-hidden="true"
                />
                StudyOS
              </div>

              <div className="home-page__product-date">
                Tuesday · 11 Aug
              </div>
            </div>

            <div className="home-page__product-body">
              <div className="home-page__product-heading">
                <div>
                  <span className="home-page__product-kicker">Today</span>

                  <h2>
                    Good work starts with a clear next step.
                  </h2>
                </div>

                <span className="home-page__product-progress">
                  74%
                </span>
              </div>

              <div className="home-page__product-focus">
                <div className="home-page__focus-copy">
                  <span className="home-page__product-kicker">
                    Current focus
                  </span>

                  <strong>Research methods</strong>

                  <span>
                    45 min · Deep work
                  </span>
                </div>

                <div
                  className="home-page__focus-ring"
                  aria-hidden="true"
                >
                  <span>32</span>
                  <small>min</small>
                </div>
              </div>

              <div className="home-page__product-columns">
                <div className="home-page__product-panel">
                  <div className="home-page__product-panel-header">
                    <span>Next up</span>
                    <span>3 items</span>
                  </div>

                  <div className="home-page__preview-list">
                    {previewTasks.map((task) => (
                      <PreviewTask
                        key={task.title}
                        {...task}
                      />
                    ))}
                  </div>
                </div>

                <div className="home-page__product-panel home-page__product-panel--progress">
                  <div className="home-page__product-panel-header">
                    <span>Weekly rhythm</span>
                    <span>5 / 7</span>
                  </div>

                  <div
                    className="home-page__rhythm-bars"
                    aria-hidden="true"
                  >
                    {[52, 78, 64, 88, 72, 42, 24].map(
                      (height, index) => (
                        <span
                          key={index}
                          style={{ height: `${height}%` }}
                        />
                      )
                    )}
                  </div>

                  <div className="home-page__product-mini-note">
                    <span
                      className="home-page__product-mini-dot"
                      aria-hidden="true"
                    />
                    Balanced workload
                  </div>
                </div>
              </div>
            </div>

            <div className="home-page__product-bottom">
              <span>
                Built for the next hour, the next week, and the whole semester.
              </span>

              <span aria-hidden="true">›</span>
            </div>
          </div>
        </div>
      </section>

      <section
        className="home-page__principles"
        aria-labelledby="home-principles-title"
      >
        <div className="home-page__principles-intro">
          <span className="home-page__eyebrow">
            The product principle
          </span>

          <h2 id="home-principles-title">
            Serious tools deserve a quieter interface.
          </h2>

          <p>
            Premium software does not need more chrome. It needs better
            hierarchy, calmer surfaces, and interactions that feel obvious when
            you need them.
          </p>
        </div>

        <div className="home-page__feature-grid">
          {featureItems.map((item) => (
            <article
              key={item.number}
              className="home-page__feature"
            >
              <div className="home-page__feature-number">
                {item.number}
              </div>

              <div className="home-page__feature-copy">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>

              <span
                className="home-page__feature-line"
                aria-hidden="true"
              />
            </article>
          ))}
        </div>
      </section>

      <section
        className="home-page__closing"
        aria-labelledby="home-closing-title"
      >
        <div>
          <span className="home-page__eyebrow">
            A better study system
          </span>

          <h2 id="home-closing-title">
            Less managing. More doing.
          </h2>
        </div>

        <Button to="/signup" variant="ghost" size="lg">
          Start with StudyOS
          <span aria-hidden="true">↗</span>
        </Button>
      </section>
    </div>
  );
}

export default HomePage;