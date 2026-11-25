
import React, { useState } from "react";
import { explainPrediction } from "../services/api";

const C = {
  bg: "#0b1120",
  panel: "#111c30",
  inner: "#17263b",
  border: "#293c55",
  text: "#edf4ff",
  muted: "#91a4bd",
  green: "#34d399",
  blue: "#60a5fa",
  cyan: "#22d3ee",
  amber: "#fbbf24",
  red: "#fb7185"
};

const card = {
  background: C.panel,
  border: `1px solid ${C.border}`,
  borderRadius: 13,
  padding: 18
};

function formatScore(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n.toFixed(5) : "—";
}

function scoreEntries(value) {
  if (Array.isArray(value)) {
    return value.map((item, index) => ({
      id: typeof item === "object" ? item.intent_id ?? item.intentId ?? index : index,
      score: typeof item === "object" ? item.score : item
    }));
  }

  if (value && typeof value === "object") {
    return Object.entries(value).map(([id, score]) => ({
      id,
      score
    }));
  }

  return [];
}

function Section({ title, subtitle, children }) {
  return (
    <section style={{ marginBottom: 22 }}>
      <div style={{ marginBottom: 12 }}>
        <h2 style={{ color: C.text, fontSize: 17, margin: 0 }}>{title}</h2>
        {subtitle && (
          <p style={{ color: C.muted, fontSize: 12, margin: "5px 0 0" }}>
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

function ScoreList({ title, values, color }) {
  const entries = scoreEntries(values)
    .filter(item => Number.isFinite(Number(item.score)))
    .sort((a, b) => Number(b.score) - Number(a.score))
    .slice(0, 5);

  return (
    <div style={card}>
      <h3 style={{ color, fontSize: 14, margin: "0 0 15px" }}>{title}</h3>
      {entries.length === 0 ? (
        <p style={{ color: C.muted, fontSize: 12 }}>
          Score vector unavailable in API response.
        </p>
      ) : (
        entries.map((item, index) => (
          <div key={`${item.id}-${index}`} style={{ marginBottom: 13 }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 10,
              fontSize: 11,
              marginBottom: 6
            }}>
              <span style={{ color: C.text }}>Class {item.id}</span>
              <strong style={{ color }}>{formatScore(item.score)}</strong>
            </div>
            <div style={{
              height: 6,
              background: "#263750",
              borderRadius: 10,
              overflow: "hidden"
            }}>
              <div style={{
                height: "100%",
                width: `${Math.max(0, Math.min(100, Math.abs(Number(item.score)) * 100))}%`,
                background: color,
                borderRadius: 10
              }} />
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default function ModelExplainability() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function runInspection() {
    if (!query.trim() || loading) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await explainPrediction(query.trim());
      setResult(response);
    } catch (err) {
      setError(err.message || "Unable to retrieve E58 prediction.");
    } finally {
      setLoading(false);
    }
  }

  const guard = result?.reliability_guard;
  const top = result?.top5 || [];

  return (
    <div style={{
      background: C.bg,
      minHeight: "100%",
      padding: "27px clamp(15px, 3vw, 34px)",
      color: C.text,
      fontFamily: "Inter, Segoe UI, Arial, sans-serif"
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <header style={{ marginBottom: 25 }}>
          <div style={{
            color: C.green,
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: 2,
            marginBottom: 9
          }}>
            BHARATINTENT-X / MODEL ANALYSIS
          </div>
          <h1 style={{
            fontSize: "clamp(26px, 4vw, 35px)",
            margin: 0,
            letterSpacing: "-.8px"
          }}>
            Model Explainability
          </h1>
          <p style={{ color: C.muted, fontSize: 13, marginTop: 8 }}>
            Inspect the actual E58 prediction and its expert decision scores.
          </p>
        </header>

        {/* Query */}
        <section style={{ ...card, marginBottom: 22 }}>
          <label style={{
            display: "block",
            color: C.muted,
            fontSize: 11,
            fontWeight: 700,
            marginBottom: 10
          }}>
            QUERY TO INSPECT
          </label>
          <textarea
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                runInspection();
              }
            }}
            placeholder="Enter an English, Hindi or Hinglish query..."
            rows={3}
            style={{
              width: "100%",
              boxSizing: "border-box",
              resize: "vertical",
              background: C.inner,
              border: `1px solid ${C.border}`,
              borderRadius: 9,
              padding: 13,
              color: C.text,
              fontSize: 13,
              outline: "none"
            }}
          />
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
            marginTop: 12
          }}>
            <span style={{ color: C.muted, fontSize: 11 }}>
              Connected to the E58 inference API
            </span>
            <button
              type="button"
              onClick={runInspection}
              disabled={loading || !query.trim()}
              style={{
                background: loading ? "#263750" : "#176b55",
                border: "1px solid #278c70",
                color: "#fff",
                padding: "10px 19px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                cursor: loading || !query.trim() ? "not-allowed" : "pointer"
              }}
            >
              {loading ? "Inspecting..." : "Inspect prediction →"}
            </button>
          </div>
          {error && (
            <div style={{
              marginTop: 13,
              padding: 12,
              borderRadius: 8,
              background: "#3a1824",
              color: "#fda4af",
              fontSize: 12
            }}>
              {error}
            </div>
          )}
        </section>

        {!result && !loading && !error && (
          <div style={{
            ...card,
            textAlign: "center",
            padding: 38
          }}>
            <div style={{ fontSize: 25, marginBottom: 10 }}>⌕</div>
            <h3 style={{ margin: 0, fontSize: 16 }}>Ready to inspect</h3>
            <p style={{ color: C.muted, fontSize: 12 }}>
              Enter a query to retrieve its actual E58 prediction.
            </p>
          </div>
        )}

        {loading && (
          <div style={{ ...card, textAlign: "center", padding: 30, color: C.muted }}>
            Requesting prediction from E58...
          </div>
        )}

        {result && (
          <>
            {/* Prediction */}
            <Section
              title="Prediction result"
              subtitle="Original E58 output"
            >
              <div style={{
                ...card,
                borderLeft: `4px solid ${C.green}`
              }}>
                <div style={{ color: C.muted, fontSize: 10, fontWeight: 700 }}>
                  PREDICTED INTENT
                </div>
                <div style={{
                  fontSize: 23,
                  fontWeight: 800,
                  margin: "8px 0"
                }}>
                  {result.displayName || result.intentName || `Class ${result.intentId}`}
                </div>
                <div style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 9,
                  marginTop: 14
                }}>
                  <span style={pill(C.blue)}>Class ID: {result.intentId}</span>
                  <span style={pill(C.cyan)}>Model: E58</span>
                  <span style={pill(C.muted)}>
                    {result.script || "Script not reported"}
                  </span>
                  <span style={pill(result.isOutOfScope ? C.red : C.green)}>
                    {result.isOutOfScope ? "Native OOS: Yes" : "Native OOS: No"}
                  </span>
                </div>
                <p style={{ color: C.muted, fontSize: 10, margin: "13px 0 0" }}>
                  Display label is dataset-derived, not an official organizer label.
                </p>
              </div>
            </Section>

            {/* Diagnostics */}
            <Section title="Decision diagnostics">
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 12
              }}>
                <div style={card}>
                  <div style={{ color: C.muted, fontSize: 11 }}>Top-1 vs Top-2 margin</div>
                  <div style={{ color: C.blue, fontSize: 22, fontWeight: 800, marginTop: 8 }}>
                    {formatScore(result.margin)}
                  </div>
                  <div style={{ color: C.muted, fontSize: 10, marginTop: 5 }}>
                    Normalized decision-score margin
                  </div>
                </div>
                <div style={card}>
                  <div style={{ color: C.muted, fontSize: 11 }}>Expert agreement</div>
                  <div style={{
                    color: result.expertAgreement ? C.green : C.amber,
                    fontSize: 19,
                    fontWeight: 800,
                    marginTop: 8
                  }}>
                    {result.expertAgreement ? "AGREEMENT" : "DISAGREEMENT"}
                  </div>
                  <div style={{ color: C.muted, fontSize: 10, marginTop: 5 }}>
                    Neural and lexical expert predictions
                  </div>
                </div>
                <div style={card}>
                  <div style={{ color: C.muted, fontSize: 11 }}>Neural expert class</div>
                  <div style={{ color: C.blue, fontSize: 22, fontWeight: 800, marginTop: 8 }}>
                    {result.neuralIntent ?? "—"}
                  </div>
                </div>
                <div style={card}>
                  <div style={{ color: C.muted, fontSize: 11 }}>Lexical expert class</div>
                  <div style={{ color: C.cyan, fontSize: 22, fontWeight: 800, marginTop: 8 }}>
                    {result.lexicalIntent ?? "—"}
                  </div>
                </div>
              </div>
            </Section>

            {/* Top five */}
            <Section
              title="Top intent candidates"
              subtitle="Ranked alternatives returned by E58"
            >
              <div style={card}>
                {top.length === 0 ? (
                  <p style={{ color: C.muted, fontSize: 12 }}>
                    Top intent list not provided by the API.
                  </p>
                ) : top.map((item, index) => (
                  <div key={`${item.intentId}-${index}`} style={{
                    display: "grid",
                    gridTemplateColumns: "35px 1fr auto",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 0",
                    borderBottom: index === top.length - 1 ? "none" : `1px solid ${C.border}`
                  }}>
                    <span style={{
                      color: index === 0 ? C.green : C.muted,
                      fontSize: 12,
                      fontWeight: 800
                    }}>
                      #{index + 1}
                    </span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>
                        {item.displayName}
                      </div>
                      <div style={{ color: C.muted, fontSize: 10, marginTop: 3 }}>
                        Class {item.intentId}
                      </div>
                    </div>
                    <strong style={{ color: C.blue, fontSize: 12 }}>
                      {formatScore(item.score)}
                    </strong>
                  </div>
                ))}
              </div>
            </Section>

            {/* Expert vectors */}
            <Section
              title="Expert decision scores"
              subtitle="Highest five scores from each available expert vector"
            >
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 13
              }}>
                <ScoreList
                  title="MuRIL neural expert"
                  values={result.subscores?.neural}
                  color={C.blue}
                />
                <ScoreList
                  title="Dual TF-IDF lexical experts"
                  values={result.subscores?.lexical}
                  color={C.cyan}
                />
              </div>
            </Section>

            {/* E65 */}
            <Section title="E65 reliability assessment">
              <div style={card}>
                {guard ? (
                  <>
                    <div style={{
                      fontSize: 15,
                      fontWeight: 800,
                      color:
                        guard.status === "ACCEPTED" ? C.green :
                        guard.status === "REVIEW_REQUIRED" ? C.amber : C.red
                    }}>
                      {guard.status || "Assessment returned"}
                    </div>
                    <pre style={{
                      whiteSpace: "pre-wrap",
                      overflowWrap: "anywhere",
                      color: C.muted,
                      fontSize: 11,
                      lineHeight: 1.6,
                      marginBottom: 0
                    }}>
                      {JSON.stringify(guard, null, 2)}
                    </pre>
                  </>
                ) : (
                  <p style={{ color: C.muted, fontSize: 12, margin: 0 }}>
                    No E65 reliability assessment was included in this API response.
                  </p>
                )}
              </div>
            </Section>

            <div style={{
              color: C.muted,
              fontSize: 10,
              borderTop: `1px solid ${C.border}`,
              paddingTop: 14
            }}>
              E58 normalized decision scores · Not calibrated probabilities · No token-level attribution available
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function pill(color) {
  return {
    display: "inline-block",
    padding: "6px 9px",
    borderRadius: 7,
    background: `${color}18`,
    border: `1px solid ${color}55`,
    color,
    fontSize: 10,
    fontWeight: 700
  };
}
