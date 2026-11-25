
import React from "react";
import {
  BrainCircuit,
  Activity,
  Layers,
  Database,
  Globe2,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Cpu,
  GitBranch,
  FlaskConical
} from "lucide-react";
import { DATASET_STATS } from "../data/datasetStats";

const C = {
  text: "#f8fafc",
  muted: "#94a3b8",
  faint: "#64748b",
  border: "rgba(148,163,184,.16)",
  panel: "rgba(15,23,42,.72)",
  cyan: "#22d3ee",
  blue: "#818cf8",
  green: "#34d399",
  purple: "#c084fc",
  amber: "#fbbf24"
};

const metrics = [
  {
    label: "PUBLIC MACRO-F1",
    value: "0.86085",
    note: "Official competition result",
    icon: Sparkles,
    color: C.cyan
  },
  {
    label: "PRIVATE MACRO-F1",
    value: "0.83961",
    note: "Official competition result",
    icon: Activity,
    color: C.green
  },
  {
    label: "CUMULATIVE SCORE",
    value: "0.85023",
    note: "Final score",
    icon: CheckCircle2,
    color: C.purple
  },
  {
    label: "FINAL SHORTLIST RANK",
    value: "4 / 15",
    note: "Final shortlist ranking",
    icon: Layers,
    color: C.amber
  },
  {
    label: "INTENT CLASSES",
    value: "56",
    note: "Class IDs 0–55",
    icon: Globe2,
    color: C.blue
  },
  {
    label: "MODEL PARAMETERS",
    value: "247.0M",
    note: "247,005,184 total parameters",
    icon: Cpu,
    color: C.cyan
  }
];

function Panel({ title, subtitle, children, style = {} }) {
  return (
    <section
      style={{
        background: C.panel,
        border: `1px solid ${C.border}`,
        borderRadius: 14,
        padding: 20,
        minWidth: 0,
        ...style
      }}
    >
      <div style={{ marginBottom: 18 }}>
        <h3 style={{ color: C.text, fontSize: 15, margin: 0 }}>
          {title}
        </h3>
        {subtitle && (
          <p style={{ color: C.muted, fontSize: 12, margin: "6px 0 0" }}>
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

function MetricCard({ item }) {
  const Icon = item.icon;
  return (
    <div
      style={{
        background: C.panel,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        padding: 17,
        minWidth: 0
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
        <span style={{ color: C.muted, fontSize: 10, letterSpacing: 1 }}>
          {item.label}
        </span>
        <Icon size={17} color={item.color} />
      </div>
      <div style={{ color: C.text, fontSize: 27, fontWeight: 750, marginTop: 12 }}>
        {item.value}
      </div>
      <div style={{ color: C.faint, fontSize: 11, marginTop: 5 }}>
        {item.note}
      </div>
    </div>
  );
}

function ScriptBar({ label, train, test, color }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 8,
        fontSize: 12
      }}>
        <span style={{ color: C.text }}>{label}</span>
      </div>

      {[
        ["Training", train, 1],
        ["Test", test, 0.42]
      ].map(([name, value, opacity]) => (
        <div
          key={name}
          style={{
            display: "grid",
            gridTemplateColumns: "65px 1fr 55px",
            gap: 9,
            alignItems: "center",
            marginBottom: 6
          }}
        >
          <span style={{ color: C.muted, fontSize: 10 }}>{name}</span>
          <div style={{
            height: 8,
            background: "#263449",
            borderRadius: 6,
            overflow: "hidden"
          }}>
            <div style={{
              width: `${value}%`,
              height: "100%",
              background: color,
              opacity,
              borderRadius: 6
            }} />
          </div>
          <span style={{
            color: C.muted,
            fontSize: 10,
            textAlign: "right"
          }}>
            {value}%
          </span>
        </div>
      ))}
    </div>
  );
}

function Expert({ title, detail, share, color }) {
  return (
    <div
      style={{
        background: "rgba(30,41,59,.72)",
        border: `1px solid ${C.border}`,
        borderRadius: 10,
        padding: 13,
        flex: 1,
        minWidth: 170
      }}
    >
      <div style={{ color, fontSize: 12, fontWeight: 700 }}>{title}</div>
      <div style={{ color: C.muted, fontSize: 11, marginTop: 5 }}>{detail}</div>
      <div style={{ color: C.text, fontSize: 22, fontWeight: 750, marginTop: 10 }}>
        {share}
      </div>
      <div style={{ height: 5, background: "#334155", borderRadius: 5, marginTop: 7 }}>
        <div
          style={{
            width: share,
            height: "100%",
            background: color,
            borderRadius: 5
          }}
        />
      </div>
    </div>
  );
}

export default function CommandCenter({ onSelectPage }) {
  const stats = DATASET_STATS;
  const train = stats?.scriptShift?.train;
  const test = stats?.scriptShift?.test;

  const navigate = (page) => {
    if (onSelectPage) onSelectPage(page);
  };

  return (
    <div style={{ color: C.text, paddingBottom: 30 }}>
      <header
        className="page-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 24
        }}
      >
        <div>
          <div className="page-eyebrow">
            <span className="pulse-dot" />
            BHARATINTENT-X · E58 CHAMPION
          </div>
          <h1 className="page-title">Command Center</h1>
          <p className="page-description">
            Multilingual intent recognition, model architecture, verified results
            and reliability monitoring.
          </p>
        </div>

        <button
          className="action-btn primary"
          onClick={() => navigate("live_inference")}
        >
          <Sparkles size={14} /> Open Live Inference
          <ArrowUpRight size={14} />
        </button>
      </header>

      {/* Verified E58 results */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(175px,1fr))",
          gap: 13,
          marginBottom: 22
        }}
      >
        {metrics.map((item) => (
          <MetricCard key={item.label} item={item} />
        ))}
      </div>

      {/* Model architecture */}
      <Panel
        title="How BharatIntent-X E58 Works"
        subtitle="Neural and lexical experts operate in parallel before weighted fusion."
        style={{ marginBottom: 20 }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 16
          }}
        >
          <div
            style={{
              background: "rgba(34,211,238,.10)",
              border: `1px solid ${C.cyan}`,
              borderRadius: 10,
              padding: "12px 28px",
              textAlign: "center"
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 13 }}>User Query</div>
            <div style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>
              Hindi · English · Romanized · Hinglish
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", color: C.faint, fontSize: 18 }}>
          ↓
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            margin: "10px 0"
          }}
        >
          <Expert
            title="Neural Expert"
            detail="MuRIL · original and TTA text views"
            share="40%"
            color={C.purple}
          />
          <Expert
            title="Lexical Expert A"
            detail="Character TF-IDF + SVM"
            share="36%"
            color={C.cyan}
          />
          <Expert
            title="Lexical Expert B"
            detail="Character-boundary TF-IDF + SVM"
            share="24%"
            color={C.green}
          />
        </div>

        <div style={{ textAlign: "center", color: C.faint, fontSize: 18 }}>
          ↓
        </div>

        <div
          style={{
            maxWidth: 480,
            margin: "10px auto",
            textAlign: "center",
            padding: 15,
            borderRadius: 10,
            background: "rgba(129,140,248,.10)",
            border: `1px solid ${C.blue}`
          }}
        >
          <GitBranch size={18} color={C.blue} />
          <div style={{ fontWeight: 700, marginTop: 5 }}>E58 Weighted Fusion</div>
          <div style={{ color: C.muted, fontSize: 12, marginTop: 5 }}>
            Neural 40% + Lexical 60%
          </div>
        </div>

        <div style={{ textAlign: "center", color: C.faint, fontSize: 18 }}>
          ↓
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 12,
            marginTop: 10
          }}
        >
          <div
            style={{
              border: `1px solid ${C.green}`,
              borderRadius: 10,
              padding: 13,
              minWidth: 190,
              textAlign: "center"
            }}
          >
            <CheckCircle2 color={C.green} size={18} />
            <div style={{ fontWeight: 700, marginTop: 5 }}>Intent Prediction</div>
            <div style={{ color: C.muted, fontSize: 11 }}>Original E58 output</div>
          </div>
          <div
            style={{
              border: `1px solid ${C.amber}`,
              borderRadius: 10,
              padding: 13,
              minWidth: 190,
              textAlign: "center"
            }}
          >
            <ShieldCheck color={C.amber} size={18} />
            <div style={{ fontWeight: 700, marginTop: 5 }}>E65 Reliability Guard</div>
            <div style={{ color: C.muted, fontSize: 11 }}>
              Separate post-inference assessment
            </div>
          </div>
        </div>

        <p style={{ color: C.faint, fontSize: 11, margin: "16px 0 0" }}>
          E65 does not modify E58 prediction scores or intent IDs. Decision scores
          are normalized model scores, not calibrated probabilities.
        </p>
      </Panel>

      {/* Dataset and script shift */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,320px),1fr))",
          gap: 16,
          marginBottom: 20
        }}
      >
        <Panel
          title="Dataset Overview"
          subtitle="Dataset counts used in the E58 project."
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12
            }}
          >
            {[
              ["Training examples", "16,936"],
              ["Competition test", "4,912"],
              ["Intent classes", "56"],
              ["Largest class", "1,224"],
              ["Smallest class", "84"],
              ["Class imbalance", "14.57×"]
            ].map(([label, value]) => (
              <div
                key={label}
                style={{
                  padding: 12,
                  borderRadius: 9,
                  background: "rgba(30,41,59,.65)"
                }}
              >
                <div style={{ color: C.muted, fontSize: 11 }}>{label}</div>
                <div style={{ color: C.text, fontSize: 19, fontWeight: 700, marginTop: 5 }}>
                  {value}
                </div>
              </div>
            ))}
          </div>
          <p style={{ color: C.faint, fontSize: 11, marginTop: 13 }}>
            The reported augmentation count is tracked separately from the
            original training and competition test counts.
          </p>
        </Panel>

        <Panel
          title="Language Script Distribution"
          subtitle="Training distribution compared with the competition test set."
        >
          {train && test ? (
            <>
              <div style={{ display: "flex", gap: 15, flexWrap: "wrap", marginBottom: 16 }}>
                <span style={{ color: C.muted, fontSize: 11 }}>
                  <span style={{ color: C.cyan }}>■</span> Training
                </span>
                <span style={{ color: C.muted, fontSize: 11 }}>
                  <span style={{ color: C.purple }}>■</span> Test
                </span>
              </div>
              <ScriptBar
                label="Devanagari"
                train={train.devanagari.pct}
                test={test.devanagari.pct}
                color={C.cyan}
              />
              <ScriptBar
                label="Latin script"
                train={train.latin.pct}
                test={test.latin.pct}
                color={C.purple}
              />
              <ScriptBar
                label="Mixed script"
                train={train.mixed.pct}
                test={test.mixed.pct}
                color={C.green}
              />
              <p style={{ color: C.muted, fontSize: 11, lineHeight: 1.6 }}>
                Latin-script text rises from 33.33% in training to 64.21% in
                testing. Latin script includes English and Romanized language;
                this split alone does not identify the language of each query.
              </p>
            </>
          ) : (
            <p style={{ color: C.muted, fontSize: 12 }}>
              Script distribution data is unavailable.
            </p>
          )}
        </Panel>
      </div>

      {/* Verified reproduction and guard */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,320px),1fr))",
          gap: 16,
          marginBottom: 20
        }}
      >
        <Panel
          title="E58 Reproduction Verification"
          subtitle="Saved competition predictions reproduced by the frozen E58 pipeline."
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <CheckCircle2 size={30} color={C.green} />
            <div>
              <div style={{ fontSize: 25, fontWeight: 750 }}>4,912 / 4,912</div>
              <div style={{ color: C.green, fontSize: 12 }}>Zero prediction mismatches</div>
            </div>
          </div>
          <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.7, marginTop: 13 }}>
            This is exact prediction reproduction, not a claim of 100% test
            accuracy. The competition test labels are not available for an
            independent accuracy calculation here.
          </div>
        </Panel>

        <Panel
          title="E65 Intent Reliability Guard"
          subtitle="Independent assessment layer after E58 inference."
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ShieldCheck size={27} color={C.amber} />
            <div style={{ fontWeight: 700, fontSize: 15 }}>E65-IRG</div>
          </div>
          <ul style={{ color: C.muted, fontSize: 12, lineHeight: 1.9, paddingLeft: 18 }}>
            <li>Checks configured unsupported-domain patterns.</li>
            <li>Records expert disagreement and low-margin diagnostics.</li>
            <li>Preserves the original E58 prediction.</li>
            <li>Does not claim measured precision or recall without labelled evaluation.</li>
          </ul>
        </Panel>
      </div>

      {/* Navigation */}
      <Panel
        title="Explore the System"
        subtitle="Open the detailed dashboard pages."
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {[
            ["Live Intent Recognition", "live_inference"],
            ["Intent Explorer · 56 classes", "intent_explorer"],
            ["Model Architecture", "architecture_visualizer"],
            ["Model Explainability", "model_explainability"],
            ["Performance Analytics", "performance_analytics"],
            ["Dataset Intelligence", "dataset_intelligence"]
          ].map(([label, page]) => (
            <button
              key={page}
              className="action-btn secondary"
              onClick={() => navigate(page)}
            >
              {label} <ArrowUpRight size={13} />
            </button>
          ))}
        </div>
      </Panel>

      <div
        style={{
          color: C.faint,
          fontSize: 11,
          lineHeight: 1.6,
          marginTop: 15
        }}
      >
        Note: official E58 competition metrics are shown separately from
        fold-specific validation metrics. Intent names and descriptions in the
        explorer are dataset-derived labels, not an official competition
        taxonomy.
      </div>
    </div>
  );
}
