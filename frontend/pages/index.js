import { useState } from "react";

import RiskCard from "../components/RiskCard";
import ShapChart from "../components/ShapChart";
import ScenarioPanel from "../components/ScenarioPanel";

export default function Home() {
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  function handlePredict(result) {
    if (typeof result?.defaultProbability === "number") {
      setPrediction(result);
      setError(null);
    } else {
      setPrediction(null);
      setError("Unexpected prediction format from API.");
    }
  }

  return (
    <main className="container">
      <header>
        <h1>AI Credit Risk Analyzer</h1>
        <p>Use the sliders to simulate different applicant profiles.</p>
      </header>
      {error && <p style={{ color: "salmon" }}>{error}</p>}
      <section className="layout">
        <RiskCard
          riskScore={
            prediction
              ? (prediction.defaultProbability * 100).toFixed(1)
              : null
          }
          riskBand={prediction?.riskBand}
          decision={prediction?.decision}
          installment={prediction?.installment}
          debtServiceRatio={prediction?.debtServiceRatio}
        />
        <ScenarioPanel onPredict={handlePredict} />
      </section>
      <ShapChart />
    </main>
  );
}

