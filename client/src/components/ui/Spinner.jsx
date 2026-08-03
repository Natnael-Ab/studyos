function Spinner({ label = "Loading" }) {
  return (
    <div className="spinner" role="status" aria-live="polite" aria-label={label}>
      <span className="spinner__ring" />
      <span className="spinner__label">{label}</span>
    </div>
  );
}

export default Spinner;