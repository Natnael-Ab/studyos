import cn from "../../lib/cn";

function Switch({ label, hint, checked, onChange, className = "" }) {
  return (
    <label className={cn("switch", checked && "is-checked", className)}>
      <span className="switch__copy">
        <span className="switch__label">{label}</span>
        {hint ? <span className="switch__hint">{hint}</span> : null}
      </span>

      <span className="switch__control">
        <input
          className="switch__input"
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
        />
        <span className="switch__track" aria-hidden="true">
          <span className="switch__thumb" />
        </span>
      </span>
    </label>
  );
}

export default Switch;