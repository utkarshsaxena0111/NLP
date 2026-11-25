import React from "react";
import {
  BrainCircuit,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  Users,
  Code2,
  CheckCircle2,
  FileCode2,
  Globe2
} from "lucide-react";

export default function AboutProject() {
  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-eyebrow">
            <span className="pulse-dot"></span> PROJECT ARCHITECTURE & MISSION
          </div>
          <h1 className="page-title">About BharatIntent-X</h1>
          <p className="page-description">
            Multilingual Intelligent Intent Recognition Engine for Bharat — engineered for national NLP hackathons and enterprise voice/chat automation.
          </p>
        </div>
      </div>

      {/* BRAND MANIFESTO CARD */}
      <div
        className="panel"
        style={{
          padding: 28,
          marginBottom: 24,
          background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)",
          border: "1px solid rgba(99, 102, 241, 0.3)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg, #6366f1, #06b6d4)", display: "grid", placeItems: "center" }}>
            <BrainCircuit size={28} color="#ffffff" />
          </div>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#f8fafc", margin: 0 }}>BharatIntent-X</h2>
            <span style={{ fontSize: 13, color: "#38bdf8", fontWeight: 600 }}>"Understanding Bharat, One Intent at a Time."</span>
          </div>
        </div>

        <p style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.8, maxWidth: 900, margin: 0 }}>
          India represents one of the world's most diverse and linguistically rich digital populations. Over 500 million Indian users interact with voice assistants and messaging apps using a complex blend of <b>native Devanagari Hindi</b>, <b>non-standardized Romanized Hindi ("kal subah")</b>, and <b>Hinglish code-switching ("morning alarm set karo")</b>. Standard NLP pipelines trained solely on formal English or clean Hindi consistently collapse when faced with this colloquial variation.
          <br /><br />
          <b>BharatIntent-X</b> solves this by marrying synthetic Romanization data augmentation with consonant-skeletal phonetic hashing and sublinear character TF-IDF representations. The resulting champion model (<b>E46</b>) delivers a verified <b>0.81043 Macro-F1 on the blind Kaggle competition test set</b> while maintaining an ultra-lean <b>14ms CPU latency</b> with zero GPU requirements.
        </p>
      </div>

      {/* TEAM RESPONSIBILITY ARCHITECTURE */}
      <div className="dashboard-equal-grid">
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title-area">
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                <Code2 size={15} color="#06b6d4" />
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.2, color: "#06b6d4" }}>
                  SYSTEM ARCHITECTURE & UI/UX
                </span>
              </div>
              <h3>Frontend, UI/UX & Deployment Lead</h3>
              <p>Platform shell, visualizations, API contracts, and judge demonstration workflows</p>
            </div>
          </div>

          <ul style={{ fontSize: 11, color: "#cbd5e1", display: "flex", flexDirection: "column", gap: 10, paddingLeft: 16, lineHeight: 1.6 }}>
            <li><b>Enterprise Design System:</b> Dark navy, glassmorphism panels, electric cyan/indigo identity inspired by top AI SaaS command centers.</li>
            <li><b>Interactive In-Browser NLP:</b> Robust client-side fallback predictor ensuring zero-config offline presentation reliability.</li>
            <li><b>Interactive Neuralnet Visualizer:</b> Clickable 5-stage pipeline diagram tracing query execution from Unicode NFC clean to Class 55 gate.</li>
            <li><b>Batch Prediction Engine:</b> CSV drag-and-drop parsing, column mapping, live inference progress, and official Kaggle export.</li>
            <li><b>Judge Pitch Mode:</b> Dedicated 11-step interactive pitch deck for seamless 3-5 minute final judging presentations.</li>
          </ul>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div className="panel-title-area">
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                <Cpu size={15} color="#34d399" />
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.2, color: "#34d399" }}>
                  MODELING & RESEARCH
                </span>
              </div>
              <h3>Machine Learning & NLP Research Teammate</h3>
              <p>Model training, hyperparameter tuning, phonetic feature engineering, and Kaggle submissions</p>
            </div>
          </div>

          <ul style={{ fontSize: 11, color: "#cbd5e1", display: "flex", flexDirection: "column", gap: 10, paddingLeft: 16, lineHeight: 1.6 }}>
            <li><b>E46 Champion Hybrid:</b> Sublinear character TF-IDF (2-5 ngrams) with LinearSVC regularized hyperplanes (C=2.5).</li>
            <li><b>Synthetic Data Augmentation:</b> Generated 23,864 transliterated training examples expanding corpus to 40,800 rows to conquer the 64.2% test shift.</li>
            <li><b>Phonetic Consonant Skeleton:</b> Soundex-based invariant consonant normalizer solving SMS texting variations and typos.</li>
            <li><b>Grouped OOF Cross-Validation:</b> 5-fold stratified evaluation framework guaranteeing 0.8663 Macro-F1 across all 56 intent classes.</li>
            <li><b>Experimental MuRIL / IndicBERT:</b> 237.6M parameter deep multilingual transformer experiments for next-generation semantic representation.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
