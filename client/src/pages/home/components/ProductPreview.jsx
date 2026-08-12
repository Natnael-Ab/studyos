const tasks = [
  {
    title: "Research methods",
    meta: "45 min",
    completed: true
  },
  {
    title: "Read chapter four",
    meta: "25 min",
    completed: false
  },
  {
    title: "Review exam plan",
    meta: "10 min",
    completed: false
  }
];

const weeklyBars = [34, 58, 48, 78, 66, 88, 42];

function ProductPreview() {
  return (
    <div className="product-preview">
      <div className="product-preview__glow" aria-hidden="true" />

      <div className="product-preview__window">
        <div className="product-preview__header">
          <div className="product-preview__brand">
            <span
              className="product-preview__brand-mark"
              aria-hidden="true"
            />

            <span>StudyOS</span>
          </div>

          <div className="product-preview__window-actions">
            <span />
            <span />
            <span />
          </div>
        </div>

        <div className="product-preview__toolbar">
          <div className="product-preview__toolbar-title">
            <span>Workspace</span>
            <strong>Tuesday, 12 August</strong>
          </div>

          <span className="product-preview__status">
            <span aria-hidden="true" />
            Balanced
          </span>
        </div>

        <div className="product-preview__content">
          <section className="product-preview__welcome">
            <div>
              <span className="product-preview__eyebrow">
                Today
              </span>

              <h2>
                Make the next hour count.
              </h2>

              <p>
                Your workspace is organized around what deserves
                attention now.
              </p>
            </div>

            <div className="product-preview__progress">
              <span>74%</span>
              <small>weekly rhythm</small>
            </div>
          </section>

          <section className="product-preview__focus">
            <div className="product-preview__focus-copy">
              <span className="product-preview__eyebrow">
                Current focus
              </span>

              <strong>Research methods</strong>

              <span>
                Deep work · 45 minutes
              </span>
            </div>

            <div
              className="product-preview__focus-ring"
              aria-label="32 minutes remaining"
            >
              <strong>32</strong>
              <span>min</span>
            </div>
          </section>

          <div className="product-preview__grid">
            <section className="product-preview__panel">
              <div className="product-preview__panel-header">
                <div>
                  <span>Next up</span>
                  <strong>3 priorities</strong>
                </div>

                <span className="product-preview__panel-action">
                  View all
                </span>
              </div>

              <div className="product-preview__task-list">
                {tasks.map((task) => (
                  <div
                    key={task.title}
                    className="product-preview__task"
                  >
                    <span
                      className={`product-preview__task-check ${
                        task.completed
                          ? "is-complete"
                          : ""
                      }`}
                      aria-hidden="true"
                    >
                      {task.completed ? "✓" : ""}
                    </span>

                    <span className="product-preview__task-copy">
                      <strong>{task.title}</strong>
                      <span>{task.meta}</span>
                    </span>

                    <span
                      className="product-preview__task-arrow"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="product-preview__panel product-preview__panel--rhythm">
              <div className="product-preview__panel-header">
                <div>
                  <span>Weekly rhythm</span>
                  <strong>Study consistency</strong>
                </div>

                <span className="product-preview__panel-score">
                  5 / 7
                </span>
              </div>

              <div className="product-preview__bars" aria-hidden="true">
                {weeklyBars.map((height, index) => (
                  <span
                    key={index}
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>

              <div className="product-preview__rhythm-note">
                <span aria-hidden="true" />
                Workload feels manageable.
              </div>
            </section>
          </div>
        </div>
      </div>

      <div
        className="product-preview__floating-card product-preview__floating-card--top"
        aria-hidden="true"
      >
        <span>Next session</span>
        <strong>Research methods</strong>
        <small>Starts in 8 min</small>
      </div>

      <div
        className="product-preview__floating-card product-preview__floating-card--bottom"
        aria-hidden="true"
      >
        <span>Today</span>
        <strong>3 priorities</strong>
        <small>1 completed</small>
      </div>
    </div>
  );
}

export default ProductPreview;