function DashboardSection({
  id,
  index,
  eyebrow,
  title,
  description,
  children,
  className = ""
}) {
  return (
    <section
      id={id}
      className={`dashboard-section ${className}`.trim()}
      aria-labelledby={`${id}-title`}
    >
      <div className="dashboard-section__heading">
        <div className="dashboard-section__heading-main">
          <div className="dashboard-section__index">
            <span>{index}</span>

            <span
              className="dashboard-section__index-line"
              aria-hidden="true"
            />
          </div>

          <div>
            <span className="dashboard-section__eyebrow">
              {eyebrow}
            </span>

            <h2
              id={`${id}-title`}
              className="dashboard-section__title"
            >
              {title}
            </h2>

            {description ? (
              <p className="dashboard-section__description">
                {description}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="dashboard-section__content">
        {children}
      </div>
    </section>
  );
}

export default DashboardSection;