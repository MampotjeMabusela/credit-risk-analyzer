import { useEffect, useState } from "react";
import { scoreProfile } from "../lib/scoreProfile";

// Generate a single random synthetic credit profile in a South African context.
function randomProfile(id) {
  const income = Math.round(5000 + Math.random() * 75000); // R5k – R80k
  const age = Math.round(20 + Math.random() * 45); // 20 – 65
  const loanAmount = Math.round(2000 + Math.random() * 148000); // R2k – R150k
  const employmentYears = Math.round(Math.random() * 20); // 0 – 20
  const creditHistoryLength = Math.round(Math.random() * 20); // 0 – 20
  const termMonths = 6 + Math.round(Math.random() * 11) * 6; // 6,12,...,72
  const interestRate = 10 + Math.round(Math.random() * 20); // 10% – 30%

  return {
    id,
    income,
    age,
    loanAmount,
    employmentYears,
    creditHistoryLength,
    termMonths,
    interestRate,
  };
}

export default function Dashboard() {
  const [profiles, setProfiles] = useState([]);
  const [summary, setSummary] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);

  useEffect(() => {
    generateDataset();
  }, []);

  function generateDataset() {
    const generated = [];
    for (let i = 0; i < 50; i += 1) {
      const base = randomProfile(i + 1);
      const scored = scoreProfile(base);
      generated.push({ ...base, ...scored });
    }

    setProfiles(generated);
    setSelectedProfile(generated[0] || null);

    const total = generated.length || 1;
    const approveCount = generated.filter(
      (p) => p.decision === "approve"
    ).length;
    const reviewCount = generated.filter(
      (p) => p.decision === "review"
    ).length;
    const declineCount = generated.filter(
      (p) => p.decision === "decline"
    ).length;

    const avgDefaultProb =
      generated.reduce((acc, p) => acc + p.defaultProbability, 0) / total;

    const avgDsr =
      generated.reduce((acc, p) => acc + p.debtServiceRatio, 0) / total;

    const avgIncome =
      generated.reduce((acc, p) => acc + p.income, 0) / total;

    const avgLoan =
      generated.reduce((acc, p) => acc + p.loanAmount, 0) / total;

    const riskCounts = { low: 0, medium: 0, high: 0 };
    const incomeBands = {
      low: { count: 0, sumDefault: 0 }, // <= 15k
      mid: { count: 0, sumDefault: 0 }, // 15k–35k
      high: { count: 0, sumDefault: 0 }, // > 35k
    };
    const dsrBuckets = {
      under25: 0,
      between25_40: 0,
      between40_60: 0,
      over60: 0,
    };
    const ageBuckets = {
      youth: 0, // <25
      early: 0, // 25–34
      prime: 0, // 35–54
      senior: 0, // 55+
    };

    generated.forEach((p) => {
      if (riskCounts[p.riskBand] != null) {
        riskCounts[p.riskBand] += 1;
      }

      const bandKey =
        p.income <= 15000 ? "low" : p.income <= 35000 ? "mid" : "high";
      incomeBands[bandKey].count += 1;
      incomeBands[bandKey].sumDefault += p.defaultProbability;

      const dsrPct = p.debtServiceRatio;
      if (dsrPct < 0.25) dsrBuckets.under25 += 1;
      else if (dsrPct < 0.4) dsrBuckets.between25_40 += 1;
      else if (dsrPct < 0.6) dsrBuckets.between40_60 += 1;
      else dsrBuckets.over60 += 1;

      if (p.age < 25) ageBuckets.youth += 1;
      else if (p.age < 35) ageBuckets.early += 1;
      else if (p.age < 55) ageBuckets.prime += 1;
      else ageBuckets.senior += 1;
    });

    setSummary({
      total,
      approveCount,
      reviewCount,
      declineCount,
      avgDefaultProb,
      avgDsr,
      avgIncome,
      avgLoan,
      riskCounts,
      incomeBands,
      dsrBuckets,
      ageBuckets,
    });
  }

  return (
    <main className="container">
      <header>
        <h1>Portfolio Dashboard</h1>
        <p>
          50 synthetic South African credit profiles scored using the same
          risk engine as the simulator.
        </p>
      </header>

      <section className="layout" style={{ marginBottom: "1.5rem" }}>
        <section className="card">
          <h2>Summary</h2>
          {summary && (
            <>
              <p>Total applications: {summary.total}</p>
              <p>
                Approve: {summary.approveCount} · Review:{" "}
                {summary.reviewCount} · Decline: {summary.declineCount}
              </p>
              <p>
                Avg default probability:{" "}
                {(summary.avgDefaultProb * 100).toFixed(1)}%
              </p>
              <p>
                Avg debt service ratio (DSR):{" "}
                {(summary.avgDsr * 100).toFixed(1)}%
              </p>
              <p>
                Avg income: R {Math.round(summary.avgIncome)}
                {" · "}Avg loan amount: R {Math.round(summary.avgLoan)}
              </p>
            </>
          )}
          <button
            type="button"
            style={{ marginTop: "1rem" }}
            onClick={generateDataset}
          >
            Regenerate 50 random profiles
          </button>
        </section>

        <section className="card">
          <h2>Selected Profile</h2>
          {!selectedProfile && <p>Click a row below to inspect a customer.</p>}
          {selectedProfile && (
            <>
              <p>
                <strong>Customer #{selectedProfile.id}</strong>{" "}
                · Age {selectedProfile.age} · Income R{" "}
                {selectedProfile.income}
              </p>
              <p>
                Loan R {selectedProfile.loanAmount} over{" "}
                {selectedProfile.termMonths} months at{" "}
                {selectedProfile.interestRate}% p.a.
              </p>
              <p>
                Default probability:{" "}
                {(selectedProfile.defaultProbability * 100).toFixed(1)}% · DSR:{" "}
                {(selectedProfile.debtServiceRatio * 100).toFixed(1)}%
              </p>
              <p>
                Decision:{" "}
                <strong style={{ textTransform: "capitalize" }}>
                  {selectedProfile.decision}
                </strong>{" "}
                · Band: {selectedProfile.riskBand}
              </p>
              {selectedProfile.reasons?.length > 0 && (
                <>
                  <p style={{ marginTop: "0.75rem" }}>Key reasons:</p>
                  <ul style={{ paddingLeft: "1.2rem", fontSize: "0.85rem" }}>
                    {selectedProfile.reasons.slice(0, 4).map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </>
              )}
            </>
          )}
        </section>
      </section>

      <section className="layout" style={{ marginBottom: "1.5rem" }}>
        <section className="card">
          <h2>Decision Mix</h2>
          {summary && (
            <div>
              {["approve", "review", "decline"].map((type) => {
                const label =
                  type === "approve"
                    ? "Approve"
                    : type === "review"
                    ? "Review"
                    : "Decline";
                const count =
                  type === "approve"
                    ? summary.approveCount
                    : type === "review"
                    ? summary.reviewCount
                    : summary.declineCount;
                const pct = ((count / summary.total) * 100).toFixed(1);
                const gradient =
                  type === "approve"
                    ? "linear-gradient(90deg, #22c55e, #4ade80)"
                    : type === "review"
                    ? "linear-gradient(90deg, #facc15, #fb923c)"
                    : "linear-gradient(90deg, #f97373, #ef4444)";
                return (
                  <div
                    key={type}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "0.4rem",
                    }}
                  >
                    <span style={{ minWidth: 70 }}>{label}</span>
                    <div className="bar" style={{ flex: 1 }}>
                      <div
                        className="bar-fill"
                        style={{
                          width: `${pct}%`,
                          background: gradient,
                        }}
                      />
                    </div>
                    <span style={{ fontSize: "0.85rem" }}>
                      {count} ({pct}%)
                    </span>
                  </div>
                );
              })}
            </div>
          )}
          {!summary && <p>Generating dataset…</p>}
        </section>

        <section className="card">
          <h2>Risk Band Distribution</h2>
          {summary && (
            <div>
              {[
                { key: "low", label: "Low risk" },
                { key: "medium", label: "Medium risk" },
                { key: "high", label: "High risk" },
              ].map(({ key, label }) => {
                const count = summary.riskCounts[key] || 0;
                const pct = ((count / summary.total) * 100).toFixed(1);
                const gradient =
                  key === "low"
                    ? "linear-gradient(90deg, #22c55e, #16a34a)"
                    : key === "medium"
                    ? "linear-gradient(90deg, #facc15, #eab308)"
                    : "linear-gradient(90deg, #f97373, #ef4444)";
                return (
                  <div
                    key={key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "0.4rem",
                    }}
                  >
                    <span style={{ minWidth: 90 }}>{label}</span>
                    <div className="bar" style={{ flex: 1 }}>
                      <div
                        className="bar-fill"
                        style={{
                          width: `${pct}%`,
                          background: gradient,
                        }}
                      />
                    </div>
                    <span style={{ fontSize: "0.85rem" }}>
                      {count} ({pct}%)
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="card">
          <h2>Income vs Default Risk</h2>
          {summary && (
            <div>
              {[
                { key: "low", label: "≤ R15k" },
                { key: "mid", label: "R15k–R35k" },
                { key: "high", label: "> R35k" },
              ].map(({ key, label }) => {
                const band = summary.incomeBands[key];
                const avg =
                  band.count > 0
                    ? (band.sumDefault / band.count) * 100
                    : 0;
                return (
                  <div
                    key={key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "0.4rem",
                    }}
                  >
                    <span style={{ minWidth: 90 }}>{label}</span>
                    <div className="bar" style={{ flex: 1 }}>
                      <div
                        className="bar-fill"
                        style={{
                          width: `${avg.toFixed(1)}%`,
                          background:
                            "linear-gradient(90deg, #38bdf8, #0ea5e9)",
                        }}
                      />
                    </div>
                    <span style={{ fontSize: "0.85rem" }}>
                      {avg.toFixed(1)}%
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="card">
          <h2>DSR Buckets</h2>
          {summary && (
            <div>
              {[
                { key: "under25", label: "< 25%" },
                { key: "between25_40", label: "25–40%" },
                { key: "between40_60", label: "40–60%" },
                { key: "over60", label: "> 60%" },
              ].map(({ key, label }) => {
                const count = summary.dsrBuckets[key] || 0;
                const pct = ((count / summary.total) * 100).toFixed(1);
                return (
                  <div
                    key={key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "0.4rem",
                    }}
                  >
                    <span style={{ minWidth: 70 }}>{label}</span>
                    <div className="bar" style={{ flex: 1 }}>
                      <div
                        className="bar-fill"
                        style={{
                          width: `${pct}%`,
                          background:
                            "linear-gradient(90deg, #a855f7, #6366f1)",
                        }}
                      />
                    </div>
                    <span style={{ fontSize: "0.85rem" }}>
                      {count} ({pct}%)
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="card">
          <h2>Age Distribution</h2>
          {summary && (
            <div>
              {[
                { key: "youth", label: "18–24" },
                { key: "early", label: "25–34" },
                { key: "prime", label: "35–54" },
                { key: "senior", label: "55+" },
              ].map(({ key, label }) => {
                const count = summary.ageBuckets[key] || 0;
                const pct = ((count / summary.total) * 100).toFixed(1);
                return (
                  <div
                    key={key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "0.4rem",
                    }}
                  >
                    <span style={{ minWidth: 70 }}>{label}</span>
                    <div className="bar" style={{ flex: 1 }}>
                      <div
                        className="bar-fill"
                        style={{
                          width: `${pct}%`,
                          background:
                            "linear-gradient(90deg, #f97316, #fb923c)",
                        }}
                      />
                    </div>
                    <span style={{ fontSize: "0.85rem" }}>
                      {count} ({pct}%)
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </section>

      <section className="card">
        <h2>Sample of 50 Credit Profiles</h2>
        <div style={{ maxHeight: 400, overflow: "auto", marginTop: "0.75rem" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Income (R)</th>
                <th>Loan (R)</th>
                <th>Age</th>
                <th>Emp. yrs</th>
                <th>Credit yrs</th>
                <th>Term (m)</th>
                <th>Rate %</th>
                <th>Default %</th>
                <th>DSR %</th>
                <th>Decision</th>
                <th>Band</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => setSelectedProfile(p)}
                  className={
                    selectedProfile?.id === p.id ? "selected-row" : ""
                  }
                >
                  <td>{p.id}</td>
                  <td>{p.income}</td>
                  <td>{p.loanAmount}</td>
                  <td>{p.age}</td>
                  <td>{p.employmentYears}</td>
                  <td>{p.creditHistoryLength}</td>
                  <td>{p.termMonths}</td>
                  <td>{p.interestRate}</td>
                  <td>{(p.defaultProbability * 100).toFixed(1)}</td>
                  <td>{(p.debtServiceRatio * 100).toFixed(1)}</td>
                  <td>{p.decision}</td>
                  <td>{p.riskBand}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

