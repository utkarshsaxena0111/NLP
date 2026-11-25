
import React, { useState } from "react";
import {
  Languages,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Play,
  RotateCcw,
  ShieldAlert,
  Loader2,
} from "lucide-react";
import { predictIntent } from "../services/api";

const EQUIVALENT_SETS = [
  {
    topic: "Morning Alarm",
    english: "Set an alarm for 7 AM tomorrow morning.",
    hindi: "कल सुबह 7 बजे का अलार्म लगाओ।",
    romanized: "Kal subah 7 baje ka alarm lagao.",
    hinglish: "Kal morning me 7 AM ka alarm set karo.",
  },
  {
    topic: "Smart Lights Off",
    english: "Please switch off the kitchen lights.",
    hindi: "कृपया रसोईघर की बत्तियां बंद कर दें।",
    romanized: "Kripaya rasoeeghar ki battiyaan band kar den.",
    hinglish: "Kitchen ki lights off kar do please.",
  },
  {
    topic: "Weather Query",
    english: "What is the weather forecast for tomorrow?",
    hindi: "कल का मौसम पूर्वानुमान क्या है?",
    romanized: "Kal ka mausam kaisa rahega?",
    hinglish: "Kal ka weather kaisa rahega?",
  },
  {
    topic: "Music Playback",
    english: "Play the latest song by Arijit Singh.",
    hindi: "अरिजीत सिंह का नया गाना चलाओ।",
    romanized: "Arijit Singh ka naya gaana bajao.",
    hinglish: "Arijit Singh ka latest track play karo.",
  },
];

const ROBUST_VARIANTS = [
  { label: "Original Romanized", text: "kripaya alarm lagao" },
  { label: "SMS Typo / Dropped Vowels", text: "krpya alrm lgao" },
  { label: "Colloquial Wording", text: "kirpa karke alarm lgado" },
  { label: "Code-Switching", text: "plz morning alarm set krde" },
  { label: "Misspelling", text: "kerpya alaram lagaw" },
];

const SCRIPT_CARDS = [
  { key: "english", title: "Indian English", script: "Latin" },
  { key: "hindi", title: "Native Hindi", script: "Devanagari" },
  { key: "romanized", title: "Romanized Hindi", script: "Latin" },
  { key: "hinglish", title: "Hinglish", script: "Code-switching" },
];

function intentId(result) {
  return result?.intentId ?? result?.intent_id ?? "N/A";
}

function intentName(result) {
  return (
    result?.displayName ||
    result?.intentName ||
    `Intent Class ${intentId(result)}`
  );
}

function guardStatus(result) {
  return result?.reliability_guard?.status || "NOT_AVAILABLE";
}

function decisionScore(result) {
  const score = result?.top5?.[0]?.score ??
    result?.top_intents?.[0]?.score;

  return Number.isFinite(Number(score))
    ? Number(score).toFixed(4)
    : "N/A";
}

function isOOS(result) {
  return result?.isOutOfScope === true ||
    result?.out_of_scope === true;
}

function getStatusColor(status) {
  if (status === "POTENTIALLY_UNSUPPORTED") return "#fbbf24";
  if (status === "REVIEW_REQUIRED") return "#f59e0b";
  if (status === "ACCEPTED") return "#34d399";
  return "#94a3b8";
}

function PredictionCard({ title, script, value, result, loading, error }) {
  return (
    <div className="panel" style={{ padding: 18, minWidth: 0 }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 8,
        marginBottom: 10,
        fontSize: 11,
      }}>
        <b style={{ color: "#38bdf8" }}>{title}</b>
        <span style={{ color: "#64748b", fontSize: 9 }}>{script}</span>
      </div>

      <textarea
        className="query-textarea"
        style={{
          height: 85,
          fontSize: 12,
          marginBottom: 12,
          width: "100%",
        }}
        value={value}
        readOnly
      />

      {loading ? (
        <div style={{ color: "#38bdf8", fontSize: 11 }}>
          <Loader2 size={14} className="spin" style={{
            display: "inline",
            marginRight: 6,
          }} />
          Running E58 inference...
        </div>
      ) : error ? (
        <div style={{ color: "#fda4af", fontSize: 11 }}>
          {error}
        </div>
      ) : result ? (
        <div style={{
          padding: "10px",
          background: "var(--bg-card-subtle)",
          borderRadius: 8,
          fontSize: 11,
        }}>
          <span style={{
            color: "#94a3b8",
            fontSize: 9,
            display: "block",
          }}>
            ORIGINAL E58 PREDICTION
          </span>

          <b style={{ color: "#f8fafc", fontSize: 12 }}>
            {intentName(result)}
          </b>

          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            marginTop: 8,
            color: "#94a3b8",
          }}>
            <span>Intent ID: <b style={{ color: "#c7d2fe" }}>
              {intentId(result)}
            </b></span>

            <span>Decision score: <b style={{ color: "#34d399" }}>
              {decisionScore(result)}
            </b></span>
          </div>

          <div style={{
            marginTop: 8,
            fontSize: 10,
            color: getStatusColor(guardStatus(result)),
          }}>
            E65: {guardStatus(result).replaceAll("_", " ")}
          </div>

          {isOOS(result) && (
            <div style={{
              marginTop: 5,
              color: "#fda4af",
              fontSize: 10,
            }}>
              Native E58 Out-of-Scope prediction
            </div>
          )}
        </div>
      ) : (
        <div style={{ color: "#64748b", fontSize: 11 }}>
          Run analysis to see the actual E58 result.
        </div>
      )}
    </div>
  );
}

export default function MultilingualLab() {
  const [selectedSet, setSelectedSet] = useState(EQUIVALENT_SETS[0]);

  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [analysisError, setAnalysisError] = useState("");

  const [robustResults, setRobustResults] = useState({});
  const [robustLoading, setRobustLoading] = useState(false);
  const [robustError, setRobustError] = useState("");

  const [robustBase, setRobustBase] = useState(
    "kripaya alarm lagao"
  );

  const variants = [
    { label: "Original Romanized", text: robustBase },
    { label: "SMS Typo / Dropped Vowels", text: "krpya alrm lgao" },
    { label: "Colloquial Wording", text: "kirpa karke alarm lgado" },
    { label: "Code-Switching", text: "plz morning alarm set krde" },
    { label: "Misspelling", text: "kerpya alaram lagaw" },
  ];

  const handleSelectSet = (set) => {
    setSelectedSet(set);
    setResults({});
    setErrors({});
    setAnalysisError("");
  };

  const runComparison = async () => {
    const inputs = {
      english: selectedSet.english,
      hindi: selectedSet.hindi,
      romanized: selectedSet.romanized,
      hinglish: selectedSet.hinglish,
    };

    if (Object.values(inputs).some((text) => !text.trim())) {
      setAnalysisError("All four language inputs must contain text.");
      return;
    }

    setLoading(true);
    setResults({});
    setErrors({});
    setAnalysisError("");

    const entries = await Promise.all(
      Object.entries(inputs).map(async ([key, query]) => {
        try {
          const result = await predictIntent(query);
          return [key, result, null];
        } catch (error) {
          return [
            key,
            null,
            error?.message || "E58 request failed.",
          ];
        }
      })
    );

    const nextResults = {};
    const nextErrors = {};

    entries.forEach(([key, result, error]) => {
      if (result) nextResults[key] = result;
      if (error) nextErrors[key] = error;
    });

    setResults(nextResults);
    setErrors(nextErrors);
    setLoading(false);

    if (Object.keys(nextErrors).length) {
      setAnalysisError(
        "Some language requests failed. Check backend connectivity and retry."
      );
    }
  };

  const runRobustnessTest = async () => {
    if (!robustBase.trim()) {
      setRobustError("Enter a Romanized Hindi query first.");
      return;
    }

    setRobustLoading(true);
    setRobustResults({});
    setRobustError("");

    const outcomes = await Promise.all(
      variants.map(async (variant, index) => {
        try {
          const result = await predictIntent(variant.text);
          return [index, result, null];
        } catch (error) {
          return [
            index,
            null,
            error?.message || "E58 request failed.",
          ];
        }
      })
    );

    const nextResults = {};
    outcomes.forEach(([index, result, error]) => {
      nextResults[index] = { result, error };
    });

    setRobustResults(nextResults);
    setRobustLoading(false);

    if (outcomes.some(([, , error]) => error)) {
      setRobustError(
        "Some robustness requests failed. Retry after checking the backend."
      );
    }
  };

  const ids = SCRIPT_CARDS
    .map((card) => results[card.key])
    .filter(Boolean)
    .map(intentId);

  const uniqueCount = new Set(ids).size;
  const allFourAvailable = SCRIPT_CARDS.every(
    (card) => results[card.key]
  );

  const allMatch =
    allFourAvailable &&
    ids.every((id) => id === ids[0]);

  const consensusCount = allFourAvailable
    ? ids.filter((id) => id === ids[0]).length
    : 0;

  const reset = () => {
    setResults({});
    setErrors({});
    setAnalysisError("");
    setRobustResults({});
    setRobustError("");
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-eyebrow">
            <span className="pulse-dot"></span>
            MULTILINGUAL INTELLIGENCE & CROSS-SCRIPT LAB
          </div>

          <h1 className="page-title">
            Multilingual Intelligence Lab
          </h1>

          <p className="page-description">
            Compare real E58 predictions across Devanagari Hindi,
            Romanized Hindi, Hinglish and Indian English. Inspect
            cross-script consistency and spelling robustness.
          </p>
        </div>

        <div className="header-actions" style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
        }}>
          {EQUIVALENT_SETS.map((set) => (
            <button
              key={set.topic}
              className={`action-btn ${
                selectedSet.topic === set.topic
                  ? "primary"
                  : "secondary"
              }`}
              onClick={() => handleSelectSet(set)}
              style={{ height: 34, fontSize: 10 }}
            >
              {set.topic}
            </button>
          ))}
        </div>
      </div>

      {/* CONSISTENCY SUMMARY */}

      <div className="panel" style={{
        padding: "18px 20px",
        marginBottom: 24,
        background: allMatch
          ? "rgba(16,185,129,0.08)"
          : "var(--bg-card)",
        border: `1px solid ${
          allMatch
            ? "rgba(16,185,129,0.4)"
            : "var(--border-card)"
        }`,
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}>
            {allMatch ? (
              <CheckCircle2 size={24} color="#10b981" />
            ) : (
              <AlertCircle size={24} color="#f59e0b" />
            )}

            <div>
              <b style={{ fontSize: 14, color: "#f8fafc" }}>
                {!allFourAvailable
                  ? "Cross-Script Analysis"
                  : allMatch
                    ? "All Four Variants Predict the Same Class"
                    : `Script Disagreement: ${uniqueCount} Different Predicted Classes`}
              </b>

              <p style={{
                fontSize: 11,
                color: "#94a3b8",
                margin: "4px 0 0",
              }}>
                {!allFourAvailable
                  ? "Run the comparison to evaluate all four language representations."
                  : allMatch
                    ? `All four variants returned E58 intent ID ${ids[0]}.`
                    : "The same meaning may produce different E58 predictions across language representations."}
              </p>
            </div>
          </div>

          <div style={{
            display: "flex",
            gap: 14,
            alignItems: "center",
            fontSize: 11,
          }}>
            <span>Model: <b>E58</b></span>
            <span>
              Matching first-class predictions:{" "}
              <b style={{ color: "#38bdf8" }}>
                {allFourAvailable
                  ? `${consensusCount}/4`
                  : "Not evaluated"}
              </b>
            </span>
          </div>
        </div>
      </div>

      {/* FOUR LANGUAGE INPUTS */}

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
        gap: 16,
        marginBottom: 16,
      }}>
        {SCRIPT_CARDS.map((card) => (
          <PredictionCard
            key={card.key}
            title={card.title}
            script={card.script}
            value={selectedSet[card.key]}
            result={results[card.key]}
            loading={loading}
            error={errors[card.key]}
          />
        ))}
      </div>

      <div style={{
        display: "flex",
        gap: 10,
        flexWrap: "wrap",
        marginBottom: 28,
      }}>
        <button
          className="action-btn primary"
          onClick={runComparison}
          disabled={loading}
          style={{ height: 42 }}
        >
          {loading ? (
            <Loader2 size={15} />
          ) : (
            <Play size={15} />
          )}
          {loading ? "Running E58..." : "Run E58 Cross-Script Comparison"}
        </button>

        <button
          className="action-btn secondary"
          onClick={reset}
          disabled={loading || robustLoading}
          style={{ height: 42 }}
        >
          <RotateCcw size={14} />
          Reset Results
        </button>
      </div>

      {analysisError && (
        <div style={{
          padding: 12,
          marginBottom: 20,
          borderRadius: 8,
          background: "rgba(244,63,94,0.1)",
          border: "1px solid rgba(244,63,94,0.4)",
          color: "#fda4af",
          fontSize: 12,
        }}>
          <AlertTriangle
            size={14}
            style={{ display: "inline", marginRight: 6 }}
          />
          {analysisError}
        </div>
      )}

      {/* ROBUSTNESS TEST */}

      <div className="panel">
        <div className="panel-header">
          <div className="panel-title-area">
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 4,
            }}>
              <Languages size={15} color="#06b6d4" />
              <span style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: 1.2,
                color: "#06b6d4",
              }}>
                ROMANIZATION ROBUSTNESS TEST
              </span>
            </div>

            <h3>Spelling & Romanization Playground</h3>

            <p>
              Compare the actual E58 predictions for a Romanized
              Hindi query and its spelling variations.
            </p>
          </div>
        </div>

        <div style={{ padding: 16 }}>
          <label style={{
            display: "block",
            fontSize: 11,
            color: "#94a3b8",
            marginBottom: 7,
          }}>
            BASE ROMANIZED HINDI QUERY
          </label>

          <input
            value={robustBase}
            onChange={(event) => {
              setRobustBase(event.target.value);
              setRobustResults({});
              setRobustError("");
            }}
            className="query-textarea"
            style={{
              width: "100%",
              minHeight: 42,
              padding: 12,
              marginBottom: 12,
            }}
            placeholder="Enter a Romanized Hindi query..."
          />

          <button
            className="action-btn primary"
            onClick={runRobustnessTest}
            disabled={robustLoading}
            style={{ height: 40 }}
          >
            {robustLoading ? (
              <Loader2 size={14} />
            ) : (
              <Play size={14} />
            )}
            {robustLoading
              ? "Testing..."
              : "Run E58 Robustness Test"}
          </button>

          {robustError && (
            <div style={{
              color: "#fda4af",
              fontSize: 11,
              marginTop: 12,
            }}>
              {robustError}
            </div>
          )}
        </div>

        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          padding: "0 16px 18px",
        }}>
          {variants.map((variant, index) => {
            const item = robustResults[index];
            const result = item?.result;
            const error = item?.error;

            return (
              <div
                key={variant.label}
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(120px, 180px) minmax(160px, 1.5fr) minmax(140px, 1fr) minmax(100px, 130px)",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  background: "var(--bg-card-subtle)",
                  borderRadius: 10,
                  fontSize: 11,
                }}
              >
                <div>
                  <b style={{
                    color: "#38bdf8",
                    display: "block",
                  }}>
                    {variant.label}
                  </b>
                  <span style={{
                    fontSize: 9,
                    color: "#64748b",
                  }}>
                    Variant #{index + 1}
                  </span>
                </div>

                <code style={{
                  color: "#f8fafc",
                  overflowWrap: "anywhere",
                }}>
                  {variant.text}
                </code>

                <div>
                  {result ? (
                    <>
                      <b style={{ color: "#f8fafc" }}>
                        {intentName(result)}
                      </b>
                      <span style={{
                        fontSize: 9,
                        color: "#94a3b8",
                        display: "block",
                        marginTop: 4,
                      }}>
                        Intent ID: {intentId(result)}
                      </span>
                      <span style={{
                        fontSize: 9,
                        color: getStatusColor(guardStatus(result)),
                        display: "block",
                        marginTop: 3,
                      }}>
                        E65: {guardStatus(result).replaceAll("_", " ")}
                      </span>
                    </>
                  ) : error ? (
                    <span style={{ color: "#fda4af" }}>{error}</span>
                  ) : robustLoading ? (
                    <span style={{ color: "#38bdf8" }}>Processing...</span>
                  ) : (
                    <span style={{ color: "#64748b" }}>Not tested</span>
                  )}
                </div>

                <div style={{ textAlign: "right" }}>
                  <b style={{
                    fontSize: 12,
                    color: "#34d399",
                    display: "block",
                  }}>
                    {result ? decisionScore(result) : "—"}
                  </b>
                  <span style={{
                    fontSize: 9,
                    color: "#64748b",
                  }}>
                    Decision score
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{
          padding: "0 16px 16px",
          fontSize: 10,
          color: "#64748b",
        }}>
          This is a query-level robustness comparison, not a
          measured benchmark score. Variants are not assumed to
          preserve meaning perfectly. E58 predictions and E65
          diagnostics are shown separately.
        </div>
      </div>
    </div>
  );
}
