
import React from "react";

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
  amber: "#fbbf24"
};

const official = [
  { label: "Public Macro-F1", value: "0.86085", color: C.green },
  { label: "Private Macro-F1", value: "0.83961", color: C.blue },
  { label: "Cumulative score", value: "0.85023", color: C.cyan },
  { label: "Final shortlist rank", value: "4 / 15", color: C.amber }
];

const milestones = [
  ["Initial baseline", 0.75596],
  ["E27", 0.79428],
  ["E46", 0.81043],
  ["E57-A", 0.83238],
  ["E57-B", 0.84519],
  ["E58", 0.86085]
];

const card = {
  background: C.panel,
  border: `1px solid ${C.border}`,
  borderRadius: 13,
  padding: 19
};

function Metric({ label, value, color }) {
  return (
    <div style={card}>
      <div style={{ color: C.muted, fontSize: 11 }}>{label}</div>
      <div style={{
        color,
        fontSize: 27,
        fontWeight: 800,
        marginTop: 9,
        letterSpacing: "-.5px"
      }}>
        {value}
      </div>
    </div>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <section style={{ marginBottom: 25 }}>
      <div style={{ marginBottom: 13 }}>
        <h2 style={{ fontSize: 18, margin: 0, color: C.text }}>{title}</h2>
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

export default function PerformanceAnalytics() {
  return (
    <div style={{
      background: C.bg,
      color: C.text,
      minHeight: "100%",
      padding: "27px clamp(15px, 3vw, 34px)",
      fontFamily: "Inter, Segoe UI, Arial, sans-serif"
    }}>
      <div style={{ maxWidth: 1250, margin: "0 auto" }}>

        {/* Header */}
        <header style={{ marginBottom: 27 }}>
          <div style={{
            color: C.green,
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: 2,
            marginBottom: 9
          }}>
            BHARATINTENT-X / EVALUATION
          </div>
          <h1 style={{
            fontSize: "clamp(26px, 4vw, 35px)",
            margin: 0,
            letterSpacing: "-.8px"
          }}>
            Performance Analytics
          </h1>
          <p style={{ color: C.muted, fontSize: 13, marginTop: 8 }}>
            Verified competition performance and validation results for E58.
          </p>
        </header>

        {/* Official results */}
        <Section
          title="Final competition results"
          subtitle="Official final-round metrics"
        >
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
            gap: 13
          }}>
            {official.map(item => (
              <Metric key={item.label} {...item} />
            ))}
          </div>

          <div style={{
            ...card,
            display: "flex",
            flexWrap: "wrap",
            gap: "18px 38px",
            marginTop: 13
          }}>
            <div>
              <div style={{ color: C.muted, fontSize: 11 }}>Reproduction</div>
              <strong style={{ fontSize: 17 }}>4,912 / 4,912</strong>
            </div>
            <div>
              <div style={{ color: C.muted, fontSize: 11 }}>Prediction mismatches</div>
              <strong style={{ color: C.green, fontSize: 17 }}>0</strong>
            </div>
            <div>
              <div style={{ color: C.muted, fontSize: 11 }}>Model parameters</div>
              <strong style={{ fontSize: 17 }}>247,005,184</strong>
            </div>
          </div>
        </Section>

        {/* Validation */}
        <Section
          title="Validation results"
          subtitle="Fold-0 measurements — not overall out-of-fold or competition scores"
        >
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: 13
          }}>
            <Metric
              label="Grouped fold-0 Macro-F1"
              value="0.896231"
              color={C.blue}
            />
            <Metric
              label="Latin fold-0 Macro-F1"
              value="0.918311"
              color={C.cyan}
            />
            <Metric
              label="Fold-0 validation accuracy"
              value="89.9321%"
              color={C.green}
            />
          </div>
          <div style={{
            ...card,
            marginTop: 13,
            color: C.muted,
            fontSize: 11,
            lineHeight: 1.7
          }}>
            These values describe the reported fold-0 validation results.
            They should not be interpreted as final competition performance
            or full out-of-fold metrics.
          </div>
        </Section>

        {/* Development progression */}
        <Section
          title="Development progression"
          subtitle="Historical public Macro-F1 scores across model milestones"
        >
          <div style={card}>
            {milestones.map(([name, score], index) => (
              <div key={name} style={{
                display: "grid",
                gridTemplateColumns: "115px 1fr 75px",
                alignItems: "center",
                gap: 12,
                marginBottom: index === milestones.length - 1 ? 0 : 19
              }}>
                <span style={{
                  color: name === "E58" ? C.green : C.muted,
                  fontSize: 12,
                  fontWeight: name === "E58" ? 800 : 500
                }}>
                  {name}
                </span>
                <div style={{
                  height: 9,
                  background: "#263750",
                  borderRadius: 10,
                  overflow: "hidden"
                }}>
                  <div style={{
                    width: `${score / 0.9 * 100}%`,
                    height: "100%",
                    borderRadius: 10,
                    background: name === "E58" ? C.green : "#526b8d"
                  }} />
                </div>
                <strong style={{
                  textAlign: "right",
                  fontSize: 12,
                  color: name === "E58" ? C.green : C.text
                }}>
                  {score.toFixed(5)}
                </strong>
              </div>
            ))}
          </div>
        </Section>

        {/* Model integrity */}
        <Section title="Evaluation integrity">
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 13
          }}>
            <div style={card}>
              <div style={{ color: C.green, fontSize: 12, fontWeight: 800 }}>
                VERIFIED
              </div>
              <h3 style={{ fontSize: 15, margin: "9px 0 6px" }}>
                E58 reproduction
              </h3>
              <p style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, margin: 0 }}>
                All 4,912 test predictions reproduced with zero mismatches.
              </p>
            </div>
            <div style={card}>
              <div style={{ color: C.blue, fontSize: 12, fontWeight: 800 }}>
                FROZEN
              </div>
              <h3 style={{ fontSize: 15, margin: "9px 0 6px" }}>
                Champion model
              </h3>
              <p style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, margin: 0 }}>
                E58 inference architecture and model weights remain unchanged.
              </p>
            </div>
            <div style={card}>
              <div style={{ color: C.cyan, fontSize: 12, fontWeight: 800 }}>
                SEPARATE
              </div>
              <h3 style={{ fontSize: 15, margin: "9px 0 6px" }}>
                E65 reliability guard
              </h3>
              <p style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, margin: 0 }}>
                Post-inference diagnostics are evaluated separately from E58 competition metrics.
              </p>
            </div>
          </div>
        </Section>

        <footer style={{
          borderTop: `1px solid ${C.border}`,
          paddingTop: 15,
          color: "#71839c",
          fontSize: 10
        }}>
          BHARATINTENT-X · E58 verified evaluation
        </footer>
      </div>
    </div>
  );
}
