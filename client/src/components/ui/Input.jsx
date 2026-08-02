function Input({ label, hint, className = "", ...props }) {
  const classes = ["field", className].filter(Boolean).join(" ");

  return (
    <label className={classes}>
      <span className="field__label">{label}</span>
      <input className="field__control" {...props} />
      {hint ? <span className="field__hint">{hint}</span> : null}
    </label>
  );
}

export default Input;