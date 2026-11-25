
import React, { useState } from "react";
import {
  MessageSquareText,
  Sparkles,
  Cpu,
  Copy,
  Check,
  RotateCcw,
  Play,
  History,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

import { MODELS_REGISTRY } from "../data/modelsRegistry";
import { predictIntent } from "../services/api";

const PROMPT_EXAMPLE_QUERIES = [
  {
    label: "Hindi (Devanagari)",
    text: "कल सुबह अलार्म लगाओ।",
  },
  {
    label: "Romanized Hindi",
    text: "Kal subah alarm lagao.",
  },
  {
    label: "Hinglish",
    text: "Kal morning ka alarm set karo.",
  },
  {
    label: "English",
    text: "Set an alarm for tomorrow morning.",
  },
  {
    label: "Smart Lighting Off",
    text: "कृपया रसोईघर की बत्तियां बंद कर दें",
  },
  {
    label: "Robot Vacuum",
    text: "vaikyum on karo aur drawing room saaf karo",
  },
  {
    label: "Cooking Query",
    text: "palak paneer me bright green color kaise maintain karein",
  },
  {
    label: "Out of Scope Test",
    text: "ओली मुझे अभी एक कप गर्म कॉफ़ी बना कर दो",
  },
];

const REASON_LABELS = {
  unsupported_domain_pattern: "Unsupported action and domain detected",
  neural_lexical_expert_disagreement:
    "Neural and lexical experts disagree",
  low_top1_top2_decision_score_margin:
    "Small top-1/top-2 decision-score margin",
};

function formatReason(reason) {
  if (!reason) return "";

  const [key, value] = reason.split(":");

  const label =
    REASON_LABELS[key] ||
    key.replaceAll("_", " ");

  return value
    ? `${label}: ${value.replaceAll("_", " ")}`
    : label;
}

function getGuardMessage(guard) {
  if (!guard) return "";

  const domain = guard.detected_domain;

  if (guard.status === "POTENTIALLY_UNSUPPORTED") {
    if (domain === "banking_transfer") {
      return (
        "A potentially unsupported banking-transfer action was detected. " +
        "The current 56-class taxonomy does not provide a verified " +
        "dedicated banking-transfer intent."
      );
    }

    if (domain === "loan_credit") {
      return (
        "A potentially unsupported loan or credit action was detected. " +
        "Manual review or clarification is recommended."
      );
    }

    if (domain === "bill_payment") {
      return (
        "A potentially unsupported bill-payment action was detected. " +
        "Manual review or clarification is recommended."
      );
    }

    return (
      "A potentially unsupported action-domain combination was detected."
    );
  }

  if (guard.status === "REVIEW_REQUIRED") {
    return (
      "Additional review is recommended. The original E58 prediction " +
      "has not been changed."
    );
  }

  return "";
}

export default function LiveInference({ initialQuery = "" }) {
  const [query, setQuery] = useState(
    initialQuery || "कल सुबह 7 बजे का अलार्म लगा दो"
  );

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const activeModelMeta =
    MODELS_REGISTRY.find((m) => m.id === "e58") ||
    MODELS_REGISTRY[0];

  const handleRunInference = async (inputQuery = query) => {
    const cleanQuery = String(inputQuery || "").trim();

    if (!cleanQuery) {
      setError("Please enter a query before running inference.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await predictIntent(cleanQuery, "e58");

      setResult(res);

      setHistory((prev) => [
        {
          id: Date.now(),
          query: cleanQuery,
          displayName: res.displayName,
          intentId: res.intentId ?? res.intent_id,
          margin: res.margin,
          script: res.script,
          guardStatus: res.reliability_guard?.status,
          time: new Date().toLocaleTimeString(),
        },
        ...prev.slice(0, 9),
      ]);
    } catch (e) {
      console.error("E58 inference error:", e);
      setError(e.message || "Unable to run E58 inference.");
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyResult = async () => {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(
        JSON.stringify(result, null, 2)
      );

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Clipboard error:", e);
      setError("Could not copy the prediction payload.");
    }
  };

  const handleExampleClick = (exampleText) => {
    setQuery(exampleText);
    handleRunInference(exampleText);
  };

  const getIntentId = (item) =>
    item.intentId ?? item.intent_id ?? item.classId;

  const getScore = (item) => {
    const value = Number(item.score);
    return Number.isFinite(value) ? value.toFixed(4) : "N/A";
  };

  const guard = result?.reliability_guard;

  const guardReasons = guard?.triggered_reasons || [];
  const guardMessage = getGuardMessage(guard);

  const showGuardBanner =
    guard?.status === "POTENTIALLY_UNSUPPORTED" ||
    guard?.status === "REVIEW_REQUIRED";

  const intentId = result?.intentId ?? result?.intent_id;

  const decisionMargin =
    result?.margin == null
      ? null
      : Number(result.margin);

  const expertAgreement =
    result?.expertAgreement ?? result?.expert_agreement;

  return (
    <div>
      {/* PAGE HEADER */}

      <div className="page-header">
        <div>
          <div className="page-eyebrow">
            <span className="pulse-dot"></span>
            REAL-TIME MULTILINGUAL INFERENCE
          </div>

          <h1 className="page-title">
            Live Intent Recognition
          </h1>

          <p className="page-description">
            Actual E58 multilingual intent inference with
            decision-score diagnostics and a separate reliability
            assessment.
          </p>
        </div>
      </div>

      <div className="inference-workspace">
        {/* INPUT QUERY */}

        <div className="panel query-input-card">
          <div className="panel-header">
            <div className="panel-title-area">
              <h3>Multilingual Input Query</h3>

              <p>
                Supports Devanagari Hindi, Romanized Hindi,
                Hinglish and Indian English.
              </p>
            </div>

            <button
              className="icon-button"
              onClick={() => {
                setQuery("");
                setResult(null);
                setError("");
              }}
              title="Clear input"
            >
              <RotateCcw size={14} />
            </button>
          </div>

          <textarea
            className="query-textarea"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter a query in Hindi, Romanized Hindi or English..."
          />

          {/* EXAMPLE QUERIES */}

          <div className="example-chips-row">
            <span
              style={{
                fontSize: 10,
                color: "#94a3b8",
                fontWeight: 600,
              }}
            >
              Test Queries:
            </span>

            {PROMPT_EXAMPLE_QUERIES.map((example) => (
              <button
                key={example.label}
                className="example-chip"
                disabled={isLoading}
                onClick={() => handleExampleClick(example.text)}
              >
                {example.label}
              </button>
            ))}
          </div>

          {/* MODEL INFORMATION */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              marginTop: 12,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <label
                style={{
                  fontSize: 11,
                  color: "#94a3b8",
                  fontWeight: 600,
                }}
              >
                MODEL:
              </label>

              <span
                style={{
                  fontSize: 12,
                  color: "#f8fafc",
                  fontWeight: 600,
                }}
              >
                BharatIntent-X E58
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 11,
                color: "#94a3b8",
              }}
            >
              <Cpu size={14} color="#06b6d4" />
              <span>
                {activeModelMeta?.parameters || "247M parameters"}
              </span>
            </div>
          </div>

          {/* RUN INFERENCE */}

          <button
            className="analyze-button"
            onClick={() => handleRunInference()}
            disabled={!query.trim() || isLoading}
          >
            {isLoading ? (
              <>Running E58 Inference...</>
            ) : (
              <>
                <Play size={15} fill="currentColor" />
                Analyze Intent Across 56 Classes
              </>
            )}
          </button>

          {/* BACKEND STATUS */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginTop: 14,
              fontSize: 10,
              color: "#94a3b8",
            }}
          >
            <ShieldCheck size={14} color="#10b981" />

            <span>
              {result?.isLiveBackend
                ? "Live E58 FastAPI Backend Connected"
                : "Run inference to verify backend connection"}
            </span>
          </div>

          {error && (
            <div
              style={{
                marginTop: 12,
                padding: 12,
                borderRadius: 8,
                background: "rgba(244,63,94,0.10)",
                border: "1px solid rgba(244,63,94,0.5)",
                color: "#fda4af",
                fontSize: 12,
              }}
            >
              <AlertTriangle
                size={14}
                style={{
                  display: "inline",
                  marginRight: 6,
                }}
              />
              {error}
            </div>
          )}
        </div>

        {/* PREDICTION RESULT */}

        <div className="panel">
          <div className="panel-header">
            <div className="panel-title-area">
              <h3>Inference Output & Score Distribution</h3>

              <p>
                Ranked decision scores, expert agreement and
                reliability assessment.
              </p>
            </div>

            {result && (
              <button
                className="action-btn secondary"
                style={{
                  height: 30,
                  fontSize: 10,
                  padding: "0 10px",
                }}
                onClick={handleCopyResult}
              >
                {copied ? (
                  <Check size={13} color="#10b981" />
                ) : (
                  <Copy size={13} />
                )}

                <span>
                  {copied ? "Copied JSON" : "Copy Payload"}
                </span>
              </button>
            )}
          </div>

          {result ? (
            <div>
              {/* E65 RELIABILITY ASSESSMENT */}

              {showGuardBanner && (
                <div
                  style={{
                    margin: "12px 0",
                    padding: 14,
                    borderRadius: 8,
                    background: "rgba(245,158,11,0.12)",
                    border: "1px solid #f59e0b",
                    color: "#fbbf24",
                    fontSize: 12,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                    }}
                  >
                    <AlertTriangle size={15} />

                    <b>
                      E65 Reliability Assessment: {guard.status}
                    </b>
                  </div>

                  <p
                    style={{
                      margin: "8px 0 0",
                      color: "#e2e8f0",
                      lineHeight: 1.6,
                    }}
                  >
                    {guardMessage}
                  </p>

                  {guard.detected_domain && (
                    <p
                      style={{
                        margin: "7px 0 0",
                        color: "#fbbf24",
                      }}
                    >
                      Detected domain:{" "}
                      <b>
                        {guard.detected_domain.replaceAll("_", " ")}
                      </b>
                    </p>
                  )}

                  {guardReasons.length > 0 && (
                    <div
                      style={{
                        marginTop: 9,
                        color: "#cbd5e1",
                      }}
                    >
                      <b>Diagnostic signals:</b>

                      <ul
                        style={{
                          paddingLeft: 18,
                          margin: "5px 0",
                        }}
                      >
                        {guardReasons.map((reason, index) => (
                          <li key={`${reason}-${index}`}>
                            {formatReason(reason)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <p
                    style={{
                      margin: "8px 0 0",
                      color: "#94a3b8",
                    }}
                  >
                    The original E58 prediction, class ID and scores
                    are preserved.
                  </p>
                </div>
              )}

              {/* ORIGINAL E58 PREDICTION */}

              <div className="prediction-badge-banner">
                <div className="prediction-badge-icon">
                  <Sparkles size={24} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      flexWrap: "wrap",
                      marginBottom: 2,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: 1.2,
                        color: "#06b6d4",
                      }}
                    >
                      ORIGINAL E58 INTENT ID: {intentId}
                    </span>

                    {result.isOutOfScope ||
                    result.out_of_scope === true ? (
                      <span
                        style={{
                          fontSize: 9,
                          padding: "2px 8px",
                          borderRadius: 12,
                          background: "rgba(244,63,94,0.2)",
                          color: "#fda4af",
                          border: "1px solid #f43f5e",
                        }}
                      >
                        Native OOS (Class 55)
                      </span>
                    ) : (
                      <span
                        style={{
                          fontSize: 9,
                          padding: "2px 8px",
                          borderRadius: 12,
                          background: "rgba(16,185,129,0.2)",
                          color: "#6ee7b7",
                          border: "1px solid #10b981",
                        }}
                      >
                        E58 Predicted Class
                      </span>
                    )}
                  </div>

                  <h2
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: "#f8fafc",
                      margin: "2px 0 4px",
                      letterSpacing: -0.4,
                    }}
                  >
                    {result.displayName ||
                      result.intentName ||
                      `Intent Class ${intentId}`}
                  </h2>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      fontSize: 11,
                      color: "#94a3b8",
                      flexWrap: "wrap",
                    }}
                  >
                    <span>
                      Script:{" "}
                      <b style={{ color: "#38bdf8" }}>
                        {result.script || "Not supplied"}
                      </b>
                    </span>

                    <span>
                      Model: <b>E58</b>
                    </span>
                  </div>
                </div>
              </div>

              {/* SCORE INFORMATION */}

              <div className="confidence-meter">
                <div className="meter-header">
                  <span>Score Type</span>

                  <b
                    style={{
                      color: "#38bdf8",
                      fontSize: 12,
                    }}
                  >
                    Decision Scores
                  </b>
                </div>

                <p
                  style={{
                    color: "#94a3b8",
                    fontSize: 11,
                    marginTop: 8,
                  }}
                >
                  E58 returns normalized decision scores,
                  not calibrated probabilities. Scores are
                  not confidence percentages.
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: 18,
                    flexWrap: "wrap",
                    marginTop: 10,
                    fontSize: 11,
                    color: "#94a3b8",
                  }}
                >
                  <span>
                    Decision margin:{" "}
                    <b style={{ color: "#f8fafc" }}>
                      {decisionMargin !== null &&
                      Number.isFinite(decisionMargin)
                        ? decisionMargin.toFixed(4)
                        : "N/A"}
                    </b>
                  </span>

                  <span>
                    Expert agreement:{" "}
                    <b style={{ color: "#f8fafc" }}>
                      {expertAgreement === true
                        ? "Yes"
                        : expertAgreement === false
                        ? "No"
                        : "Not supplied"}
                    </b>
                  </span>
                </div>
              </div>

              {/* TOP 5 DECISION SCORES */}

              <div style={{ marginBottom: 16 }}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#94a3b8",
                    letterSpacing: 0.8,
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  TOP 5 PREDICTED INTENT CANDIDATES
                </div>

                <div className="top5-list">
                  {(result.top5 || []).map((item, idx) => {
                    const candidateId = getIntentId(item);

                    return (
                      <div
                        key={candidateId ?? idx}
                        className={`top5-item ${
                          idx === 0 ? "winner" : ""
                        }`}
                      >
                        <b
                          style={{
                            color:
                              idx === 0 ? "#6ee7b7" : "#64748b",
                          }}
                        >
                          #{idx + 1}
                        </b>

                        <div style={{ minWidth: 0 }}>
                          <b style={{ color: "#f8fafc" }}>
                            {item.displayName ||
                              item.intentName ||
                              `Intent Class ${candidateId}`}
                          </b>

                          <span
                            style={{
                              fontSize: 9,
                              color: "#94a3b8",
                              marginLeft: 8,
                            }}
                          >
                            (Intent ID: {candidateId ?? "N/A"})
                          </span>

                          <div
                            style={{
                              fontSize: 9,
                              color: "#64748b",
                            }}
                          >
                            Dataset-derived display label
                          </div>
                        </div>

                        <div style={{ textAlign: "right" }}>
                          <b
                            style={{
                              color:
                                idx === 0 ? "#34d399" : "#94a3b8",
                            }}
                          >
                            {getScore(item)}
                          </b>

                          <div
                            style={{
                              fontSize: 9,
                              color: "#64748b",
                            }}
                          >
                            Decision score
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {(!result.top5 ||
                    result.top5.length === 0) && (
                    <p
                      style={{
                        color: "#94a3b8",
                        fontSize: 11,
                      }}
                    >
                      Top intent scores were not supplied by
                      the backend.
                    </p>
                  )}
                </div>
              </div>

              {/* E65 GUARD DETAILS */}

              {guard && (
                <div
                  style={{
                    borderTop: "1px solid var(--border-card)",
                    paddingTop: 14,
                    marginTop: 14,
                  }}
                >
                  <h4
                    style={{
                      color: "#38bdf8",
                      fontSize: 12,
                      marginBottom: 8,
                    }}
                  >
                    BharatIntent-X Intent Reliability Guard
                  </h4>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 12,
                      fontSize: 11,
                      color: "#94a3b8",
                    }}
                  >
                    <span>
                      Status:{" "}
                      <b style={{ color: "#f8fafc" }}>
                        {guard.status}
                      </b>
                    </span>

                    <span>
                      Detected domain:{" "}
                      <b style={{ color: "#f8fafc" }}>
                        {guard.detected_domain || "None detected"}
                      </b>
                    </span>

                    <span>
                      Version:{" "}
                      <b style={{ color: "#f8fafc" }}>
                        {guard.version || "Not supplied"}
                      </b>
                    </span>
                  </div>

                  {guard.recommended_action && (
                    <p
                      style={{
                        color: "#cbd5e1",
                        fontSize: 11,
                        marginTop: 8,
                      }}
                    >
                      Recommended action:{" "}
                      {guard.recommended_action}
                    </p>
                  )}
                </div>
              )}

              {/* ACTUAL AVAILABLE PREPROCESSING INFORMATION */}

              <div
                style={{
                  borderTop: "1px solid var(--border-card)",
                  paddingTop: 12,
                  marginTop: 12,
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                  fontSize: 10,
                  color: "#64748b",
                }}
              >
                <span>
                  Latency:{" "}
                  {result.latencyMs ??
                    result.latency_ms ??
                    "N/A"}{" "}
                  ms
                </span>

                <span>
                  Neural intent:{" "}
                  {result.neuralIntent ??
                    result.neural_intent ??
                    "N/A"}
                </span>

                <span>
                  Lexical intent:{" "}
                  {result.lexicalIntent ??
                    result.lexical_intent ??
                    "N/A"}
                </span>
              </div>
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                color: "#64748b",
              }}
            >
              <MessageSquareText
                size={36}
                style={{
                  margin: "0 auto 12px",
                  opacity: 0.4,
                }}
              />

              <b
                style={{
                  fontSize: 14,
                  color: "#94a3b8",
                  display: "block",
                }}
              >
                Engine Ready for Query
              </b>

              <p style={{ fontSize: 11 }}>
                Enter an Indian language query to run actual
                E58 inference.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* QUERY HISTORY */}

      {history.length > 0 && (
        <div className="panel" style={{ marginTop: 24 }}>
          <div className="panel-header">
            <div className="panel-title-area">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <History size={14} color="#06b6d4" />

                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: 1.2,
                    color: "#06b6d4",
                  }}
                >
                  QUERY HISTORY
                </span>
              </div>

              <h3>Recent Inferences in this Session</h3>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {history.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "8px 14px",
                  background: "var(--bg-card-subtle)",
                  borderRadius: 8,
                  fontSize: 11,
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <b style={{ color: "#6ee7b7" }}>
                    {item.displayName}
                  </b>

                  <span style={{ color: "#94a3b8" }}>
                    "{item.query}"
                  </span>

                  <span
                    style={{
                      fontSize: 9,
                      color: "#64748b",
                    }}
                  >
                    ({item.script || "Script unavailable"})
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <span style={{ color: "#38bdf8" }}>
                    Intent ID: {item.intentId ?? "N/A"}
                  </span>

                  {item.guardStatus && (
                    <span style={{ color: "#fbbf24" }}>
                      {item.guardStatus}
                    </span>
                  )}

                  <span style={{ color: "#64748b" }}>
                    {item.time}
                  </span>

                  <button
                    className="example-chip"
                    style={{ padding: "2px 8px" }}
                    onClick={() => {
                      setQuery(item.query);
                      handleRunInference(item.query);
                    }}
                  >
                    Re-test
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
