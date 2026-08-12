function HomeFeature({
  number,
  eyebrow,
  title,
  description,
  className = ""
}) {
  return (
    <article className={`home-feature ${className}`.trim()}>
      <div className="home-feature__top">
        <span className="home-feature__number">
          {number}
        </span>

        <span className="home-feature__line" aria-hidden="true" />
      </div>

      <div className="home-feature__copy">
        <span className="home-feature__eyebrow">
          {eyebrow}
        </span>

        <h3>{title}</h3>

        <p>{description}</p>
      </div>
    </article>
  );
}

export default HomeFeature;