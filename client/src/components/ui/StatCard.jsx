import Surface from "./Surface";

function StatCard({ label, value, detail }) {
  return (
    <Surface className="stat-card">
      <span className="stat-card__label">{label}</span>
      <strong className="stat-card__value">{value}</strong>
      {detail ? <p className="stat-card__detail">{detail}</p> : null}
    </Surface>
  );
}

export default StatCard;