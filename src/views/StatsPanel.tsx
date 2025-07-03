import React from "react";

const StatsPanel: React.FC = () => {
  const stats = [
    { label: "Tickets Sold", value: 12450 },
    { label: "Revenue ($)", value: 53210 },
    { label: "Active Retailers", value: 78 },
  ];

  return (
    <div style={{ padding: "2rem" }}>
      <h1>📈 Stats Panel</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {stats.map((s) => (
          <li key={s.label} style={{ margin: "0.5rem 0" }}>
            <strong>{s.label}: </strong>
            {s.value.toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StatsPanel;
