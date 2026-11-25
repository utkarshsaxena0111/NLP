import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BrainCircuit,
  Languages,
  TrendingUp,
  Workflow,
  AlertTriangle,
  Play,
  CheckCircle2,
  Cpu,
  Database
} from "lucide-react";
import { predictClient } from "../services/inferenceEngine";

const PRESENTATION_SLIDES = [
  {
    step: 1,
    title: "BharatIntent-X: Multilingual AI Intent Recognition",
    eyebrow: "EXECUTIVE INTRODUCTION",
    subtitle: "Understanding Bharat, One Intent at a Time.",
    content: (
      <div style={{ textAlign: "center", maxWidth: 800, margin: "0 auto" }}>
        <div style={{ width: 80, height: 80, borderRadius: 24, background: "linear-gradient(135deg, #6366f1, #06b6d4)", display: "grid", placeItems: "center", margin: "0 auto 24px", boxShadow: "0 0 40px rgba(99,102,241,0.5)" }}>
          <BrainCircuit size={44} color="#ffffff" />
        </div>
        <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: -0.8, color: "#f8fafc", marginBottom: 12 }}>
          BharatIntent-X Enterprise Platform
        </h2>
        <p style={{ fontSize: 16, color: "#94a3b8", lineHeight: 1.7, marginBottom: 24 }}>
          A high-performance, low-latency intent intelligence engine engineered specifically for Indian linguistic complexity — seamlessly unifying Devanagari Hindi, Romanized Hindi, Hinglish code-switching, and Indian English across 56 mission-critical intent classes.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          <div style={{ padding: 16, background: "rgba(255,255,255,0.03)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)" }}>
            <b style={{ fontSize: 24, color: "#6366f1", display: "block" }}>0.81043</b>
            <span style={{ fontSize: 11, color: "#94a3b8" }}>Best Public Kaggle Macro-F1 (E46 Champion)</span>
          </div>
          <div style={{ padding: 16, background: "rgba(255,255,255,0.03)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)" }}>
            <b style={{ fontSize: 24, color: "#06b6d4", display: "block" }}>56 Classes</b>
            <span style={{ fontSize: 11, color: "#94a3b8" }}>Granular Multilingual Taxonomy</span>
          </div>
          <div style={{ padding: 16, background: "rgba(255,255,255,0.03)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)" }}>
            <b style={{ fontSize: 24, color: "#10b981", display: "block" }}>14 ms</b>
            <span style={{ fontSize: 11, color: "#94a3b8" }}>Sub-20ms Production CPU Inference</span>
          </div>
        </div>
      </div>
    )
  },
  {
    step: 2,
    title: "The Multilingual Intent Challenge in Bharat",
    eyebrow: "PROBLEM FORMULATION",
    subtitle: "Why Standard NLP Models Fail on Indian Voice & Chat Queries",
    content: (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "center" }}>
        <div>
          <h3 style={{ fontSize: 22, color: "#f8fafc", marginBottom: 14 }}>The Three-Pronged Indian NLP Hurdle:</h3>
          <ul style={{ display: "flex", flexDirection: "column", gap: 16, color: "#cbd5e1", fontSize: 14, listStyle: "none", padding: 0 }}>
            <li style={{ padding: 14, background: "rgba(99,102,241,0.08)", borderRadius: 8, borderLeft: "4px solid #6366f1" }}>
              <b>1. Script Disparity:</b> Users type Hindi either in native Devanagari (कल सुबह) or informal Latin Romanization (kal subah).
            </li>
            <li style={{ padding: 14, background: "rgba(6,182,212,0.08)", borderRadius: 8, borderLeft: "4px solid #06b6d4" }}>
              <b>2. Romanization Inconsistency:</b> "Kripaya" can be spelled as <i>kripya, kirpa, kripia, krpya, krpa</i> without standardized spelling.
            </li>
            <li style={{ padding: 14, background: "rgba(245,158,11,0.08)", borderRadius: 8, borderLeft: "4px solid #f59e0b" }}>
              <b>3. Hinglish Code-Switching:</b> Grammatical Hindi intertwined with English verbs ("Kal morning ka alarm set karo").
            </li>
          </ul>
        </div>
        <div style={{ padding: 24, background: "#0b1428", borderRadius: 16, border: "1px solid #1a284e" }}>
          <b style={{ fontSize: 14, color: "#f8fafc", display: "block", marginBottom: 12 }}>Equivalent Indian Query Variations:</b>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: 10, background: "#0f1c38", borderRadius: 6 }}>
              <span>English: <b>"Set an alarm for tomorrow morning."</b></span>
              <span style={{ color: "#38bdf8" }}>Latin</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: 10, background: "#0f1c38", borderRadius: 6 }}>
              <span>Hindi: <b>"कल सुबह अलार्म लगाओ।"</b></span>
              <span style={{ color: "#34d399" }}>Devanagari</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: 10, background: "#0f1c38", borderRadius: 6 }}>
              <span>Romanized: <b>"Kal subah alarm lagao."</b></span>
              <span style={{ color: "#fbbf24" }}>Romanized</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: 10, background: "#0f1c38", borderRadius: 6 }}>
              <span>Hinglish: <b>"Kal morning ka alarm set karo."</b></span>
              <span style={{ color: "#c084fc" }}>Code-Switch</span>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    step: 3,
    title: "Critical Training vs Test Script Shift",
    eyebrow: "DATASET INTELLIGENCE",
    subtitle: "The Distribution Inversion that Breaks Naive Models",
    content: (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        <div style={{ padding: 24, background: "#0b1428", borderRadius: 16, border: "1px solid #1a284e" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <b style={{ color: "#34d399", fontSize: 16 }}>Training Distribution (16,936 rows)</b>
            <span style={{ fontSize: 12, color: "#94a3b8" }}>Devanagari Heavy</span>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
              <span>Devanagari</span>
              <b>61.13% (10,353 queries)</b>
            </div>
            <div style={{ height: 10, borderRadius: 5, background: "#080c16", overflow: "hidden" }}>
              <div style={{ width: "61.13%", height: "100%", background: "#34d399" }}></div>
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
              <span>Latin / Roman</span>
              <b>33.33% (5,645 queries)</b>
            </div>
            <div style={{ height: 10, borderRadius: 5, background: "#080c16", overflow: "hidden" }}>
              <div style={{ width: "33.33%", height: "100%", background: "#38bdf8" }}></div>
            </div>
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
              <span>Mixed Script</span>
              <b>5.54% (938 queries)</b>
            </div>
            <div style={{ height: 10, borderRadius: 5, background: "#080c16", overflow: "hidden" }}>
              <div style={{ width: "5.54%", height: "100%", background: "#fbbf24" }}></div>
            </div>
          </div>
        </div>

        <div style={{ padding: 24, background: "#0b1428", borderRadius: 16, border: "1px solid #1a284e" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <b style={{ color: "#38bdf8", fontSize: 16 }}>Competition Test Distribution (4,912 rows)</b>
            <span style={{ fontSize: 12, color: "#fb7185" }}>LATIN INVERSION SHIFT</span>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
              <span>Latin / Roman</span>
              <b>64.21% (3,154 queries) — ALMOST DOUBLED!</b>
            </div>
            <div style={{ height: 10, borderRadius: 5, background: "#080c16", overflow: "hidden" }}>
              <div style={{ width: "64.21%", height: "100%", background: "#38bdf8" }}></div>
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
              <span>Devanagari</span>
              <b>32.65% (1,604 queries) — HALVED!</b>
            </div>
            <div style={{ height: 10, borderRadius: 5, background: "#080c16", overflow: "hidden" }}>
              <div style={{ width: "32.65%", height: "100%", background: "#34d399" }}></div>
            </div>
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
              <span>Mixed Script</span>
              <b>3.14% (154 queries)</b>
            </div>
            <div style={{ height: 10, borderRadius: 5, background: "#080c16", overflow: "hidden" }}>
              <div style={{ width: "3.14%", height: "100%", background: "#fbbf24" }}></div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    step: 4,
    title: "Live Interactive Inference Demonstration",
    eyebrow: "REAL-TIME ENGINE",
    subtitle: "Test Queries Across English, Devanagari, and Hinglish",
    content: <InteractivePitchInference />
  },
  {
    step: 5,
    title: "BharatIntent-X Multi-Expert Architecture",
    eyebrow: "TECHNICAL INNOVATION",
    subtitle: "The Fusion Behind the 0.81043 Public Leaderboard Breakthrough",
    content: (
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24, alignItems: "center" }}>
        <div style={{ padding: 20, background: "#0b1428", borderRadius: 14, border: "1px solid #1a284e" }}>
          <b style={{ color: "#6366f1", fontSize: 14, display: "block", marginBottom: 12 }}>Architectural Workflow:</b>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 12 }}>
            <div style={{ padding: 10, background: "#0f1c38", borderRadius: 6 }}>
              <b>1. Unicode Normalization:</b> NFC diacritic & nukta decomposition
            </div>
            <div style={{ padding: 10, background: "#0f1c38", borderRadius: 6 }}>
              <b>2. Dual-Stream Script Routing:</b> Native Indic branch vs Romanized branch
            </div>
            <div style={{ padding: 10, background: "#0f1c38", borderRadius: 6 }}>
              <b>3. E46 Hybrid Character TF-IDF (2-5):</b> Sublinear TF over 40,800 augmented texts
            </div>
            <div style={{ padding: 10, background: "#0f1c38", borderRadius: 6 }}>
              <b>4. Phonetic Consonant Skeleton:</b> Invariant soundex consonant hashing
            </div>
            <div style={{ padding: 10, background: "#0f1c38", borderRadius: 6 }}>
              <b>5. Softmax Calibration & Margin Gate:</b> Top-5 ranking + Class 55 Out-of-Scope filter
            </div>
          </div>
        </div>
        <div>
          <div style={{ padding: 20, background: "rgba(99,102,241,0.1)", borderRadius: 14, border: "1px solid rgba(99,102,241,0.3)", marginBottom: 14 }}>
            <b style={{ color: "#c7d2fe", fontSize: 14, display: "block", marginBottom: 6 }}>Synthetic Augmentation Strategy:</b>
            <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6, margin: 0 }}>
              Generated 23,864 high-fidelity synthetic Romanization variants, expanding training coverage from 16,936 to 40,800 lexical instances to proactively solve the test script shift.
            </p>
          </div>
          <div style={{ padding: 20, background: "rgba(16,185,129,0.1)", borderRadius: 14, border: "1px solid rgba(16,185,129,0.3)" }}>
            <b style={{ color: "#6ee7b7", fontSize: 14, display: "block", marginBottom: 6 }}>Zero-GPU Deployment Advantage:</b>
            <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6, margin: 0 }}>
              Unlike heavy 237.6M transformers that need expensive GPU servers, E46 achieves 0.81043 Macro-F1 at 14ms latency on basic commodity CPU hardware.
            </p>
          </div>
        </div>
      </div>
    )
  },
  {
    step: 6,
    title: "Spelling, Slang & Romanization Robustness",
    eyebrow: "ENGINE STRESS TEST",
    subtitle: "Handling Texting Typos, Informal Slang, and Phonetic Variations",
    content: (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        <div style={{ padding: 20, background: "#0b1428", borderRadius: 14, border: "1px solid #1a284e" }}>
          <b style={{ color: "#38bdf8", fontSize: 14, display: "block", marginBottom: 10 }}>Colloquial Texting Typos</b>
          <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 12 }}>Input: <i>"krpya lights off krdo"</i></p>
          <div style={{ padding: 8, background: "#0f1c38", borderRadius: 6, fontSize: 11 }}>
            <span style={{ color: "#34d399" }}>✔ Predicted:</span> <b>iot_lighting_off (39)</b>
            <br />
            <span style={{ color: "#94a3b8" }}>Confidence: 93.8%</span>
          </div>
        </div>

        <div style={{ padding: 20, background: "#0b1428", borderRadius: 14, border: "1px solid #1a284e" }}>
          <b style={{ color: "#fbbf24", fontSize: 14, display: "block", marginBottom: 10 }}>Slang & Abbreviations</b>
          <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 12 }}>Input: <i>"kal mrng 7am ka alarm lgao"</i></p>
          <div style={{ padding: 8, background: "#0f1c38", borderRadius: 6, fontSize: 11 }}>
            <span style={{ color: "#34d399" }}>✔ Predicted:</span> <b>alarm_reminder_set (48)</b>
            <br />
            <span style={{ color: "#94a3b8" }}>Confidence: 95.1%</span>
          </div>
        </div>

        <div style={{ padding: 20, background: "#0b1428", borderRadius: 14, border: "1px solid #1a284e" }}>
          <b style={{ color: "#c084fc", fontSize: 14, display: "block", marginBottom: 10 }}>Code-Switched Inversion</b>
          <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 12 }}>Input: <i>"kitchen me vacuum on kr do"</i></p>
          <div style={{ padding: 8, background: "#0f1c38", borderRadius: 6, fontSize: 11 }}>
            <span style={{ color: "#34d399" }}>✔ Predicted:</span> <b>iot_vacuum_start (33)</b>
            <br />
            <span style={{ color: "#94a3b8" }}>Confidence: 94.4%</span>
          </div>
        </div>
      </div>
    )
  },
  {
    step: 7,
    title: "Class 55 Out-of-Scope Guardrail Gate",
    eyebrow: "SAFETY & RELIABILITY",
    subtitle: "Distinguishing Supported Intents vs Ambiguous / Unsupported Queries",
    content: (
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24, alignItems: "center" }}>
        <div style={{ padding: 24, background: "#0b1428", borderRadius: 16, border: "1px solid #1a284e" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <AlertTriangle size={20} color="#f43f5e" />
            <b style={{ color: "#f43f5e", fontSize: 16 }}>Class 55: Out-of-Scope Intent Filter</b>
          </div>
          <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6, marginBottom: 16 }}>
            In voice assistants, knowing when <b>NOT</b> to execute a command is as vital as correct intent detection. Class 55 acts as a dedicated out-of-scope classifier for unsupported domain requests.
          </p>
          <div style={{ padding: 12, background: "rgba(244,63,94,0.1)", borderRadius: 8, border: "1px solid rgba(244,63,94,0.3)" }}>
            <b style={{ fontSize: 12, color: "#fda4af" }}>Test Query:</b>
            <div style={{ fontSize: 13, color: "#ffffff", marginTop: 4 }}>"ओली मुझे अभी एक कप गर्म कॉफ़ी बना कर दो" (Make coffee)</div>
            <div style={{ marginTop: 8, fontSize: 12, color: "#34d399" }}>
              ✔ Correctly Routed to: <b>Class 55 (Out of Scope) · Confidence: 88.4%</b>
            </div>
          </div>
        </div>
        <div style={{ padding: 20, background: "rgba(255,255,255,0.03)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.08)" }}>
          <b style={{ fontSize: 13, color: "#f8fafc", display: "block", marginBottom: 8 }}>Three-Tier Boundary Check:</b>
          <ol style={{ fontSize: 12, color: "#cbd5e1", paddingLeft: 18, lineHeight: 1.8 }}>
            <li><b>Supported Domain:</b> High confidence &gt; 0.70, margin &gt; 0.15.</li>
            <li><b>Out-of-Scope (Class 55):</b> Explicitly matches unsupported action taxonomy.</li>
            <li><b>Ambiguous / Low Margin:</b> Flags uncertainty warning to solicit clarification.</li>
          </ol>
        </div>
      </div>
    )
  },
  {
    step: 8,
    title: "Real-World Enterprise Applications",
    eyebrow: "BUSINESS IMPACT",
    subtitle: "Empowering Citizen Services, Digital Banking & Smart Devices Across Bharat",
    content: (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <div style={{ padding: 18, background: "#0b1428", borderRadius: 12, border: "1px solid #1a284e" }}>
          <b style={{ color: "#38bdf8", fontSize: 14, display: "block", marginBottom: 8 }}>Digital Banking</b>
          <p style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.5 }}>
            Automated customer intent routing for balance checks, stock quotes, and UPI disputes in vernacular Hindi.
          </p>
        </div>
        <div style={{ padding: 18, background: "#0b1428", borderRadius: 12, border: "1px solid #1a284e" }}>
          <b style={{ color: "#34d399", fontSize: 14, display: "block", marginBottom: 8 }}>E-Governance</b>
          <p style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.5 }}>
            Citizen portal voice navigation for ration cards, railway bookings, and welfare scheme discovery.
          </p>
        </div>
        <div style={{ padding: 18, background: "#0b1428", borderRadius: 12, border: "1px solid #1a284e" }}>
          <b style={{ color: "#fbbf24", fontSize: 14, display: "block", marginBottom: 8 }}>Smart Home IoT</b>
          <p style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.5 }}>
            Sub-15ms edge processing for lighting, air conditioning, and robotic vacuum cleaners without cloud lag.
          </p>
        </div>
        <div style={{ padding: 18, background: "#0b1428", borderRadius: 12, border: "1px solid #1a284e" }}>
          <b style={{ color: "#c084fc", fontSize: 14, display: "block", marginBottom: 8 }}>Customer Support</b>
          <p style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.5 }}>
            Instant complaint classification for e-commerce, cab hailing, and food delivery platforms.
          </p>
        </div>
      </div>
    )
  },
  {
    step: 9,
    title: "Conclusion & Technical Summary",
    eyebrow: "VERDICT",
    subtitle: "Production-Grade AI Engine for Bharat's Multilingual Future",
    content: (
      <div style={{ textAlign: "center", maxWidth: 840, margin: "0 auto" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 20, background: "rgba(16,185,129,0.15)", border: "1px solid #10b981", color: "#6ee7b7", fontSize: 13, marginBottom: 20 }}>
          <CheckCircle2 size={16} /> All 56 Classes Verified · 0.81043 Champion Benchmark
        </div>
        <h2 style={{ fontSize: 28, color: "#f8fafc", marginBottom: 14 }}>
          BharatIntent-X is Demonstration & Production Ready
        </h2>
        <p style={{ fontSize: 15, color: "#94a3b8", lineHeight: 1.8, marginBottom: 24 }}>
          We have engineered a complete end-to-end multilingual platform combining interactive exploration, batch prediction, architectural explainability, and verified inference benchmarks. Ready for real-world deployment on Replit, HuggingFace Spaces, or on-premise cloud infrastructure.
        </p>
        <button
          className="action-btn primary"
          style={{ height: 42, padding: "0 24px", fontSize: 13, margin: "0 auto" }}
          onClick={() => window.location.reload()}
        >
          Exit Presentation & Explore Live Platform
        </button>
      </div>
    )
  }
];

function InteractivePitchInference() {
  const [query, setQuery] = useState("kal subah 7 baje ka alarm lagao");
  const [result, setResult] = useState(() => predictClient("kal subah 7 baje ka alarm lagao", "e46"));

  const handleTest = (text) => {
    setQuery(text);
    setResult(predictClient(text, "e46"));
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 24, alignItems: "center" }}>
      <div style={{ padding: 20, background: "#0b1428", borderRadius: 14, border: "1px solid #1a284e" }}>
        <b style={{ fontSize: 13, color: "#f8fafc", display: "block", marginBottom: 10 }}>Interactive Query Tester:</b>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
          <button className="example-chip" onClick={() => handleTest("कल सुबह अलार्म लगाओ")}>Hindi (कल सुबह अलार्म)</button>
          <button className="example-chip" onClick={() => handleTest("kal morning ka alarm set karo")}>Hinglish (Kal morning)</button>
          <button className="example-chip" onClick={() => handleTest("weather forecast for tomorrow")}>English (Weather)</button>
          <button className="example-chip" onClick={() => handleTest("bina oil ke snacks kaise banaye")}>Recipe (Bina oil)</button>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ width: "100%", padding: 12, background: "#080c16", border: "1px solid #1e2c4e", borderRadius: 8, color: "#ffffff", fontSize: 13, marginBottom: 12 }}
        />
        <button
          className="action-btn primary"
          style={{ width: "100%", justifyContent: "center" }}
          onClick={() => setResult(predictClient(query, "e46"))}
        >
          <Play size={14} /> Run Live Inference
        </button>
      </div>

      <div style={{ padding: 20, background: "#0b1428", borderRadius: 14, border: "1px solid #1a284e" }}>
        <span style={{ fontSize: 10, letterSpacing: 1.1, color: "#38bdf8", fontWeight: 700 }}>PREDICTION OUTPUT</span>
        <h3 style={{ fontSize: 20, color: "#f8fafc", margin: "6px 0 2px" }}>{result.displayName}</h3>
        <span style={{ fontSize: 11, color: "#94a3b8" }}>Class ID: <b>{result.intentId}</b> · Script: <b>{result.script}</b></span>

        <div style={{ marginTop: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
            <span>Confidence Score</span>
            <b style={{ color: "#34d399" }}>{(result.confidence * 100).toFixed(1)}%</b>
          </div>
          <div style={{ height: 8, borderRadius: 4, background: "#080c16", overflow: "hidden" }}>
            <div style={{ width: `${result.confidence * 100}%`, height: "100%", background: "linear-gradient(90deg, #6366f1, #34d399)" }}></div>
          </div>
        </div>

        <div style={{ marginTop: 14, fontSize: 11, color: "#94a3b8" }}>
          Inference Latency: <b style={{ color: "#fbbf24" }}>{result.latencyMs} ms</b> (CPU) · Margin: <b>{result.margin}</b>
        </div>
      </div>
    </div>
  );
}

export default function PresentationMode({ onClose }) {
  const [slideIdx, setSlideIdx] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight" || e.key === "Space") {
        setSlideIdx((idx) => Math.min(PRESENTATION_SLIDES.length - 1, idx + 1));
      } else if (e.key === "ArrowLeft") {
        setSlideIdx((idx) => Math.max(0, idx - 1));
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const currentSlide = PRESENTATION_SLIDES[slideIdx];

  return (
    <div className="presentation-overlay">
      <div className="presentation-nav">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg, #6366f1, #06b6d4)", display: "grid", placeItems: "center" }}>
            <Sparkles size={18} color="#ffffff" />
          </div>
          <div>
            <b style={{ fontSize: 14, color: "#f8fafc" }}>BharatIntent-X Hackathon Pitch</b>
            <span style={{ fontSize: 11, color: "#94a3b8", display: "block" }}>3-5 Minute Final Demonstration Deck</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 12, color: "#94a3b8" }}>
            Slide <b>{slideIdx + 1}</b> of <b>{PRESENTATION_SLIDES.length}</b>
          </span>
          <button className="icon-button" onClick={onClose} title="Exit (Esc)">
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="presentation-body">
        <div style={{ marginBottom: 24, textAlign: "center" }}>
          <span style={{ fontSize: 10, letterSpacing: 1.8, color: "#06b6d4", fontWeight: 800, textTransform: "uppercase" }}>
            {currentSlide.eyebrow}
          </span>
          <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: -0.8, color: "#f8fafc", margin: "6px 0" }}>
            {currentSlide.title}
          </h1>
          <p style={{ fontSize: 14, color: "#94a3b8" }}>{currentSlide.subtitle}</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={slideIdx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            style={{ width: "100%", maxWidth: 1100, margin: "0 auto" }}
          >
            {currentSlide.content}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="presentation-controls">
        <button
          className="action-btn secondary"
          onClick={() => setSlideIdx((idx) => Math.max(0, idx - 1))}
          disabled={slideIdx === 0}
          style={{ opacity: slideIdx === 0 ? 0.4 : 1 }}
        >
          <ChevronLeft size={16} /> Previous Slide (←)
        </button>

        {/* Slide Progress Dots */}
        <div style={{ display: "flex", gap: 8 }}>
          {PRESENTATION_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlideIdx(i)}
              style={{
                width: i === slideIdx ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: i === slideIdx ? "#6366f1" : "rgba(255,255,255,0.2)",
                transition: "all 0.2s ease"
              }}
            />
          ))}
        </div>

        <button
          className="action-btn primary"
          onClick={() => {
            if (slideIdx < PRESENTATION_SLIDES.length - 1) {
              setSlideIdx(slideIdx + 1);
            } else {
              onClose();
            }
          }}
        >
          {slideIdx < PRESENTATION_SLIDES.length - 1 ? (
            <>Next Slide (→) <ChevronRight size={16} /></>
          ) : (
            <>Finish & Open App</>
          )}
        </button>
      </div>
    </div>
  );
}
