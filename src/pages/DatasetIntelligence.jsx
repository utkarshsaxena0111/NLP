
import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { DATASET_STATS } from "../data/datasetStats";

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

const scripts = [
  { name: "Devanagari", train: 61.13, test: 32.65, color: C.green },
  { name: "Latin", train: 33.33, test: 64.21, color: C.blue },
  { name: "Mixed", train: 5.54, test: 3.14, color: C.amber }
];

const card = {
  background: C.panel,
  border: `1px solid ${C.border}`,
  borderRadius: 13,
  padding: 19
};

function Metric({ label, value, color, detail }) {
  return (
    <div style={card}>
      <div style={{ color: C.muted, fontSize: 11 }}>{label}</div>
      <div style={{
        color,
        fontSize: 26,
        fontWeight: 800,
        marginTop: 9
      }}>
        {value}
      </div>
      {detail && (
        <div style={{ color: C.muted, fontSize: 11, marginTop: 7 }}>
          {detail}
        </div>
      )}
    </div>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <section style={{ marginBottom: 25 }}>
      <div style={{ marginBottom: 13 }}>
        <h2 style={{ fontSize: 18, margin: 0 }}>{title}</h2>
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

export default function DatasetIntelligence() {
  const lengthData = DATASET_STATS.charLengthDistribution || [];
  const trainLength = DATASET_STATS.textLengths?.trainChars || {};
  const testLength = DATASET_STATS.textLengths?.testChars || {};
  const largest = DATASET_STATS.largestClass || {};
  const smallest = DATASET_STATS.smallestClass || {};

  return (
    <div style={{
      background: C.bg,
      color: C.text,
      minHeight: "100%",
      padding: "27px clamp(15px, 3vw, 34px)",
      fontFamily: "Inter, Segoe UI, Arial, sans-serif"
    }}>
      <div style={{ maxWidth: 1250, margin: "0 auto" }}>

        <header style={{ marginBottom: 27 }}>
          <div style={{
            color: C.green,
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: 2,
            marginBottom: 9
          }}>
            BHARATINTENT-X / DATA
          </div>
          <h1 style={{
            fontSize: "clamp(26px, 4vw, 35px)",
            margin: 0,
            letterSpacing: "-.8px"
          }}>
            Dataset Intelligence
          </h1>
          <p style={{ color: C.muted, fontSize: 13, marginTop: 8 }}>
            Dataset composition, script distribution and text characteristics.
          </p>
        </header>

        <Section title="Dataset overview" subtitle="Original competition data and augmentation">
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(185px, 1fr))",
            gap: 13
          }}>
            <Metric
              label="TRAINING QUERIES"
              value="16,936"
              color={C.green}
              detail="Original training rows"
            />
            <Metric
              label="COMPETITION TEST"
              value="4,912"
              color={C.blue}
              detail="Blind test rows"
            />
            <Metric
              label="SYNTHETIC VARIANTS"
              value="23,864"
              color="#a78bfa"
              detail="Generated augmentation examples"
            />
            <Metric
              label="INTENT CLASSES"
              value="56"
              color={C.cyan}
              detail="Class IDs 0–55"
            />
          </div>
        </Section>

        <Section
          title="Script distribution"
          subtitle="Training and test query composition"
        >
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 14
          }}>
            {scripts.map(item => (
              <div key={item.name} style={card}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 17
                }}>
                  <strong style={{ fontSize: 14 }}>{item.name}</strong>
                  <span style={{
                    color: item.color,
                    fontSize: 11,
                    fontWeight: 800
                  }}>
                    {item.test}% test
                  </span>
                </div>

                <div style={{ marginBottom: 13 }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    color: C.muted,
                    fontSize: 11,
                    marginBottom: 6
                  }}>
                    <span>Training</span>
                    <strong style={{ color: C.text }}>{item.train}%</strong>
                  </div>
                  <div style={{
                    height: 8,
                    background: "#263750",
                    borderRadius: 10,
                    overflow: "hidden"
                  }}>
                    <div style={{
                      width: `${item.train}%`,
                      height: "100%",
                      background: item.color
                    }} />
                  </div>
                </div>

                <div>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    color: C.muted,
                    fontSize: 11,
                    marginBottom: 6
                  }}>
                    <span>Test</span>
                    <strong style={{ color: C.text }}>{item.test}%</strong>
                  </div>
                  <div style={{
                    height: 8,
                    background: "#263750",
                    borderRadius: 10,
                    overflow: "hidden"
                  }}>
                    <div style={{
                      width: `${item.test}%`,
                      height: "100%",
                      background: item.color
                    }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            ...card,
            marginTop: 13,
            borderLeft: `3px solid ${C.blue}`
          }}>
            <div style={{
              color: C.blue,
              fontWeight: 800,
              fontSize: 12,
              marginBottom: 7
            }}>
              SCRIPT DISTRIBUTION SHIFT
            </div>
            <p style={{
              color: C.muted,
              fontSize: 12,
              lineHeight: 1.7,
              margin: 0
            }}>
              Latin queries account for 33.33% of training data but 64.21%
              of the test set. Devanagari moves from 61.13% to 32.65%.
              The test distribution therefore differs substantially from
              the training distribution.
            </p>
          </div>
        </Section>

        <Section
          title="Character-length distribution"
          subtitle="Training and test query lengths"
        >
          <div style={{ ...card, height: 310 }}>
            {lengthData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={lengthData}>
                  <CartesianGrid
                    stroke="#263750"
                    strokeDasharray="3 3"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="range"
                    stroke={C.muted}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis
                    stroke={C.muted}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: C.panel,
                      border: `1px solid ${C.border}`,
                      borderRadius: 8,
                      color: C.text
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="train"
                    name="Training"
                    fill={C.green}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="test"
                    name="Test"
                    fill={C.blue}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ color: C.muted, fontSize: 12 }}>
                Character-length distribution data unavailable.
              </div>
            )}
          </div>
        </Section>

        <Section title="Text-length statistics">
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 13
          }}>
            {[
              ["Training", trainLength],
              ["Test", testLength]
            ].map(([name, data]) => (
              <div key={name} style={card}>
                <h3 style={{ fontSize: 14, margin: "0 0 15px" }}>
                  {name} queries
                </h3>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 8
                }}>
                  {[
                    ["Median", data.median],
                    ["Mean", data.mean],
                    ["Maximum", data.max]
                  ].map(([label, value]) => (
                    <div key={label} style={{
                      background: C.inner,
                      borderRadius: 8,
                      padding: 11
                    }}>
                      <div style={{ color: C.muted, fontSize: 10 }}>{label}</div>
                      <strong style={{ display: "block", marginTop: 7 }}>
                        {value ?? "—"}
                      </strong>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Class distribution">
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 13
          }}>
            <Metric
              label="LARGEST CLASS"
              value={largest.id != null ? `Class ${largest.id}` : "—"}
              color={C.green}
              detail={largest.name || "Dataset taxonomy"}
            />
            <Metric
              label="SMALLEST CLASS"
              value={smallest.id != null ? `Class ${smallest.id}` : "—"}
              color={C.amber}
              detail={smallest.name || "Dataset taxonomy"}
            />
            <Metric
              label="IMBALANCE RATIO"
              value="14.57×"
              color={C.blue}
              detail="Largest class: 1,224 · Smallest: 84"
            />
          </div>
        </Section>

        <footer style={{
          borderTop: `1px solid ${C.border}`,
          paddingTop: 15,
          color: "#71839c",
          fontSize: 10
        }}>
          BHARATINTENT-X · Dataset overview · 16,936 training rows · 4,912 test rows
        </footer>
      </div>
    </div>
  );
}
