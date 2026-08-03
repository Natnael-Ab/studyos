import cn from "../../lib/cn";

function Progress({ value = 0, label, className = "" }) {
  const safeValue = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("progress", className)}>
      {label ? <div className="progress__label">{label}</div> : null}
      <div
        className="progress__track"
        aria-hidden="true"
        role="presentation"
      >
        <div className="progress__fill" style={{ width: `${safeValue}%` }} />
      </div>
      <div className="progress__meta">{safeValue}%</div>
    </div>
  );
}

export default Progress;