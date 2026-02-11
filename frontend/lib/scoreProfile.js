// Shared scoring logic for a single credit profile.
// Used by both the API route and the dashboard to keep behaviour consistent.

export function scoreProfile({
  income,
  age,
  loanAmount,
  employmentYears,
  creditHistoryLength,
  termMonths,
  interestRate,
}) {
  let score = 0.5;
  const reasons = [];

  const safeTermMonths =
    typeof termMonths === "number" && termMonths > 0 ? termMonths : 24;
  const safeInterestRate =
    typeof interestRate === "number" && interestRate >= 0
      ? interestRate
      : 18;

  // income effect (monthly income in ZAR)
  if (income >= 60000) {
    score -= 0.18; // high-earner, strong affordability
    reasons.push("High monthly income reduces risk.");
  } else if (income >= 30000) {
    score -= 0.1;
    reasons.push("Moderate income slightly reduces risk.");
  } else if (income < 10000) {
    score += 0.12; // low income -> higher risk
    reasons.push("Low monthly income increases affordability risk.");
  }

  // loan-to-income effect (approximate affordability / DTI proxy)
  const loanToIncome =
    income > 0 ? loanAmount / (income * 12) : Number.POSITIVE_INFINITY;
  if (loanToIncome > 0.8) {
    score += 0.2; // very high relative exposure
    reasons.push("Loan amount is very high relative to annual income.");
  } else if (loanToIncome > 0.5) {
    score += 0.12;
    reasons.push("Loan amount is high relative to annual income.");
  } else if (loanToIncome < 0.2) {
    score -= 0.08;
    reasons.push("Loan amount is low relative to annual income.");
  }

  // employment years (stability)
  if (employmentYears >= 8) {
    score -= 0.1;
    reasons.push("Long employment history reduces risk.");
  } else if (employmentYears >= 3) {
    score -= 0.05;
    reasons.push("Moderate employment history slightly reduces risk.");
  } else if (employmentYears < 1) {
    score += 0.08;
    reasons.push("Very short employment history increases risk.");
  }

  // credit history length (years with active accounts)
  if (creditHistoryLength >= 10) {
    score -= 0.1;
    reasons.push("Long credit history reduces risk.");
  } else if (creditHistoryLength >= 5) {
    score -= 0.05;
    reasons.push("Moderate credit history slightly reduces risk.");
  } else if (creditHistoryLength < 1) {
    score += 0.08;
    reasons.push("Very short credit history increases risk.");
  }

  // age effect (younger / older slightly higher risk)
  if (age < 21) {
    score += 0.08;
    reasons.push("Very young applicant increases risk.");
  } else if (age < 25) {
    score += 0.04;
    reasons.push("Young applicant slightly increases risk.");
  } else if (age > 65) {
    score += 0.05;
    reasons.push("Older applicant slightly increases risk.");
  }

  // calculate estimated monthly installment (simple amortization)
  const monthlyRate = safeInterestRate / 100 / 12;
  let installment;
  if (monthlyRate === 0) {
    installment = loanAmount / safeTermMonths;
  } else {
    const pow = Math.pow(1 + monthlyRate, safeTermMonths);
    const factor = (monthlyRate * pow) / (pow - 1);
    installment = loanAmount * factor;
  }

  const debtServiceRatio =
    income > 0 ? installment / income : Number.POSITIVE_INFINITY;

  if (debtServiceRatio > 0.6) {
    score += 0.2;
    reasons.push(
      "Estimated installment is very high compared to income (DSR > 60%)."
    );
  } else if (debtServiceRatio > 0.4) {
    score += 0.12;
    reasons.push(
      "Estimated installment is high compared to income (DSR between 40% and 60%)."
    );
  } else if (debtServiceRatio < 0.25) {
    score -= 0.08;
    reasons.push(
      "Estimated installment is comfortably affordable (DSR below 25%)."
    );
  }

  // clamp between 0 and 1
  score = Math.min(1, Math.max(0, score));

  const riskBand =
    score < 0.25 ? "low" : score < 0.6 ? "medium" : "high";

  const decision =
    score < 0.3 && debtServiceRatio <= 0.3
      ? "approve"
      : score < 0.6 && debtServiceRatio <= 0.4
      ? "review"
      : "decline";

  return {
    defaultProbability: Number(score.toFixed(3)),
    riskBand,
    decision,
    reasons,
    installment: Number(installment.toFixed(2)),
    debtServiceRatio: Number(debtServiceRatio.toFixed(3)),
    termMonths: safeTermMonths,
    interestRate: safeInterestRate,
  };
}

