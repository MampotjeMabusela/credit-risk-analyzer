// Supabase Edge Function: ingest-data
// Ingest validated JSON financial data for a given application.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405 },
    );
  }

  const { applicationId, sourceType, data } = await req.json();

  if (!applicationId || !data) {
    return new Response(
      JSON.stringify({ error: "Missing applicationId or data" }),
      { status: 400 },
    );
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  // Basic validation hook – extend with your own rules
  if (Array.isArray(data) && data.length === 0) {
    return new Response(
      JSON.stringify({ error: "Data payload is empty" }),
      { status: 400 },
    );
  }

  const { error } = await supabase.from("financial_data").insert({
    application_id: applicationId,
    source_type: sourceType ?? "upload",
    data,
  });

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 },
    );
  }

  return new Response(
    JSON.stringify({ message: "Data ingested successfully" }),
    { status: 200 },
  );
});

