
import { useEffect, useState } from "react";
import MetricCard from "./components/MetricCard";
import ThresholdControl from "./components/ThresholdControl";
import StatusBadge from "./components/StatusBadge";
import "./App.css";

function App() {
  // Dashboard data state
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // User-controlled alert thresholds
  const [salesLimit, setSalesLimit] = useState(10000);
  const [conversionLimit, setConversionLimit] = useState(3);

  // Initial dashboard API simulation
  useEffect(() => {
    loadDashboard("success");
  }, []);

  // Load analytics data
  function loadDashboard(mode = "success") {
    setLoading(true);
    setError("");
    setMetrics(null);

    setTimeout(() => {
      setLoading(false);

      if (mode === "error") {
        setError("Unable to connect to the E-commerce Analytics API.");
      } else if (mode === "empty") {
        setMetrics(null);
      } else {
        setMetrics({
          revenue: 125000,
          orders: 850,
          conversionRate: 3.8,
          visitors: 22000,
          funnel: {
            visitors: 22000,
            productViews: 14000,
            addToCart: 5200,
            checkout: 2400,
            purchases: 850,
          },
        });
      }
    }, 1000);
  }

  // Loading state
  if (loading) {
    return (
      <h2 className="message">
        Loading E-commerce Analytics...
      </h2>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="message">
        <h2 className="error">{error}</h2>
        <button onClick={() => loadDashboard("success")}>
          Retry
        </button>
      </div>
    );
  }

  // Empty state
  if (!metrics) {
    return (
      <div className="message">
        <h2>No sales analytics data available.</h2>
        <button onClick={() => loadDashboard("success")}>
          Reload Data
        </button>
      </div>
    );
  }

  // Calculate dashboard status
  const status =
    metrics.revenue < salesLimit ||
    metrics.conversionRate < conversionLimit
      ? "Warning"
      : "Healthy";

  return (
    <div className="dashboard">
      <header>
        <div>
          <h1>E-commerce Analytics Panel</h1>
          <p>Monitor sales performance and customer conversion</p>
        </div>
        <StatusBadge status={status} />
      </header>

      {/* Sales metrics */}
      <section className="metrics-grid">
        <MetricCard
          title="Total Revenue"
          value={metrics.revenue.toLocaleString("en-IN")}
          unit="₹"
          description="Total sales revenue"
        />

        <MetricCard
          title="Total Orders"
          value={metrics.orders}
          unit="orders"
          description="Completed customer orders"
        />

        <MetricCard
          title="Conversion Rate"
          value={metrics.conversionRate}
          unit="%"
          description="Visitors converted into buyers"
        />

        <MetricCard
          title="Total Visitors"
          value={metrics.visitors.toLocaleString("en-IN")}
          unit="visitors"
          description="Unique website visitors"
        />
      </section>

      {/* Conversion funnel */}
      <section className="funnel-section">
        <h2>Conversion Funnel</h2>
        <p>Track customers through each shopping stage.</p>

        <div className="funnel-grid">
          {Object.entries(metrics.funnel).map(([stage, count]) => (
            <div className="funnel-card" key={stage}>
              <h3>{stage.replace(/([A-Z])/g, " $1")}</h3>
              <h2>{count.toLocaleString("en-IN")}</h2>
            </div>
          ))}
        </div>
      </section>

      {/* Alert thresholds */}
      <section className="threshold-section">
        <h2>Sales Alert Thresholds</h2>

        <ThresholdControl
          label="Minimum Revenue"
          value={salesLimit}
          unit="₹"
          onChange={setSalesLimit}
        />

        <ThresholdControl
          label="Minimum Conversion Rate"
          value={conversionLimit}
          unit="%"
          onChange={setConversionLimit}
        />
      </section>

      {/* Testing controls */}
      <section className="demo-controls">
        <h2>Testing Controls</h2>

        <button onClick={() => loadDashboard("success")}>
          Load Sales Data
        </button>

        <button onClick={() => loadDashboard("empty")}>
          Simulate Empty State
        </button>

        <button onClick={() => loadDashboard("error")}>
          Simulate API Failure
        </button>
      </section>
    </div>
  );
}

export default App;
