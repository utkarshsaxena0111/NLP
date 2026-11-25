
import React from "react";

export const PIPELINE_STAGES = [
  {
    id: "input",
    label: "Query Input",
    subtitle: "User query",
    color: "#60a5fa",
    description: "A multilingual text query enters the E58 inference pipeline.",
    nodes: [
      { id: "query", name: "Input text", info: "Original user-provided query." },
      { id: "preprocessing", name: "Model preprocessing", info: "Input preparation for the E58 model." }
    ]
  },
  {
    id: "neural",
    label: "Neural Expert",
    subtitle: "MuRIL",
    color: "#a78bfa",
    description: "The neural branch processes the query using MuRIL and test-time augmentation.",
    nodes: [
      { id: "muril", name: "MuRIL encoder", info: "Base-cased multilingual transformer." },
      { id: "tta", name: "Test-time augmentation", info: "Includes romanization-based augmentation." }
    ]
  },
  {
    id: "lexical",
    label: "Lexical Experts",
    subtitle: "Dual TF-IDF SVM",
    color: "#22d3ee",
    description: "Two character-based lexical classifiers contribute decision scores.",
    nodes: [
      { id: "char", name: "Character TF-IDF", info: "Character-level TF-IDF LinearSVC expert." },
      { id: "charwb", name: "Character word-boundary TF-IDF", info: "Second LinearSVC lexical expert." }
    ]
  },
  {
    id: "fusion",
    label: "E58 Fusion",
    subtitle: "40% / 60%",
    color: "#34d399",
    description: "The neural and lexical outputs are combined using fixed normalized decision-score fusion.",
    nodes: [
      { id: "neuralweight", name: "Neural contribution", info: "40% fusion weight." },
      { id: "lexicalweight", name: "Lexical contribution", info: "60% combined fusion weight." },
      { id: "scores", name: "56-class scores", info: "Normalized decision scores across the 56 classes." }
    ]
  },
  {
    id: "output",
    label: "Prediction",
    subtitle: "E58 output",
    color: "#fbbf24",
    description: "E58 returns its predicted intent, ranked alternatives and out-of-scope signal.",
    nodes: [
      { id: "intent", name: "Predicted intent", info: "Original E58 intent class ID." },
      { id: "ranking", name: "Top intent ranking", info: "Ranked class decision scores." },
      { id: "oos", name: "Native OOS signal", info: "E58 out_of_scope output, including class 55." }
    ]
  },
  {
    id: "guard",
    label: "E65 Guard",
    subtitle: "Post-inference",
    color: "#fb7185",
    description: "The independent reliability guard assesses the E58 result without changing the original prediction.",
    nodes: [
      { id: "assessment", name: "Reliability assessment", info: "ACCEPTED, REVIEW_REQUIRED or POTENTIALLY_UNSUPPORTED." },
      { id: "diagnostics", name: "Diagnostics", info: "Configured domain patterns, expert disagreement and decision margin." },
      { id: "preservation", name: "Prediction preservation", info: "E58 prediction fields and scores remain unchanged." }
    ]
  }
];

export default function NeuralGraph({ activeStage = 0, onSelectStage }) {
  const stages = PIPELINE_STAGES;

  return (
    <div style={{
      background: "#101a2b",
      border: "1px solid #263750",
      borderRadius: 16,
      padding: 20,
      color: "#edf4ff"
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
        alignItems: "center",
        marginBottom: 22
      }}>
        <div>
          <div style={{
            color: "#34d399",
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: 1.7,
            marginBottom: 6
          }}>
            INFERENCE ARCHITECTURE
          </div>
          <h3 style={{ fontSize: 17, margin: 0 }}>E58 + E65 Processing Flow</h3>
        </div>
        <span style={{
          fontSize: 11,
          color: "#91a4bd",
          background: "#17263b",
          padding: "7px 10px",
          borderRadius: 8
        }}>
          56-class classification
        </span>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))",
        gap: 11
      }}>
        {stages.map((stage, index) => {
          const selected = activeStage === index;

          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => onSelectStage?.(index)}
              style={{
                textAlign: "left",
                cursor: "pointer",
                padding: 14,
                minWidth: 0,
                borderRadius: 12,
                background: selected ? "#1b2d45" : "#121f32",
                border: `1px solid ${selected ? stage.color : "#293b54"}`,
                boxShadow: selected ? `0 0 0 1px ${stage.color}30` : "none",
                color: "#edf4ff",
                transition: "all .18s ease"
              }}
            >
              <div style={{
                height: 4,
                borderRadius: 5,
                background: stage.color,
                marginBottom: 13
              }} />
              <div style={{
                fontSize: 10,
                color: stage.color,
                fontWeight: 800,
                letterSpacing: 1
              }}>
                STEP {String(index + 1).padStart(2, "0")}
              </div>
              <div style={{
                fontSize: 14,
                fontWeight: 750,
                marginTop: 8
              }}>
                {stage.label}
              </div>
              <div style={{
                fontSize: 11,
                color: "#91a4bd",
                marginTop: 4
              }}>
                {stage.subtitle}
              </div>
              <div style={{
                fontSize: 11,
                color: "#aebdd0",
                marginTop: 13
              }}>
                {stage.nodes.length} components
              </div>
              <div style={{
                fontSize: 10,
                color: stage.color,
                marginTop: 12,
                fontWeight: 700
              }}>
                {selected ? "SELECTED" : "INSPECT STAGE →"}
              </div>
            </button>
          );
        })}
      </div>

      <div style={{
        marginTop: 17,
        display: "flex",
        alignItems: "center",
        gap: 9,
        flexWrap: "wrap",
        color: "#91a4bd",
        fontSize: 10
      }}>
        <span style={{ color: "#60a5fa" }}>●</span> Input
        <span style={{ color: "#a78bfa" }}>●</span> Neural
        <span style={{ color: "#22d3ee" }}>●</span> Lexical
        <span style={{ color: "#34d399" }}>●</span> Fusion
        <span style={{ color: "#fbbf24" }}>●</span> Output
        <span style={{ color: "#fb7185" }}>●</span> Reliability
      </div>
    </div>
  );
}
