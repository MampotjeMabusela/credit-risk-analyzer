import { useState } from "react";

// Sliders and inputs for what-if analysis.
// Calls onPredict(result) with the prediction response from the API.

export default function ScenarioPanel({ onPredict }) {
  const [income, setIncome] = useState(60000);
  const [age, setAge] = useState(32);
  const [loanAmount, setLoanAmount] = useState(15000);
  const [employmentYears, setEmploymentYears] = useState(5);
  const [creditHistoryLength, setCreditHistoryLength] = useState(6);
  const [termMonths, setTermMonths] = useState(24);
  const [interestRate, setInterestRate] = useState(18);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState(null);

  async function handleRecalculate() {
    setWorking(true);
    setError(null);
    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          income,
          age,
          loanAmount,
          employmentYears,
          creditHistoryLength,
          termMonths,
          interestRate,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Prediction failed");
      }
      onPredict?.(json);
    } catch (e) {
      setError(e.message || "Something went wrong");
    } finally {
      setWorking(false);
    }
  }

  return (
    <section className="card scenario-panel">
      <h2>What-if Scenario</h2>

      <div className="field">
        <label>
          Income (R {income})
          <input
            type="range"
            min="20000"
            max="200000"
            step="5000"
            value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
          />
        </label>
      </div>

      <div className="field">
        <label>
          Age ({age} years)
          <input
            type="range"
            min="18"
            max="80"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
          />
        </label>
      </div>

      <div className="field">
        <label>
          Loan Amount (R {loanAmount})
          <input
            type="range"
            min="1000"
            max="100000"
            step="1000"
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
          />
        </label>
      </div>

      <div className="field">
        <label>
          Employment Years ({employmentYears})
          <input
            type="range"
            min="0"
            max="40"
            value={employmentYears}
            onChange={(e) => setEmploymentYears(Number(e.target.value))}
          />
        </label>
      </div>

      <div className="field">
        <label>
          Credit History Length ({creditHistoryLength} years)
          <input
            type="range"
            min="0"
            max="25"
            value={creditHistoryLength}
            onChange={(e) =>
              setCreditHistoryLength(Number(e.target.value))
            }
          />
        </label>
      </div>

      <div className="field">
        <label>
          Term ({termMonths} months)
          <input
            type="range"
            min="6"
            max="72"
            step="6"
            value={termMonths}
            onChange={(e) => setTermMonths(Number(e.target.value))}
          />
        </label>
      </div>

      <div className="field">
        <label>
          Interest Rate ({interestRate}% per year)
          <input
            type="range"
            min="0"
            max="36"
            step="1"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
          />
        </label>
      </div>

      <button type="button" onClick={handleRecalculate} disabled={working}>
        {working ? "Calculating..." : "Recalculate Risk"}
      </button>

      {error && (
        <p style={{ color: "salmon", marginTop: "0.5rem" }}>{error}</p>
      )}
    </section>
  );
}

