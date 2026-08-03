import cn from "../../lib/cn";

function Select({ label, hint, children, className = "", ...props }) {
  return (
    <label className={cn("field", className)}>
      <span className="field__label">{label}</span>
      <select className="field__control" {...props}>
        {children}
      </select>
      {hint ? <span className="field__hint">{hint}</span> : null}
    </label>
  );
}

export default Select;