
# Day 5 – React State & Component Design

## Project: API Monitoring Dashboard

### Objective
Build a React dashboard to monitor API performance using reusable components and React state.

### Tech Stack
- React
- JavaScript
- Vite
- CSS

### Features
- Average API latency monitoring
- API error-rate monitoring
- Requests-per-minute display
- Configurable alert thresholds
- Healthy and Warning status
- Loading, empty, and error states
- Retry functionality
- Reusable React components

### Component Design

1. MetricCard – Displays an individual API metric.
2. ThresholdControl – Allows users to configure alert limits.
3. StatusBadge – Displays the overall API status.

### State Ownership

The App component owns the shared state:

- metrics
- loading
- error
- latencyLimit
- errorRateLimit

Child components receive values and callbacks through props.

### Assumptions
- Monitoring data is simulated.
- Latency is measured in milliseconds.
- Error rate is represented as a percentage.
- Requests are measured per minute.
- A warning is displayed when a metric exceeds its threshold.

### Failure Case
If the monitoring API is unavailable, the dashboard displays an error message and provides a Retry button.

### Testing
- Verified successful data loading.
- Verified latency threshold updates.
- Verified error-rate threshold updates.
- Verified empty state.
- Verified API failure state.
- Verified retry functionality.
- Verified loading state.

### Limitations
This is a frontend prototype using mock data. It is not connected to a real monitoring API. Thresholds and metrics are stored only in React state and reset when the page reloads.
