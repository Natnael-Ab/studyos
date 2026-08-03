function SectionHeader({ eyebrow, title, description, action }) {
  return (
    <div className="section-header">
      <div className="section-header__content">
        {eyebrow ? <p className="section-header__eyebrow">{eyebrow}</p> : null}
        <h2 className="section-header__title">{title}</h2>
        {description ? (
          <p className="section-header__description">{description}</p>
        ) : null}
      </div>

      {action ? <div className="section-header__action">{action}</div> : null}
    </div>
  );
}

export default SectionHeader;