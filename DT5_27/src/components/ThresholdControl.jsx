
function ThresholdControl({ label, value, onChange, unit }) {
  return (
    <div className="threshold-control">
      <label>
        {label}: {value} {unit}
      </label>

      <input
        type="number"
        min="0"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}

export default ThresholdControl;
