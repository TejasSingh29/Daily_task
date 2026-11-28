function MetricCard({ title, value, unit, description }) {
  return (
    <div className="metric-card">
      <h3>{title}</h3>
      <h2>{unit === "₹" ? `₹${value}` : `${value} ${unit}`}</h2>
      <p>{description}</p>
    </div>
  );
}

export default MetricCard;