
import React from "react";

const C = {
  bg: "#0b1120",
  panel: "#111c30",
  panel2: "#15233a",
  border: "#263750",
  text: "#edf4ff",
  muted: "#91a4bd",
  green: "#34d399",
  blue: "#60a5fa",
  cyan: "#22d3ee",
  amber: "#fbbf24",
};

const results = [
  ["Public Macro-F1", "0.86085", C.green],
  ["Private Macro-F1", "0.83961", C.blue],
  ["Cumulative score", "0.85023", C.cyan],
  ["Final rank", "4 / 15", C.amber],
];

const milestones = [
  ["Baseline", 0.75596],
  ["E27", 0.79428],
  ["E46", 0.81043],
  ["E57-A", 0.83238],
  ["E57-B", 0.84519],
  ["E58", 0.86085],
];

const card = {
  background: C.panel,
  border: `1px solid ${C.border}`,
  borderRadius: 14,
  padding: 20,
};

const heading = {
  color: C.text,
  fontSize: 19,
  fontWeight: 700,
  margin: "0 0 6px",
};

const muted = {
  color: C.muted,
  fontSize: 13,
  lineHeight: 1.6,
};

function MetricCard({ label, value, color }) {
  return (
    <div style={{ ...card, minWidth: 0 }}>
      <div style={{ ...muted, fontSize: 12 }}>{label}</div>
      <div style={{
        color,
        fontSize: 27,
        fontWeight: 750,
        marginTop: 9,
        letterSpacing: "-0.7px"
      }}>
        {value}
      </div>
    </div>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <section style={{ marginBottom: 30 }}>
      <div style={{ marginBottom: 15 }}>
        <h2 style={heading}>{title}</h2>
        {subtitle && <div style={muted}>{subtitle}</div>}
      </div>
      {children}
    </section>
  );
}

function InfoCard({ label, title, description, color, weight }) {
  return (
    <div style={{
      ...card,
      flex: "1 1 220px",
      borderTop: `3px solid ${color}`,
      minWidth: 0
    }}>
      <div style={{
        color,
        fontSize: 11,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: 1
      }}>
        {label}
      </div>
      <div style={{
        color: C.text,
        fontSize: 19,
        fontWeight: 700,
        margin: "12px 0 8px"
      }}>
        {title}
      </div>
      <p style={{ ...muted, margin: 0 }}>{description}</p>
      {weight && (
        <div style={{
          color,
          fontSize: 13,
          fontWeight: 700,
          marginTop: 17
        }}>
          {weight}
        </div>
      )}
    </div>
  );
}

export default function ModelLaboratory() {
  return (
    <div style={{
      background: C.bg,
      color: C.text,
      minHeight: "100%",
      width: "100%",
      padding: "30px clamp(16px, 3vw, 38px)",
      boxSizing: "border-box",
      fontFamily: "Inter, Segoe UI, Arial, sans-serif"
    }}>
      <div style={{ maxWidth: 1250, margin: "0 auto" }}>

        {/* Header */}
        <header style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 20,
          marginBottom: 30
        }}>
          <div>
            <div style={{
              color: C.green,
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: 2,
              marginBottom: 10
            }}>
              BHARATINTENT-X / MODEL
            </div>
            <h1 style={{
              fontSize: "clamp(27px, 4vw, 36px)",
              letterSpacing: "-1px",
              margin: 0,
              fontWeight: 800
            }}>
              Model Laboratory
            </h1>
            <p style={{ ...muted, margin: "9px 0 0" }}>
              E58 hybrid intent classification engine
            </p>
          </div>

          <div style={{
            ...card,
            display: "flex",
            alignItems: "center",
            gap: 13,
            padding: "13px 18px"
          }}>
            <div style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: C.green,
              boxShadow: `0 0 12px ${C.green}`
            }} />
            <div>
              <div style={{ fontSize: 16, fontWeight: 800 }}>E58 Champion</div>
              <div style={{ ...muted, fontSize: 11 }}>56 output classes</div>
            </div>
          </div>
        </header>

        {/* Results */}
        <Section
          title="Competition performance"
          subtitle="Verified final-round results"
        >
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
            gap: 14
          }}>
            {results.map(([label, value, color]) => (
              <MetricCard key={label} label={label} value={value} color={color} />
            ))}
          </div>

          <div style={{
            ...card,
            display: "flex",
            flexWrap: "wrap",
            gap: "15px 35px",
            marginTop: 14,
            padding: "15px 20px"
          }}>
            <div>
              <div style={muted}>Reproduced predictions</div>
              <strong>4,912 / 4,912</strong>
            </div>
            <div>
              <div style={muted}>Mismatches</div>
              <strong style={{ color: C.green }}>0</strong>
            </div>
            <div>
              <div style={muted}>Model parameters</div>
              <strong>247,005,184</strong>
            </div>
          </div>
        </Section>

        {/* Architecture */}
        <Section
          title="Model architecture"
          subtitle="Neural and lexical experts combined through fixed score fusion"
        >
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 14
          }}>
            <InfoCard
              label="Neural expert"
              title="MuRIL"
              description="Base-cased transformer with test-time augmentation and romanization."
              color={C.blue}
              weight="40% fusion weight"
            />
            <InfoCard
              label="Lexical experts"
              title="Dual TF-IDF SVM"
              description="Character TF-IDF and character word-boundary TF-IDF LinearSVC."
              color={C.cyan}
              weight="60% fusion weight"
            />
            <InfoCard
              label="Final classifier"
              title="E58 Fusion"
              description="Fixed normalized decision-score fusion across 56 intent classes."
              color={C.green}
              weight="Frozen champion engine"
            />
          </div>
          <div style={{
            ...card,
            marginTop: 14,
            padding: 15,
            color: C.muted,
            fontSize: 12
          }}>
            Output values are normalized decision scores, not calibrated probabilities.
          </div>
        </Section>

        {/* Progress */}
        <Section
          title="Development milestones"
          subtitle="Public Macro-F1 progression"
        >
          <div style={card}>
            {milestones.map(([name, score], i) => (
              <div key={name} style={{
                display: "grid",
                gridTemplateColumns: "75px 1fr 75px",
                gap: 13,
                alignItems: "center",
                marginBottom: i === milestones.length - 1 ? 0 : 19
              }}>
                <span style={{
                  color: name === "E58" ? C.green : C.muted,
                  fontSize: 13,
                  fontWeight: name === "E58" ? 800 : 500
                }}>
                  {name}
                </span>
                <div style={{
                  height: 9,
                  background: "#26364c",
                  borderRadius: 20,
                  overflow: "hidden"
                }}>
                  <div style={{
                    width: `${score / 0.9 * 100}%`,
                    height: "100%",
                    borderRadius: 20,
                    background: name === "E58"
                      ? C.green
                      : "#526b8d"
                  }} />
                </div>
                <strong style={{
                  color: name === "E58" ? C.green : C.text,
                  fontSize: 13,
                  textAlign: "right"
                }}>
                  {score.toFixed(5)}
                </strong>
              </div>
            ))}
          </div>
        </Section>

        {/* Runtime */}
        <Section title="Deployment environment">
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 14
          }}>
            <MetricCard label="Execution device" value="CUDA" color={C.green} />
            <MetricCard label="GPU" value="GTX 1650 Ti" color={C.blue} />
            <MetricCard label="API service" value="Port 8000" color={C.cyan} />
            <MetricCard label="Intent classes" value="56" color={C.amber} />
          </div>
          <div style={{ ...card, marginTop: 14 }}>
            <div style={{ fontWeight: 700, marginBottom: 12 }}>
              Input script coverage
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
              {["English", "Devanagari Hindi", "Romanized Hindi", "Hinglish"].map(x => (
                <span key={x} style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  background: C.panel2,
                  border: `1px solid ${C.border}`,
                  color: C.muted,
                  fontSize: 12
                }}>
                  {x}
                </span>
              ))}
            </div>
          </div>
        </Section>

        {/* Reliability */}
        <Section
          title="E65 Reliability Guard"
          subtitle="Independent post-inference assessment layer"
        >
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 14
          }}>
            <InfoCard
              label="Status 01"
              title="ACCEPTED"
              description="No configured review or unsupported-domain trigger."
              color={C.green}
            />
            <InfoCard
              label="Status 02"
              title="REVIEW_REQUIRED"
              description="Prediction requires additional review based on guard diagnostics."
              color={C.amber}
            />
            <InfoCard
              label="Status 03"
              title="POTENTIALLY_UNSUPPORTED"
              description="A configured unsupported domain or action pattern was detected."
              color="#fb7185"
            />
          </div>
          <p style={{ ...muted, marginTop: 12 }}>
            E65 does not modify E58 predictions or model weights. Native E58
            out-of-scope detection remains a separate signal.
          </p>
        </Section>

        <footer style={{
          borderTop: `1px solid ${C.border}`,
          paddingTop: 17,
          color: "#71839c",
          fontSize: 11
        }}>
          BHARATINTENT-X · E58 · E65
        </footer>
      </div>
    </div>
  );
}
