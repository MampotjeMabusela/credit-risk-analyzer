// Simple credit risk scoring API route (South African context, ZAR).
// This runs on the server (Vercel function / Next.js API route).

import { supabase } from "../../lib/supabaseClient";
import { scoreProfile } from "../../lib/scoreProfile";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    income,
    age,
    loanAmount,
    employmentYears,
    creditHistoryLength,
    termMonths,
    interestRate,
  } = req.body || {};

  if (
    typeof income !== "number" ||
    typeof age !== "number" ||
    typeof loanAmount !== "number" ||
    typeof employmentYears !== "number" ||
    typeof creditHistoryLength !== "number"
  ) {
    return res.status(400).json({ error: "Invalid or missing input fields" });
  }

  const result = scoreProfile({
    income,
    age,
    loanAmount,
    employmentYears,
    creditHistoryLength,
    termMonths,
    interestRate,
  });

  // Optionally log to Supabase if configured
  if (supabase) {
    try {
      await supabase.from("loans").insert({
        income,
        loan_amount: loanAmount,
        interest_rate: result.interestRate,
        credit_score: null,
        defaulted: null,
      });
    } catch (e) {
      // Failing to write to Supabase should not break the API.
      // eslint-disable-next-line no-console
      console.warn("Supabase insert failed", e.message);
    }
  }

  return res.status(200).json(result);
}

