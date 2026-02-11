export default function RiskCard({
  riskScore,
  riskBand,
  decision,
  installment,
  debtServiceRatio,
}) {
  let mainText = "No prediction yet";
  if (riskScore != null) {
    mainText = `${riskScore}%`;
  }

  const bandLabel =
    riskBand === "low"
      ? "Low risk"
      : riskBand === "medium"
      ? "Medium risk"
      : riskBand === "high"
      ? "High risk"
      : "Risk level not calculated";

  const decisionLabel =
    decision === "approve"
      ? "Approve"
      : decision === "review"
      ? "Refer for manual review"
      : decision === "decline"
      ? "Decline"
      : "No decision yet";

  const decisionClass =
    decision === "approve"
      ? "decision approved"
      : decision === "decline"
      ? "decision declined"
      : "decision";

  const formattedInstallment =
    typeof installment === "number"
      ? installment.toFixed(2)
      : null;

  const formattedDsr =
    typeof debtServiceRatio === "number"
      ? (debtServiceRatio * 100).toFixed(1)
      : null;

  return (
    <section className="card">
      <h2>Default Probability</h2>
      <p className="risk-score">{mainText}</p>
      <p className="risk-band">{bandLabel}</p>
      <p className={decisionClass}>{decisionLabel}</p>

      {formattedInstallment && (
        <p style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>
          Estimated monthly installment: R {formattedInstallment}
        </p>
      )}

      {formattedDsr && (
        <p style={{ marginTop: "0.25rem", fontSize: "0.9rem" }}>
          Debt service ratio (installment / income): {formattedDsr}%
        </p>
      )}
    </section>
  );
}
