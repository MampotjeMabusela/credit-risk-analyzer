import React, { useState } from "react";

// Heuristic feature importance explanation (South African context).

export default function ShapChart() {
  const features = [
    {
      name: "Debt Service Ratio (DSR)",
      importance: 0.3,
      direction: "higher_increases",
      description:
        "Share of income used to pay the new installment. A very high DSR suggests the loan may not be affordable under NCA-style affordability checks.",
    },
    {
      name: "Monthly Income (R)",
      importance: 0.22,
      direction: "higher_decreases",
      description:
        "Higher stable income generally reduces risk because the customer has more capacity to service debt.",
    },
    {
      name: "Loan Amount (R)",
      importance: 0.18,
      direction: "higher_increases",
      description:
        "Larger loans increase exposure and risk, especially when large relative to income.",
    },
    {
      name: "Employment Years",
      importance: 0.12,
      direction: "higher_decreases",
      description:
        "Longer employment history is a proxy for income stability and tends to reduce risk.",
    },
    {
      name: "Credit History Length",
      importance: 0.1,
      direction: "higher_decreases",
      description:
        "A longer track record of managing credit is usually a positive signal.",
    },
    {
      name: "Age",
      importance: 0.08,
      direction: "non_linear",
      description:
        "Very young or older applicants can be slightly higher risk; mid‑career customers are usually more stable.",
    },
  ];

  const [activeName, setActiveName] = useState(features[0].name);
  const active = features.find((f) => f.name === activeName) ?? features[0];

  return (
    <section className="card">
      <h2>Feature Importance (Heuristic)</h2>
      <p style={{ fontSize: "0.85rem", color: "#9ca3af", marginTop: "0.25rem" }}>
        These importances explain which factors have the biggest impact on the
        current score. In a production model you would replace this with real
        SHAP or XAI outputs from your trained model.
      </p>
      <ul className="shap-list">
        {features.map((feat) => {
          const pct = (feat.importance * 100).toFixed(0);
          const isActive = feat.name === activeName;
          return (
            <li
              key={feat.name}
              className={isActive ? "shap-item active" : "shap-item"}
              onClick={() => setActiveName(feat.name)}
            >
              <span>{feat.name}</span>
              <div className="bar">
                <div
                  className="bar-fill"
                  style={{
                    width: `${pct}%`,
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "#9ca3af",
                  minWidth: "120px",
                }}
              >
                {feat.direction === "higher_increases" &&
                  "Higher → higher risk"}
                {feat.direction === "higher_decreases" &&
                  "Higher → lower risk"}
                {feat.direction === "non_linear" &&
                  "Extremes can increase risk"}
                {" · "}
                {pct}%
              </span>
            </li>
          );
        })}
      </ul>
      <div
        style={{
          marginTop: "0.9rem",
          padding: "0.75rem 0.9rem",
          borderRadius: 12,
          border: "1px solid var(--border-subtle)",
          background:
            "radial-gradient(circle at top left, rgba(59,130,246,0.18), rgba(15,23,42,0.9))",
          fontSize: "0.85rem",
        }}
      >
        <p style={{ margin: 0, fontWeight: 500 }}>{active.name}</p>
        <p style={{ margin: "0.35rem 0 0.25rem", color: "#9ca3af" }}>
          {active.description}
        </p>
        <p style={{ margin: 0, color: "#a5b4fc" }}>
          Impact direction:{" "}
          {active.direction === "higher_increases" && "higher values increase risk"}
          {active.direction === "higher_decreases" && "higher values reduce risk"}
          {active.direction === "non_linear" &&
            "very low or very high values can increase risk"}
          .
        </p>
      </div>
      <p style={{ fontSize: "0.8rem", color: "#9ca3af", marginTop: "0.75rem" }}>
        Note: This demo aligns with South African affordability principles
        (income, exposure, stability), but it is not legal advice and not a
        full implementation of the National Credit Act.
      </p>
    </section>
  );
}

