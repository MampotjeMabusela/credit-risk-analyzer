import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [applicationId, setApplicationId] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleUpload() {
    if (!file || !applicationId) {
      setStatus("Please choose a JSON file and enter an application ID.");
      return;
    }
    if (!supabase) {
      setStatus(
        "Supabase client is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      );
      return;
    }

    setLoading(true);
    setStatus("");

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const rawText = e.target?.result;
        const json = JSON.parse(rawText);

        const { error } = await supabase.functions.invoke("ingest-data", {
          body: {
            applicationId,
            sourceType: "upload",
            data: json,
          },
        });

        if (error) {
          setStatus(`Error ingesting data: ${error.message}`);
        } else {
          setStatus("Data ingested successfully.");
        }
      } catch (err) {
        setStatus("Failed to read or parse file. Ensure it is valid JSON.");
      } finally {
        setLoading(false);
      }
    };

    reader.readAsText(file);
  }

  return (
    <main className="container">
      <header>
        <h1>Upload Financial Data</h1>
        <p>
          Upload a JSON file of financial data for an existing application.
          This will be stored in Supabase and is ready for scoring.
        </p>
      </header>
      <section className="card">
        <label>
          Application ID
          <input
            type="text"
            value={applicationId}
            onChange={(e) => setApplicationId(e.target.value)}
            placeholder="UUID of application"
            style={{
              marginTop: "0.3rem",
              padding: "0.55rem 0.7rem",
              borderRadius: "999px",
              border: "1px solid var(--border-subtle)",
              background: "#020617",
              color: "var(--text-primary)",
            }}
          />
        </label>
        <label style={{ marginTop: "0.75rem" }}>
          Financial data file (JSON)
          <input
            type="file"
            accept=".json,application/json"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            style={{ marginTop: "0.3rem" }}
          />
        </label>
        <button
          type="button"
          onClick={handleUpload}
          disabled={loading}
          style={{ marginTop: "1rem" }}
        >
          {loading ? "Uploading…" : "Upload and Ingest"}
        </button>
        {status && (
          <p style={{ marginTop: "0.75rem", color: "var(--text-muted)" }}>
            {status}
          </p>
        )}
      </section>
    </main>
  );
}

