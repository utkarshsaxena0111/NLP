# BHARATINTENT-X: Multilingual Intelligent Intent Recognition Engine for Bharat

> **"Understanding Bharat, One Intent at a Time."**

BharatIntent-X is a premium, enterprise-grade multilingual AI intelligence platform designed for national AI/NLP hackathons and mission-critical Indian language voice and chat systems.

---

## ⚡ QUICK START INSTRUCTIONS (RUN IN 2 STEPS)

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)
- *(Optional)* **Python 3.10+** (only if you want to run the FastAPI backend server; the platform already includes an embedded client-side NLP inference engine that runs with zero configuration out-of-the-box!)

---

### Step 1: Install Dependencies
Open your terminal in the extracted folder:
```bash
npm install
```

### Step 2: Launch the Interactive Studio
```bash
npm run dev
```

The application will start immediately. Open the URL shown in your terminal:
- **Local Browser:** [http://localhost:5173](http://localhost:5173) (or [http://localhost:5000](http://localhost:5000) on Replit)

---

### *(Optional)* Launch the Python FastAPI Backend
If you want to run the Python model serving API alongside the UI:
```bash
# 1. Install python dependencies
pip install -r backend/requirements.txt

# 2. Start the FastAPI server on port 8000
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```
Once started, the topbar indicator in the UI will automatically turn green: **`FastAPI Live: 8000`**.

> **Note on Reliability:** If Python or FastAPI is not running, the platform automatically utilizes its built-in client-side multilingual NLP engine. You will still get authentic, instant predictions across all 56 intent classes with zero latency!

---

## 🌟 Visual Identity & Design System

Inspired by elite AI SaaS command centers:
- **Palette**: Deep navy & midnight blue (`#060913`, `#0b1326`), deep glass-like panels, electric indigo (`#6366f1`), cyan (`#06b6d4`), emerald (`#10b981`), amber (`#f59e0b`).
- **Interactive Visualizations**:
  - Full Neural Network & Hybrid Multi-Stream Pipeline Architecture Diagram with clickable stages.
  - Multi-layer glowing area charts for request volume & throughput.
  - Intent domain distribution donut chart.
  - Training vs Competition Test script distribution shift comparison.
  - Confusion matrix heatmap subset & polarity error analysis.
  - Token-level local feature attribution heatmap.
- **Judge Presentation Mode**: Fullscreen interactive 3-5 minute presentation mode with live interactive widgets, progress dots, and keyboard navigation (`←`, `→`, `Esc`).

---

## 🏆 Verified Competition Benchmarks

| Metric | Measurement | Context |
|---|---|---|
| **Best Public Kaggle Macro-F1** | **0.81043** | **E46 Augmented Hybrid (Champion)** |
| **5-Fold Grouped OOF Macro-F1** | **0.8663** | Cross-validation fusion score |
| **Total Intent Classes** | **56 Classes** | IDs 0 to 55 (Class 55 Out-of-Scope) |
| **Original Training Examples** | **16,936** | 5-fold stratified competition split |
| **Synthetic Romanization Augmented** | **23,864** | Retained transliterated instances |
| **Total Augmented Training Instances** | **40,800** | Solved 64.2% test script distribution shift |
| **Competition Test Queries** | **4,912** | Blind competition test evaluation |
| **Experimental MuRIL Parameters** | **237.6M** | Foundation model research benchmark |
| **Inference Latency** | **14 ms** | Sub-20ms single-threaded CPU execution |

---

## 🚀 Navigation & Platform Features

1. **Command Center**: Enterprise KPI cards, glowing area charts, script shift comparison, quick query command line.
2. **Live Intent Recognition**: Primary demonstration page supporting English, native Devanagari Hindi, Romanized Hindi, and Hinglish with top-5 candidate rankings, confidence meters, decision margins, and copyable JSON output.
3. **Multilingual Intelligence Lab**: 4-quadrant cross-script consistency checker and phonetic spelling robustness playground (SMS texting typos, dropped vowels, informal slang).
4. **Intent Explorer**: Searchable 56-class taxonomy directory with category filtering and sample queries in Hindi, Romanized, and English.
5. **Batch Prediction**: CSV file drag-and-drop parsing, query column selector, live progress tracking, table preview, and export to official Kaggle submission format (`example_id,target`).
6. **Model Laboratory**: In-depth profiles for E46 Champion, E50 Script-Aware, Phonetic Expert (E27), E60 Neural Encoder, V3 Transformer, and MuRIL with side-by-side comparison matrix.
7. **Architecture Visualizer**: Interactive 5-stage neural graph (Unicode NFC Clean → Dual-Stream Routing → Ensembles → Softmax Fusion → Class 55 Gate).
8. **Model Explainability**: Word token attribution heatmap (+/- evidence weights), ensemble subscore breakdown, character n-gram inspection, and decision hyperplane margin.
9. **Performance Analytics**: Grouped OOF cross-validation vs blind Kaggle leaderboard metrics, per-class F1 distribution, and script-wise breakdown.
10. **Dataset Intelligence**: In-depth EDA highlighting the script distribution shift (Train: 61.13% Devanagari vs Test: 64.21% Latin) and 14.57x class imbalance.
11. **Error Analysis & Class 55 Gate**: Dedicated 3-tier boundary verification distinguishing supported intents, Class 55 out-of-scope rejections, and low-margin ambiguous queries.
12. **Live Monitoring**: Real-time request telemetry, latency distribution histogram, system diagnostics, and request audit log.
13. **Research Timeline & Applications**: Chronological Kaggle score progression (+0.05447 gain) and real-world deployment in Banking, E-Governance, IoT, and Support.
14. **Settings & API**: FastAPI backend endpoint configuration (`http://localhost:8000`), live ping diagnostic, launch commands, and deployment runbooks.
15. **Judge Presentation Mode**: Fullscreen 11-step hackathon pitch mode for final jury demonstration.

---

## 📦 Directory Structure Inside Zip

```
BharatIntent-X/
├── backend/
│   ├── main.py              # FastAPI model serving endpoints
│   └── requirements.txt     # Python backend dependencies
├── dist/                    # Compiled production build
├── src/
│   ├── components/          # Sidebar, Topbar, NeuralGraph, StatCard, PresentationMode
│   ├── data/                # 56-class taxonomy, models registry, dataset stats
│   ├── pages/               # All 15 functional application views
│   ├── services/            # API connector & client-side inference engine
│   ├── main.jsx             # React entry point and routing
│   └── styles.css           # Enterprise design system CSS
├── index.html               # Main HTML template
├── package.json             # NPM dependencies & scripts
├── vite.config.js           # Vite configuration
└── README.md                # Complete documentation & run instructions
```

---

## 👥 Engineering Team Responsibilities

- **Frontend, UI/UX & Deployment Lead**: Application shell, design system, interactive neural graph, batch engine, XAI visualizations, and judge pitch mode.
- **Model Training & Research Teammate**: E46 augmented hybrid training, synthetic transliteration generation (+23,864 rows), consonant skeleton phonetic feature engineering, and Kaggle leaderboard submissions.
