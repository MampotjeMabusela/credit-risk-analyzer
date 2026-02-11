// Supabase Edge Function: predict-credit-score
// Fetches latest financial_data for an application and calls external model API.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405 },
    );
  }

  const { applicationId } = await req.json();

  if (!applicationId) {
    return new Response(
      JSON.stringify({ error: "Missing applicationId" }),
      { status: 400 },
    );
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const modelApiUrl = Deno.env.get("MODEL_API_URL") ??
    "http://localhost:8000/predict_pd";

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const { data: financialRow, error: fetchError } = await supabase
    .from("financial_data")
    .select("data")
    .eq("application_id", applicationId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (fetchError || !financialRow) {
    return new Response(
      JSON.stringify({ error: "Financial data not found" }),
      { status: 404 },
    );
  }

  const modelResponse = await fetch(modelApiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(financialRow.data),
  });

  if (!modelResponse.ok) {
    return new Response(
      JSON.stringify({ error: "Model inference failed" }),
      { status: 500 },
    );
  }

  const prediction = await modelResponse.json();

  const { pd, lgd, ead, decision, reasons } = prediction;

  const { error: modelInsertError } = await supabase.from("model_runs").insert({
    application_id: applicationId,
    model_name: prediction.model_name ?? "pd_model_v1",
    pd,
    lgd,
    ead,
    score: prediction,
  });

  if (modelInsertError) {
    return new Response(
      JSON.stringify({ error: modelInsertError.message }),
      { status: 500 },
    );
  }

  const { error: decisionError } = await supabase.from("decisions").insert({
    application_id: applicationId,
    decision: decision ?? "review",
    credit_limit: prediction.credit_limit ?? null,
    interest_rate: prediction.interest_rate ?? null,
    reasons: reasons ?? [],
  });

  if (decisionError) {
    return new Response(
      JSON.stringify({ error: decisionError.message }),
      { status: 500 },
    );
  }

  return new Response(
    JSON.stringify({ pd, lgd, ead, decision, reasons }),
    { status: 200 },
  );
});

