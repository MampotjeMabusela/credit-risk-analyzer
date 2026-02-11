import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ScoresPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (supabase) {
      fetchScores();
    } else {
      setError("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local");
    }
  }, []);

  async function fetchScores() {
    if (!supabase) {
      setError("Supabase is not configured.");
      return;
    }
    setLoading(true);
    setError(null);

    // Try with join first; fallback to model_runs only if join fails (e.g. RLS or missing tables)
    const { data, error: err } = await supabase
      .from("model_runs")
      .select(
        `
        id,
        application_id,
        pd,
        lgd,
        ead,
        model_name,
        created_at,
        applications (
          id,
          requested_amount,
          clients (
            name
          )
        )
      `
      )
      .order("created_at", { ascending: false })
      .limit(100);

    if (err) {
      const fallback = await supabase
        .from("model_runs")
        .select("id, application_id, pd, lgd, ead, model_name, created_at")
        .order("created_at", { ascending: false })
        .limit(100);

      if (fallback.error) {
        setError(fallback.error.message || "Failed to load scores. Ensure Supabase schema is applied and RLS allows read.");
        setRows([]);
      } else {
        setRows(fallback.data ?? []);
        setError(null);
      }
    } else {
      setRows(data ?? []);
    }
    setLoading(false);
  }

  const clientName = (row) =>
    row.applications?.clients?.name ?? "—";
  const requestedAmount = (row) =>
    row.applications?.requested_amount ?? "—";

  return (
    <main className="container">
      <header>
        <h1>Credit Scores</h1>
        <p>Latest PD / LGD / EAD outputs per application.</p>
      </header>
      <section className="card">
        {error && (
          <p style={{ color: "var(--danger)", marginBottom: "0.75rem" }}>
            {error}
          </p>
        )}
        <button type="button" onClick={fetchScores} disabled={loading}>
          {loading ? "Refreshing…" : "Refresh"}
        </button>
        <div style={{ maxHeight: 420, overflow: "auto", marginTop: "0.75rem" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Application</th>
                <th>Model</th>
                <th>PD %</th>
                <th>LGD %</th>
                <th>EAD</th>
                <th>Scored At</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>{clientName(row)}</td>
                  <td>{requestedAmount(row)}</td>
                  <td>{row.model_name ?? "—"}</td>
                  <td>
                    {row.pd != null ? (row.pd * 100).toFixed(1) : "—"}
                  </td>
                  <td>
                    {row.lgd != null ? (row.lgd * 100).toFixed(1) : "—"}
                  </td>
                  <td>{row.ead ?? "—"}</td>
                  <td>
                    {row.created_at
                      ? new Date(row.created_at).toLocaleString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && rows.length === 0 && !error && (
            <p style={{ marginTop: "0.75rem", color: "var(--text-muted)" }}>
              No model runs found yet. Ingest data and trigger scoring to see
              results here.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

