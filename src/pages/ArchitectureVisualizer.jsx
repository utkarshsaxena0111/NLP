
import React, { useState } from "react";
import NeuralGraph, { PIPELINE_STAGES } from "../components/NeuralGraph";

export default function ArchitectureVisualizer() {
  const [activeStageIdx, setActiveStageIdx] = useState(0);

  const stage = PIPELINE_STAGES[activeStageIdx];

  return (
    <div style={{
      minHeight: "100%",
      padding: "26px clamp(15px, 3vw, 34px)",
      background: "#0b1120",
      color: "#edf4ff",
      fontFamily: "Inter, Segoe UI, Arial, sans-serif"
    }}>
      <div style={{ maxWidth: 1250, margin: "0 auto" }}>

        <header style={{ marginBottom: 26 }}>
          <div style={{
            color: "#34d399",
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: 2,
            marginBottom: 9
          }}>
            BHARATINTENT-X / SYSTEM DESIGN
          </div>
          <h1 style={{
            fontSize: "clamp(26px, 4vw, 35px)",
            letterSpacing: "-.8px",
            margin: 0,
            fontWeight: 800
          }}>
            Architecture Visualizer
          </h1>
          <p style={{
            color: "#91a4bd",
            fontSize: 13,
            marginTop: 9,
            lineHeight: 1.7
          }}>
            E58 hybrid classification architecture and E65 reliability assessment.
          </p>
        </header>

        {/* Architecture flow */}
        <div style={{ marginBottom: 23 }}>
          <NeuralGraph
            activeStage={activeStageIdx}
            onSelectStage={setActiveStageIdx}
          />
        </div>

        {/* Selected stage */}
        <section style={{
          background: "#101a2b",
          border: "1px solid #263750",
          borderRadius: 15,
          padding: 21,
          marginBottom: 23
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 12
          }}>
            <div>
              <div style={{
                fontSize: 10,
                color: stage.color,
                fontWeight: 800,
                letterSpacing: 1.5
              }}>
                STAGE {String(activeStageIdx + 1).padStart(2, "0")}
              </div>
              <h2 style={{
                fontSize: 20,
                margin: "6px 0 0",
                fontWeight: 750
              }}>
                {stage.label}
              </h2>
            </div>
            <span style={{
              color: stage.color,
              border: `1px solid ${stage.color}55`,
              background: `${stage.color}12`,
              padding: "7px 11px",
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 700
            }}>
              {stage.subtitle}
            </span>
          </div>

          <p style={{
            fontSize: 13,
            color: "#a9b9ce",
            lineHeight: 1.7,
            margin: "0 0 19px"
          }}>
            {stage.description}
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: 12
          }}>
            {stage.nodes.map((node, index) => (
              <div key={node.id} style={{
                background: "#15243a",
                border: "1px solid #2a3c55",
                borderRadius: 11,
                padding: 16
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  marginBottom: 9
                }}>
                  <span style={{
                    width: 25,
                    height: 25,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: 7,
                    background: `${stage.color}20`,
                    color: stage.color,
                    fontSize: 11,
                    fontWeight: 800
                  }}>
                    {index + 1}
                  </span>
                  <strong style={{ fontSize: 13 }}>
                    {node.name}
                  </strong>
                </div>
                <p style={{
                  margin: 0,
                  color: "#91a4bd",
                  fontSize: 12,
                  lineHeight: 1.6
                }}>
                  {node.info}
                </p>
              </div>
            ))}
          </div>

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            marginTop: 22,
            paddingTop: 15,
            borderTop: "1px solid #263750"
          }}>
            <button
              type="button"
              disabled={activeStageIdx === 0}
              onClick={() => setActiveStageIdx(v => Math.max(0, v - 1))}
              style={navButton(activeStageIdx === 0)}
            >
              ← Previous
            </button>
            <button
              type="button"
              disabled={activeStageIdx === PIPELINE_STAGES.length - 1}
              onClick={() => setActiveStageIdx(v => Math.min(PIPELINE_STAGES.length - 1, v + 1))}
              style={navButton(activeStageIdx === PIPELINE_STAGES.length - 1)}
            >
              Next stage →
            </button>
          </div>
        </section>

        {/* Fusion details */}
        <section style={{
          background: "#101a2b",
          border: "1px solid #263750",
          borderRadius: 15,
          padding: 21,
          marginBottom: 23
        }}>
          <h2 style={{ fontSize: 17, margin: "0 0 7px" }}>
            E58 score fusion
          </h2>
          <p style={{
            color: "#91a4bd",
            fontSize: 12,
            margin: "0 0 17px"
          }}>
            Contribution to the final normalized decision scores
          </p>

          <div style={{ marginBottom: 17 }}>
            {fusionLabel("#a78bfa", "MuRIL neural expert", "40%")}
            <div style={barTrack}>
              <div style={{
                width: "40%",
                height: "100%",
                background: "#a78bfa",
                borderRadius: 8
              }} />
            </div>
          </div>

          <div>
            {fusionLabel("#22d3ee", "Dual TF-IDF SVM experts", "60%")}
            <div style={barTrack}>
              <div style={{
                width: "60%",
                height: "100%",
                background: "#22d3ee",
                borderRadius: 8
              }} />
            </div>
          </div>

          <p style={{
            color: "#71839c",
            fontSize: 11,
            lineHeight: 1.6,
            margin: "16px 0 0"
          }}>
            The displayed weights describe the fixed E58 fusion design.
            Scores are decision scores, not calibrated probabilities.
          </p>
        </section>

        {/* E65 */}
        <section style={{
          background: "#101a2b",
          border: "1px solid #3a3042",
          borderRadius: 15,
          padding: 21
        }}>
          <div style={{
            color: "#fb7185",
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: 1.5
          }}>
            SEPARATE POST-INFERENCE LAYER
          </div>
          <h2 style={{ fontSize: 18, margin: "7px 0" }}>
            E65 Reliability Guard
          </h2>
          <p style={{
            color: "#91a4bd",
            fontSize: 12,
            lineHeight: 1.7,
            margin: "0 0 17px"
          }}>
            E65 evaluates the E58 prediction independently. It does not retrain
            the model or change the original prediction and decision scores.
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 10
          }}>
            {[
              ["ACCEPTED", "#34d399"],
              ["REVIEW_REQUIRED", "#fbbf24"],
              ["POTENTIALLY_UNSUPPORTED", "#fb7185"]
            ].map(([name, color]) => (
              <div key={name} style={{
                padding: 13,
                borderRadius: 9,
                background: `${color}0d`,
                border: `1px solid ${color}44`,
                color,
                fontSize: 11,
                fontWeight: 800,
                overflowWrap: "anywhere"
              }}>
                {name}
              </div>
            ))}
          </div>
        </section>

        <footer style={{
          color: "#647791",
          fontSize: 10,
          borderTop: "1px solid #263750",
          marginTop: 25,
          paddingTop: 15
        }}>
          BharatIntent-X · E58 classification · E65 reliability assessment
        </footer>
      </div>
    </div>
  );
}

const barTrack = {
  height: 9,
  background: "#263750",
  borderRadius: 8,
  overflow: "hidden"
};

function fusionLabel(color, name, value) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      gap: 10,
      marginBottom: 8,
      fontSize: 12
    }}>
      <span style={{ color: color }}>{name}</span>
      <strong style={{ color: "#edf4ff" }}>{value}</strong>
    </div>
  );
}

function navButton(disabled) {
  return {
    border: "1px solid #344963",
    background: disabled ? "#111c30" : "#1b2d45",
    color: disabled ? "#52647b" : "#edf4ff",
    borderRadius: 8,
    padding: "9px 14px",
    fontSize: 12,
    fontWeight: 700,
    cursor: disabled ? "not-allowed" : "pointer"
  };
}
