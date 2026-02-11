// Scenario testing UI for what-if credit risk analysis.

import React from "react";
import ScenarioPanel from "../components/ScenarioPanel";
import RiskCard from "../components/RiskCard";

export default function ScenarioPage() {
  return (
    <main className="container">
      <header>
        <h1>Scenario Testing</h1>
        <p>Adjust inputs and see how risk changes.</p>
      </header>
      <section className="layout">
        <ScenarioPanel onPredict={() => {}} />
        <RiskCard riskScore={null} loading={false} />
      </section>
    </main>
  );
}

