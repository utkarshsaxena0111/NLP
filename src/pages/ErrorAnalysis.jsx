
import React, { useState } from "react";
import { predictIntent } from "../services/api";

const C = {
  bg: "#0b1120",
  panel: "#111c30",
  inner: "#17263b",
  border: "#293c55",
  text: "#edf4ff",
  muted: "#91a4bd",
  green: "#34d399",
  blue: "#60a5fa",
  amber: "#fbbf24",
  red: "#fb7185",
  cyan: "#22d3ee"
};

const examples = [
  {
    label: "Supported control",
    query: "कल सुबह 7 बजे का अलार्म लगा दो"
  },
  {
    label: "Bank transfer request",
    query: "Transfer money from my bank account"
  },
  {
    label: "Unsupported capability",
    query: "Can you physically make me a cup of coffee?"
  },
  {
    label: "Ambiguous query",
    query: "start"
  }
];

const card = {
  background: C.panel,
  border: `1px solid ${C.border}`,
  borderRadius: 13,
  padding: 18
};

function statusColor(status) {
  if (status === "ACCEPTED") return C.green;
  if (status === "REVIEW_REQUIRED") return C.amber;
  if (status === "POTENTIALLY_UNSUPPORTED") return C.red;
  return C.muted;
}

function Info({ label, value, color = C.text }) {
  return (
    <div style={{
      background: C.inner,
      border: `1px solid ${C.border}`,
      borderRadius: 9,
      padding: 13,
      minWidth: 0
    }}>
      <div style={{ color: C.muted, fontSize: 10, marginBottom: 7 }}>
        {label}
      </div>
      <div style={{
        color,
        fontSize: 15,
        fontWeight: 750,
        overflowWrap: "anywhere"
      }}>
        {value ?? "—"}
      </div>
    </div>
  );
}

export default function ErrorAnalysis() {
  const [query, setQuery] = useState(examples[1].query);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function runTest(value = query) {
    const clean = String(value || "").trim();
    if (!clean || loading) return;

    setQuery(clean);
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await predictIntent(clean);
      setResult(response);
    } catch (err) {
      setError(err.message || "E58 prediction request failed.");
    } finally {
      setLoading(false);
    }
  }

  const guard = result?.reliability_guard;
  const guardStatus = guard?.status;
  const guardDiagnostics = guard?.diagnostics || {};
  const reasons = guard?.triggered_reasons || [];
  const top = result?.top5 || [];

  return (
    <div style={{
      minHeight: "100%",
      background: C.bg,
      color: C.text,
      padding: "27px clamp(15px, 3vw, 34px)",
      fontFamily: "Inter, Segoe UI, Arial, sans-serif"
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        <header style={{ marginBottom: 26 }}>
          <div style={{
            color: C.green,
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: 2,
            marginBottom: 9
          }}>
            BHARATINTENT-X / ROBUSTNESS
          </div>
          <h1 style={{
            fontSize: "clamp(26px, 4vw, 35px)",
            margin: 0,
            letterSpacing: "-.8px"
          }}>
            Error Analysis
          </h1>
          <p style={{ color: C.muted, fontSize: 13, marginTop: 8 }}>
            Inspect E58 predictions, native out-of-scope detection and E65 diagnostics.
          </p>
        </header>

        {/* Test input */}
        <section style={{ ...card, marginBottom: 22 }}>
          <h2 style={{ fontSize: 17, margin: "0 0 7px" }}>
            Query test bench
          </h2>
          <p style={{ color: C.muted, fontSize: 12, margin: "0 0 15px" }}>
            Run a real prediction against the E58 backend.
          </p>

          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            marginBottom: 13
          }}>
            {examples.map(item => (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  setQuery(item.query);
                  setResult(null);
                  setError("");
                }}
                style={{
                  background: query === item.query ? "#233c5b" : C.inner,
                  border: `1px solid ${query === item.query ? C.blue : C.border}`,
                  color: query === item.query ? C.blue : C.muted,
                  borderRadius: 8,
                  padding: "8px 11px",
                  fontSize: 11,
                  cursor: "pointer"
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          <textarea
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setResult(null);
              setError("");
            }}
            rows={3}
            placeholder="Enter a query to inspect..."
            style={{
              width: "100%",
              boxSizing: "border-box",
              resize: "vertical",
              background: C.inner,
              color: C.text,
              border: `1px solid ${C.border}`,
              borderRadius: 9,
              padding: 13,
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
              Live E58 inference · No local simulation
            </span>
            <button
              type="button"
              onClick={() => runTest()}
              disabled={loading || !query.trim()}
              style={{
                background: loading ? "#263750" : "#176b55",
                border: "1px solid #278c70",
                color: "#fff",
                borderRadius: 8,
                padding: "10px 18px",
                fontWeight: 700,
                fontSize: 12,
                cursor: loading || !query.trim() ? "not-allowed" : "pointer"
              }}
            >
              {loading ? "Running E58..." : "Run test →"}
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
            padding: 32,
            marginBottom: 22
          }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>⌕</div>
            <strong>Ready to test</strong>
            <p style={{ color: C.muted, fontSize: 12 }}>
              Choose an example or enter your own query.
            </p>
          </div>
        )}

        {loading && (
          <div style={{
            ...card,
            textAlign: "center",
            padding: 25,
            color: C.muted
          }}>
            Waiting for the E58 backend response...
          </div>
        )}

        {result && (
          <>
            {/* E58 prediction */}
            <section style={{ marginBottom: 22 }}>
              <h2 style={{ fontSize: 17, margin: "0 0 12px" }}>
                E58 prediction
              </h2>
              <div style={{
                ...card,
                borderLeft: `4px solid ${result.isOutOfScope ? C.red : C.green}`
              }}>
                <div style={{ color: C.muted, fontSize: 10, fontWeight: 700 }}>
                  PREDICTED INTENT
                </div>
                <div style={{
                  fontSize: 22,
                  fontWeight: 800,
                  margin: "8px 0"
                }}>
                  {result.displayName || result.intentName || `Class ${result.intentId}`}
                </div>
                <div style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  marginTop: 13
                }}>
                  <span style={pill(C.blue)}>Class {result.intentId}</span>
                  <span style={pill(C.cyan)}>E58</span>
                  <span style={pill(result.isOutOfScope ? C.red : C.green)}>
                    {result.isOutOfScope ? "Native OOS: Yes" : "Native OOS: No"}
                  </span>
                  <span style={pill(C.muted)}>
                    {result.script || "Script unavailable"}
                  </span>
                </div>
                <p style={{ color: C.muted, fontSize: 10, margin: "12px 0 0" }}>
                  Intent display names are dataset-derived, not official organizer labels.
                </p>
              </div>
            </section>

            {/* Diagnostics */}
            <section style={{ marginBottom: 22 }}>
              <h2 style={{ fontSize: 17, margin: "0 0 12px" }}>
                Prediction diagnostics
              </h2>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 12
              }}>
                <Info
                  label="Decision-score margin"
                  value={Number.isFinite(Number(result.margin))
                    ? Number(result.margin).toFixed(5) : "—"}
                  color={C.blue}
                />
                <Info
                  label="Expert agreement"
                  value={result.expertAgreement ? "Agreement" : "Disagreement"}
                  color={result.expertAgreement ? C.green : C.amber}
                />
                <Info
                  label="Neural expert class"
                  value={result.neuralIntent}
                  color={C.blue}
                />
                <Info
                  label="Lexical expert class"
                  value={result.lexicalIntent}
                  color={C.cyan}
                />
              </div>
            </section>

            {/* E65 assessment */}
            <section style={{ marginBottom: 22 }}>
              <h2 style={{ fontSize: 17, margin: "0 0 12px" }}>
                E65 reliability assessment
              </h2>
              <div style={card}>
                {guard ? (
                  <>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 10,
                      marginBottom: 15
                    }}>
                      <span style={{
                        color: statusColor(guardStatus),
                        fontSize: 16,
                        fontWeight: 800
                      }}>
                        {guardStatus || "Assessment returned"}
                      </span>
                      {guard.version && (
                        <span style={{ color: C.muted, fontSize: 10 }}>
                          {guard.version}
                        </span>
                      )}
                    </div>

                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                      gap: 10,
                      marginBottom: 14
                    }}>
                      <Info
                        label="Detected domain"
                        value={guard.detected_domain || "None reported"}
                      />
                      <Info
                        label="Prediction unchanged"
                        value={guard.prediction_unchanged === true ? "Yes" :
                          guard.prediction_unchanged === false ? "No" : "Not reported"}
                        color={guard.prediction_unchanged === true ? C.green : C.muted}
                      />
                    </div>

                    <div style={{ marginBottom: 13 }}>
                      <div style={{
                        color: C.muted,
                        fontSize: 10,
                        fontWeight: 700,
                        marginBottom: 7
                      }}>
                        TRIGGERED REASONS
                      </div>
                      {reasons.length ? (
                        <div style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 7
                        }}>
                          {reasons.map((reason, index) => (
                            <span key={`${reason}-${index}`} style={pill(C.amber)}>
                              {reason}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span style={{ color: C.muted, fontSize: 12 }}>
                          No triggered reasons reported.
                        </span>
                      )}
                    </div>

                    {guard.recommended_action && (
                      <div style={{
                        background: C.inner,
                        borderRadius: 9,
                        padding: 13
                      }}>
                        <div style={{
                          color: C.muted,
                          fontSize: 10,
                          fontWeight: 700,
                          marginBottom: 6
                        }}>
                          RECOMMENDED ACTION
                        </div>
                        <p style={{
                          color: C.text,
                          fontSize: 12,
                          lineHeight: 1.7,
                          margin: 0
                        }}>
                          {guard.recommended_action}
                        </p>
                      </div>
                    )}

                    {Object.keys(guardDiagnostics).length > 0 && (
                      <div style={{
                        color: C.muted,
                        fontSize: 11,
                        marginTop: 13,
                        lineHeight: 1.7
                      }}>
                        Expert agreement: {String(guardDiagnostics.expert_agreement ?? "—")}
                        {" · "}
                        Margin: {guardDiagnostics.top1_top2_margin != null
                          ? Number(guardDiagnostics.top1_top2_margin).toFixed(5)
                          : "—"}
                      </div>
                    )}
                  </>
                ) : (
                  <p style={{ color: C.muted, fontSize: 12, margin: 0 }}>
                    No E65 assessment was included in the API response.
                  </p>
                )}
              </div>
            </section>

            {/* Top candidates */}
            <section style={{ marginBottom: 22 }}>
              <h2 style={{ fontSize: 17, margin: "0 0 12px" }}>
                Alternative intent candidates
              </h2>
              <div style={card}>
                {top.length ? top.map((item, index) => (
                  <div key={`${item.intentId}-${index}`} style={{
                    display: "grid",
                    gridTemplateColumns: "38px 1fr auto",
                    alignItems: "center",
                    gap: 10,
                    padding: "11px 0",
                    borderBottom: index === top.length - 1
                      ? "none" : `1px solid ${C.border}`
                  }}>
                    <strong style={{
                      color: index === 0 ? C.green : C.muted,
                      fontSize: 12
                    }}>
                      #{index + 1}
                    </strong>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700 }}>
                        {item.displayName}
                      </div>
                      <div style={{ color: C.muted, fontSize: 10, marginTop: 3 }}>
                        Class {item.intentId}
                      </div>
                    </div>
                    <strong style={{ color: C.blue, fontSize: 12 }}>
                      {Number(item.score).toFixed(5)}
                    </strong>
                  </div>
                )) : (
                  <p style={{ color: C.muted, fontSize: 12 }}>
                    No alternative candidates returned.
                  </p>
                )}
              </div>
            </section>

            <div style={{
              color: C.muted,
              fontSize: 10,
              borderTop: `1px solid ${C.border}`,
              paddingTop: 14
            }}>
              E58 decision scores are not calibrated probabilities.
              Native OOS and E65 reliability status are separate signals.
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
    fontWeight: 700,
    overflowWrap: "anywhere"
  };
}
