
import React, { useEffect, useState, useCallback } from "react";
import {
  checkBackendHealth,
  getCachedHealth,
  getBackendUrl
} from "../services/api";

const C = {
  bg: "#0b1120",
  panel: "#111c30",
  inner: "#17263b",
  border: "#293c55",
  text: "#edf4ff",
  muted: "#91a4bd",
  green: "#34d399",
  blue: "#60a5fa",
  amber: "#fbbf24",
  red: "#fb7185"
};

const card = {
  background: C.panel,
  border: `1px solid ${C.border}`,
  borderRadius: 13,
  padding: 18
};

function Metric({ label, value, detail, color }) {
  return (
    <div style={card}>
      <div style={{ color: C.muted, fontSize: 11 }}>{label}</div>
      <div style={{
        color,
        fontSize: 23,
        fontWeight: 800,
        marginTop: 9,
        overflowWrap: "anywhere"
      }}>
        {value}
      </div>
      <div style={{ color: C.muted, fontSize: 11, marginTop: 7 }}>
        {detail}
      </div>
    </div>
  );
}

function StatusRow({ label, value, good }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 12,
      padding: "13px 0",
      borderBottom: `1px solid ${C.border}`
    }}>
      <span style={{ color: C.text, fontSize: 12 }}>{label}</span>
      <span style={{
        color: good ? C.green : C.muted,
        fontSize: 11,
        fontWeight: 800
      }}>
        {value}
      </span>
    </div>
  );
}

export default function LiveMonitoring() {
  const [healthy, setHealthy] = useState(false);
  const [health, setHealth] = useState(null);
  const [checking, setChecking] = useState(true);
  const [lastChecked, setLastChecked] = useState(null);

  const refreshHealth = useCallback(async () => {
    setChecking(true);
    const ok = await checkBackendHealth(true);
    setHealthy(ok);
    setHealth(getCachedHealth());
    setLastChecked(new Date());
    setChecking(false);
  }, []);

  useEffect(() => {
    refreshHealth();
    const interval = setInterval(refreshHealth, 10000);
    return () => clearInterval(interval);
  }, [refreshHealth]);

  const device = health?.device || "—";
  const parameters = health?.parameters != null
    ? Number(health.parameters).toLocaleString()
    : "—";

  return (
    <div style={{
      minHeight: "100%",
      background: C.bg,
      color: C.text,
      padding: "27px clamp(15px, 3vw, 34px)",
      fontFamily: "Inter, Segoe UI, Arial, sans-serif"
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        <header style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 15,
          marginBottom: 27
        }}>
          <div>
            <div style={{
              color: C.green,
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: 2,
              marginBottom: 9
            }}>
              BHARATINTENT-X / OPERATIONS
            </div>
            <h1 style={{
              fontSize: "clamp(26px, 4vw, 35px)",
              margin: 0,
              letterSpacing: "-.8px"
            }}>
              Live Monitoring
            </h1>
            <p style={{ color: C.muted, fontSize: 13, marginTop: 8 }}>
              E58 inference service health and runtime information.
            </p>
          </div>

          <button
            onClick={refreshHealth}
            disabled={checking}
            style={{
              background: C.inner,
              border: `1px solid ${C.border}`,
              color: C.text,
              borderRadius: 9,
              padding: "10px 15px",
              cursor: checking ? "wait" : "pointer",
              fontSize: 12,
              fontWeight: 700
            }}
          >
            {checking ? "Checking..." : "↻ Refresh status"}
          </button>
        </header>

        {/* Main status */}
        <section style={{
          ...card,
          marginBottom: 22,
          borderLeft: `4px solid ${healthy ? C.green : C.red}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 15
        }}>
          <div>
            <div style={{ color: C.muted, fontSize: 10, fontWeight: 700 }}>
              E58 BACKEND STATUS
            </div>
            <div style={{
              color: healthy ? C.green : C.red,
              fontSize: 22,
              fontWeight: 800,
              marginTop: 7
            }}>
              {checking ? "CHECKING..." : healthy ? "OPERATIONAL" : "UNAVAILABLE"}
            </div>
            <div style={{ color: C.muted, fontSize: 11, marginTop: 6 }}>
              {healthy
                ? "Health endpoint confirms E58 is ready."
                : "Unable to confirm a ready E58 backend."}
            </div>
          </div>
          <div style={{
            background: healthy ? "#12372f" : "#3a1824",
            color: healthy ? C.green : C.red,
            padding: "9px 13px",
            borderRadius: 8,
            fontSize: 11,
            fontWeight: 800
          }}>
            {healthy ? "● ONLINE" : "● OFFLINE"}
          </div>
        </section>

        {/* Runtime metrics */}
        <section style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 17, margin: "0 0 12px" }}>
            Runtime information
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
            gap: 13
          }}>
            <Metric
              label="MODEL VERSION"
              value={health?.model_version || "—"}
              detail="Backend-reported version"
              color={C.green}
            />
            <Metric
              label="DEVICE"
              value={device.toUpperCase()}
              detail="Backend-reported execution device"
              color={C.blue}
            />
            <Metric
              label="PARAMETERS"
              value={parameters}
              detail="Model parameter count"
              color={C.cyan}
            />
            <Metric
              label="RELIABILITY GUARD"
              value={health?.reliability_guard || "—"}
              detail="Backend-reported guard version"
              color={C.amber}
            />
          </div>
        </section>

        {/* Service diagnostics */}
        <section style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 17, margin: "0 0 12px" }}>
            Service diagnostics
          </h2>
          <div style={card}>
            <StatusRow
              label="E58 FastAPI health endpoint"
              value={healthy ? "READY" : checking ? "CHECKING" : "UNAVAILABLE"}
              good={healthy}
            />
            <StatusRow
              label="Model version verification"
              value={health?.model_version === "E58" ? "VERIFIED" : "NOT VERIFIED"}
              good={health?.model_version === "E58"}
            />
            <StatusRow
              label="E65 reliability guard"
              value={health?.reliability_guard || "NOT REPORTED"}
              good={Boolean(health?.reliability_guard)}
            />
            <StatusRow
              label="Execution device"
              value={device.toUpperCase()}
              good={Boolean(health?.device)}
            />
          </div>
        </section>

        {/* Endpoint */}
        <section style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 17, margin: "0 0 12px" }}>
            Connection details
          </h2>
          <div style={card}>
            <div style={{ color: C.muted, fontSize: 10, marginBottom: 7 }}>
              BACKEND ADDRESS
            </div>
            <div style={{
              color: C.blue,
              fontSize: 13,
              fontWeight: 700,
              overflowWrap: "anywhere"
            }}>
              {getBackendUrl()}
            </div>
            <div style={{
              borderTop: `1px solid ${C.border}`,
              marginTop: 15,
              paddingTop: 13,
              color: C.muted,
              fontSize: 11
            }}>
              Last health check: {lastChecked
                ? lastChecked.toLocaleTimeString()
                : "Not checked"}
            </div>
            <div style={{
              color: C.muted,
              fontSize: 11,
              marginTop: 7
            }}>
              Automatically refreshed every 10 seconds.
            </div>
          </div>
        </section>

        {/* Honest telemetry notice */}
        <section style={{
          ...card,
          background: "#132238",
          borderColor: "#344963"
        }}>
          <h3 style={{ fontSize: 13, margin: "0 0 7px" }}>
            Monitoring scope
          </h3>
          <p style={{
            color: C.muted,
            fontSize: 11,
            lineHeight: 1.7,
            margin: 0
          }}>
            This page currently monitors backend health and model metadata.
            Request throughput, historical latency percentiles, CPU utilization,
            memory usage and request logs are not supplied by the health endpoint
            and are therefore not displayed.
          </p>
        </section>

        <footer style={{
          borderTop: `1px solid ${C.border}`,
          paddingTop: 15,
          marginTop: 24,
          color: "#71839c",
          fontSize: 10
        }}>
          BHARATINTENT-X · E58 service monitoring
        </footer>
      </div>
    </div>
  );
}
