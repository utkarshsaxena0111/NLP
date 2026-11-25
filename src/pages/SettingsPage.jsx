import React, { useState } from "react";
import {
  Settings,
  Server,
  Zap,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Globe2,
  Terminal,
  Cpu,
  Layers,
  Copy,
  Check
} from "lucide-react";
import { getBackendUrl, setBackendUrl, checkBackendHealth } from "../services/api";
import { MODELS_REGISTRY } from "../data/modelsRegistry";

export default function SettingsPage({ activeModelId, onSelectModel, isLiveBackend }) {
  const [apiUrl, setApiUrl] = useState(getBackendUrl());
  const [testingHealth, setTestingHealth] = useState(false);
  const [pingResult, setPingResult] = useState(null);
  const [copiedCmd, setCopiedCmd] = useState(false);

  const handleTestBackend = async () => {
    setTestingHealth(true);
    setPingResult(null);
    setBackendUrl(apiUrl);
    const healthy = await checkBackendHealth();
    setTestingHealth(false);
    setPingResult(healthy);
  };

  const handleCopyBash = () => {
    navigator.clipboard.writeText("uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload");
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-eyebrow">
            <span className="pulse-dot"></span> PLATFORM PREFERENCES & API INTEGRATION
          </div>
          <h1 className="page-title">Settings & Backend Integration</h1>
          <p className="page-description">
            Configure FastAPI endpoints, test live server health, select default champion models, and inspect production deployment configurations.
          </p>
        </div>
      </div>

      {/* FASTAPI BACKEND CONFIGURATION */}
      <div className="panel" style={{ padding: 24, marginBottom: 24 }}>
        <div className="panel-header">
          <div className="panel-title-area">
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
              <Server size={15} color="#06b6d4" />
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.2, color: "#06b6d4" }}>
                API SERVICE LAYER
              </span>
            </div>
            <h3>FastAPI Inference Server Endpoint</h3>
            <p>Connect frontend to real-time python inference server hosting trained model artifacts</p>
          </div>

          <div className="system-status-pill">
            <span
              className="pulse-dot"
              style={{
                background: isLiveBackend ? "#10b981" : "#06b6d4",
                boxShadow: isLiveBackend ? "0 0 10px #10b981" : "0 0 10px #06b6d4"
              }}
            />
            <span>{isLiveBackend ? "FastAPI Backend Live" : "Client Engine Fallback Ready"}</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
          <input
            type="text"
            className="search-box"
            style={{ flex: 1, width: "100%", height: 42, fontSize: 13 }}
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder="http://localhost:8000"
          />
          <button
            className="action-btn primary"
            style={{ height: 42, padding: "0 20px" }}
            onClick={handleTestBackend}
            disabled={testingHealth}
          >
            {testingHealth ? "Pinging..." : "Test Health Ping"}
          </button>
        </div>

        {pingResult !== null && (
          <div
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              background: pingResult ? "rgba(16, 185, 129, 0.1)" : "rgba(244, 63, 94, 0.1)",
              border: `1px solid ${pingResult ? "#10b981" : "#f43f5e"}`,
              fontSize: 11,
              display: "flex",
              alignItems: "center",
              gap: 8
            }}
          >
            {pingResult ? (
              <>
                <CheckCircle2 size={16} color="#10b981" />
                <span style={{ color: "#6ee7b7" }}>
                  Success! FastAPI backend at <b>{apiUrl}</b> returned 200 OK. Live model predictions active.
                </span>
              </>
            ) : (
              <>
                <AlertTriangle size={16} color="#f43f5e" />
                <span style={{ color: "#fda4af" }}>
                  Could not reach <b>{apiUrl}</b>. The platform is automatically using the embedded client-side NLP engine (offline demonstration ready).
                </span>
              </>
            )}
          </div>
        )}

        {/* Backend Launch Command Snippet */}
        <div style={{ marginTop: 18, padding: 14, background: "var(--bg-input)", borderRadius: 8, border: "1px solid var(--border-subtle)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8" }}>HOW TO LAUNCH FASTAPI BACKEND:</span>
            <button className="icon-button" style={{ width: 24, height: 24 }} onClick={handleCopyBash}>
              {copiedCmd ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
            </button>
          </div>
          <code style={{ fontSize: 11, color: "#38bdf8", fontFamily: "var(--font-mono)" }}>
            uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
          </code>
        </div>
      </div>

      {/* DEFAULT MODEL & DEPLOYMENT SPECS */}
      <div className="dashboard-equal-grid">
        {/* Default Model Selector */}
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title-area">
              <h3>Default Inference Engine</h3>
              <p>Active model used for interactive playgrounds</p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {MODELS_REGISTRY.map((m) => (
              <label
                key={m.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 14px",
                  background: activeModelId === m.id ? "rgba(99, 102, 241, 0.12)" : "var(--bg-card-subtle)",
                  borderRadius: 8,
                  border: activeModelId === m.id ? "1px solid #6366f1" : "1px solid var(--border-subtle)",
                  cursor: "pointer"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <input
                    type="radio"
                    name="modelSelect"
                    checked={activeModelId === m.id}
                    onChange={() => onSelectModel(m.id)}
                  />
                  <div>
                    <b style={{ fontSize: 12, color: "#f8fafc" }}>{m.name}</b>
                    <span style={{ fontSize: 9, color: "#94a3b8", display: "block" }}>
                      {m.isChampion ? "Verified Kaggle Champion (0.81043)" : m.status}
                    </span>
                  </div>
                </div>
                <b style={{ color: "#38bdf8", fontSize: 12 }}>{m.latencyMs ? `${m.latencyMs} ms` : "N/A"}</b>
              </label>
            ))}
          </div>
        </div>

        {/* Deployment Runbook Checklist */}
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title-area">
              <h3>Deployment Runbook</h3>
              <p>Environments verified for hackathon demonstration</p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 11 }}>
            <div style={{ padding: 12, background: "var(--bg-card-subtle)", borderRadius: 8 }}>
              <b style={{ color: "#38bdf8", display: "block", marginBottom: 2 }}>Node.js / Replit Deployment</b>
              <span style={{ color: "#94a3b8" }}>
                Full React + Vite studio builds in 13s. Zero external binary dependencies required.
              </span>
            </div>

            <div style={{ padding: 12, background: "var(--bg-card-subtle)", borderRadius: 8 }}>
              <b style={{ color: "#34d399", display: "block", marginBottom: 2 }}>FastAPI / Docker Deployment</b>
              <span style={{ color: "#94a3b8" }}>
                Python 3.10+ container serving scikit-learn & character TF-IDF models on port 8000.
              </span>
            </div>

            <div style={{ padding: 12, background: "var(--bg-card-subtle)", borderRadius: 8 }}>
              <b style={{ color: "#fbbf24", display: "block", marginBottom: 2 }}>Zero-Config Offline Fallback</b>
              <span style={{ color: "#94a3b8" }}>
                If backend is unreachable during judging, embedded client engine seamlessly executes queries without interruption.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
