
import React from "react";
import {
  History,
  Trophy,
  FlaskConical,
  CheckCircle2,
  ArrowDown,
  Sparkles
} from "lucide-react";
import { HISTORICAL_EXPERIMENTS } from "../data/modelsRegistry";

const E58_FALLBACK = {
  id: "E58",
  date: "Final",
  name: "E58 Frozen Champion",
  model: "MuRIL + Dual TF-IDF SVM · TTA · 40/60 Fusion",
  valScore: null,
  publicScore: 0.86085,
  delta: "Final champion",
  notes: "Reproduced successfully with 4,912 / 4,912 test predictions matching the verified reference."
};

const isE58 = (exp) => String(exp.id).toUpperCase() === "E58";

const formatScore = (value, digits = 5) => {
  if (value === null || value === undefined || value === "") return "—";
  const number = Number(value);
  return Number.isFinite(number) ? number.toFixed(digits) : "—";
};

export default function ResearchTimeline() {
  const registry = Array.isArray(HISTORICAL_EXPERIMENTS)
    ? HISTORICAL_EXPERIMENTS
    : [];

  // Keep registry milestones and ensure E58 is always present at the end.
  const experiments = [
    ...registry.filter((exp) => !isE58(exp)),
    {
      ...(registry.find(isE58) || E58_FALLBACK),
      ...E58_FALLBACK,
      ...(registry.find(isE58) || {})
    }
  ];

  return (
    <div className="research-timeline-page">
      <style>{`
        .research-timeline-page {
          color: #e2e8f0;
          padding-bottom: 30px;
        }

        .rt-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 26px;
        }

        .rt-eyebrow {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #22d3ee;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.5px;
          margin-bottom: 10px;
        }

        .rt-dot {
          height: 8px;
          width: 8px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 12px #10b981;
        }

        .rt-title {
          font-size: clamp(25px, 3vw, 35px);
          font-weight: 850;
          letter-spacing: -1px;
          color: #f8fafc;
          margin: 0 0 8px;
        }

        .rt-description {
          max-width: 760px;
          color: #94a3b8;
          font-size: 13px;
          line-height: 1.7;
          margin: 0;
        }

        .rt-gain {
          border: 1px solid rgba(34,211,238,.25);
          background: rgba(8,145,178,.09);
          border-radius: 13px;
          padding: 13px 18px;
          min-width: 180px;
        }

        .rt-gain-label {
          color: #94a3b8;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1px;
          margin-bottom: 5px;
        }

        .rt-gain-value {
          color: #22d3ee;
          font-size: 23px;
          font-weight: 850;
        }

        .rt-panel {
          border: 1px solid #1e3152;
          background: linear-gradient(145deg, #0c172b, #0a1222);
          border-radius: 18px;
          padding: 25px;
          box-shadow: 0 16px 40px rgba(0,0,0,.16);
        }

        .rt-panel-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 14px;
          margin-bottom: 26px;
        }

        .rt-section-label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #22d3ee;
          font-size: 10px;
          font-weight: 850;
          letter-spacing: 1.4px;
          margin-bottom: 7px;
        }

        .rt-section-title {
          color: #f1f5f9;
          font-size: 19px;
          font-weight: 800;
          margin: 0 0 6px;
        }

        .rt-section-subtitle {
          color: #8495ad;
          font-size: 11px;
          margin: 0;
        }

        .rt-legend {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #a7f3d0;
          font-size: 10px;
          font-weight: 700;
          background: rgba(16,185,129,.08);
          border: 1px solid rgba(52,211,153,.2);
          border-radius: 20px;
          padding: 8px 12px;
        }

        .rt-legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #34d399;
        }

        .rt-flow {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
          overflow: visible;
          padding: 8px 0 18px;
        }

        .rt-node {
          width: 100%;
          max-width: 900px;
          min-height: 0;
          box-sizing: border-box;
          border: 1px solid #263956;
          border-radius: 15px;
          background: linear-gradient(160deg, #14213a, #101b30);
          padding: 20px 24px;
          position: relative;
          display: flex;
          flex-direction: column;
          transition: border-color .2s ease, transform .2s ease;
        }

        .rt-node:hover {
          transform: translateY(-2px);
          border-color: #3b82a8;
        }

        .rt-node.final {
          border: 1px solid rgba(52,211,153,.65);
          background: linear-gradient(120deg, rgba(6,78,59,.32), #10243a 75%);
          box-shadow: 0 0 28px rgba(16,185,129,.10);
        }

        .rt-node-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 14px;
        }

        .rt-exp-id {
          color: #67e8f9;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: .8px;
        }

        .rt-node.final .rt-exp-id {
          color: #6ee7b7;
        }

        .rt-date {
          color: #71839d;
          font-size: 10px;
        }

        .rt-node-main {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: center;
          gap: 20px;
        }

        .rt-node-title-row {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .rt-node-icon {
          width: 40px;
          height: 40px;
          flex: 0 0 40px;
          border-radius: 11px;
          display: grid;
          place-items: center;
          color: #67e8f9;
          background: rgba(8,145,178,.13);
          border: 1px solid rgba(34,211,238,.16);
        }

        .rt-node.final .rt-node-icon {
          color: #6ee7b7;
          background: rgba(16,185,129,.14);
          border-color: rgba(52,211,153,.28);
        }

        .rt-node-name {
          color: #f1f5f9;
          font-size: 15px;
          font-weight: 800;
          line-height: 1.45;
          margin-bottom: 4px;
        }

        .rt-model {
          color: #91a2ba;
          font-size: 11px;
          line-height: 1.55;
        }

        .rt-score-area {
          display: flex;
          gap: 28px;
          align-items: center;
          padding-left: 20px;
          border-left: 1px solid rgba(100,116,139,.2);
        }

        .rt-score-label {
          display: block;
          color: #71839d;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: .8px;
          margin-bottom: 5px;
        }

        .rt-score-value {
          color: #f8fafc;
          font-size: 19px;
          font-weight: 900;
          font-variant-numeric: tabular-nums;
        }

        .rt-score-value.val {
          color: #34d399;
        }

        .rt-delta {
          color: #34d399;
          font-size: 10px;
          margin-top: 4px;
        }

        .rt-note {
          color: #94a3b8;
          font-size: 11px;
          line-height: 1.65;
          margin: 14px 0 0 52px;
          max-width: 760px;
        }

        .rt-champion-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #6ee7b7;
          background: rgba(16,185,129,.12);
          border: 1px solid rgba(52,211,153,.28);
          border-radius: 20px;
          padding: 7px 11px;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .7px;
          margin: 14px 0 0 52px;
          width: fit-content;
        }

        .rt-connector {
          height: 58px;
          flex: 0 0 58px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #38bdf8;
          gap: 3px;
        }

        .rt-connector-label {
          font-size: 8px;
          color: #647b9b;
          font-weight: 800;
          letter-spacing: .8px;
        }

        .rt-connector-line {
          width: 2px;
          height: 27px;
          background: linear-gradient(180deg, #2563eb, #22d3ee);
          position: relative;
        }

        .rt-connector-line::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: -4px;
          width: 8px;
          height: 8px;
          border-right: 2px solid #22d3ee;
          border-bottom: 2px solid #22d3ee;
          transform: rotate(45deg);
        }

        .rt-footer {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          border: 1px solid rgba(52,211,153,.3);
          background: linear-gradient(110deg, rgba(16,185,129,.12), rgba(8,145,178,.07));
          border-radius: 15px;
          margin-top: 24px;
          padding: 22px 24px;
          color: #d1fae5;
          font-size: 15px;
          font-weight: 650;
          line-height: 1.8;
        }

        .rt-footer svg {
          width: 25px;
          height: 25px;
          flex-shrink: 0;
          color: #34d399;
          margin-top: 2px;
        }

        .rt-footer strong {
          color: #6ee7b7;
          font-size: 17px;
        }

        @media (max-width: 760px) {
          .rt-panel {
            padding: 16px;
          }

          .rt-node {
            padding: 17px;
          }

          .rt-node-main {
            grid-template-columns: 1fr;
            gap: 15px;
          }

          .rt-score-area {
            border-left: 0;
            border-top: 1px solid rgba(100,116,139,.2);
            padding: 13px 0 0;
            gap: 35px;
          }

          .rt-note,
          .rt-champion-tag {
            margin-left: 0;
          }

          .rt-footer {
            font-size: 13px;
            padding: 17px;
          }

          .rt-footer strong {
            font-size: 15px;
          }
        }
      `}</style>

      <header className="rt-header">
        <div>
          <div className="rt-eyebrow">
            <span className="rt-dot" />
            EXPERIMENT LOGS & MODEL EVOLUTION
          </div>

          <h1 className="rt-title">Research Timeline</h1>

          <p className="rt-description">
            Follow the evolution of BharatIntent-X through its research
            milestones, experiments and final E58 competition model.
          </p>
        </div>

        <div className="rt-gain">
          <div className="rt-gain-label">E58 PUBLIC MACRO-F1</div>
          <div className="rt-gain-value">0.86085</div>
        </div>
      </header>

      <section className="rt-panel">
        <div className="rt-panel-heading">
          <div>
            <div className="rt-section-label">
              <History size={14} />
              EXPERIMENT PROGRESSION
            </div>

            <h2 className="rt-section-title">
              From Baseline to E58 Champion
            </h2>

            <p className="rt-section-subtitle">
              Connected research milestones — follow the arrows downward
            </p>
          </div>

          <div className="rt-legend">
            <span className="rt-legend-dot" />
            Final champion
          </div>
        </div>

        <div className="rt-flow">
          {experiments.map((exp, idx) => {
            const final = isE58(exp);

            return (
              <React.Fragment key={exp.id}>
                <article className={`rt-node ${final ? "final" : ""}`}>
                  <div className="rt-node-top">
                    <span className="rt-exp-id">{exp.id}</span>
                    <span className="rt-date">{exp.date}</span>
                  </div>

                  <div className="rt-node-main">
                    <div className="rt-node-title-row">
                      <div className="rt-node-icon">
                        {final ? (
                          <Trophy size={20} />
                        ) : (
                          <FlaskConical size={20} />
                        )}
                      </div>

                      <div>
                        <div className="rt-node-name">
                          {exp.name}
                          {final ? " 🏆" : ""}
                        </div>
                        <div className="rt-model">{exp.model}</div>
                      </div>
                    </div>

                    <div className="rt-score-area">
                      <div>
                        <span className="rt-score-label">VALIDATION</span>
                        <span className="rt-score-value val">
                          {formatScore(exp.valScore, 4)}
                        </span>
                      </div>

                      <div>
                        <span className="rt-score-label">PUBLIC SCORE</span>
                        <span className="rt-score-value">
                          {formatScore(exp.publicScore)}
                        </span>
                        <div className="rt-delta">
                          {final ? "Final result" : exp.delta || "—"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {exp.notes && (
                    <div className="rt-note">{exp.notes}</div>
                  )}

                  {final && (
                    <div className="rt-champion-tag">
                      <Trophy size={12} />
                      FROZEN FINAL CHAMPION
                    </div>
                  )}
                </article>

                {idx < experiments.length - 1 && (
                  <div className="rt-connector" aria-hidden="true">
                    <span className="rt-connector-label">NEXT EXPERIMENT</span>
                    <div className="rt-connector-line" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div className="rt-footer">
          <CheckCircle2 />

          <div>
            <strong>Final E58 Competition Results</strong>
            <br />
            Public Macro-F1: 0.86085 &nbsp;·&nbsp;
            Private Macro-F1: 0.83961 &nbsp;·&nbsp;
            Cumulative Score: 0.85023 &nbsp;·&nbsp;
            Final Shortlist Rank: 4 / 15.
            <br />
            The frozen E58 reproduction matched all 4,912 test predictions
            with zero mismatches. Model size: 247,005,184 parameters.
          </div>
        </div>
      </section>
    </div>
  );
}
