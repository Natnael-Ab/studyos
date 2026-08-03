import cn from "../../lib/cn";

function Textarea({ label, hint, className = "", ...props }) {
  return (
    <label className={cn("field", className)}>
      <span className="field__label">{label}</span>
      <textarea className="field__control field__control--textarea" {...props} />
      {hint ? <span className="field__hint">{hint}</span> : null}
    </label>
  );
}

export default Textarea;