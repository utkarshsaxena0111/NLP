import React from "react";
import { TrendingUp, Sparkles } from "lucide-react";

export default function StatCard({
  label,
  value,
  delta,
  deltaType = "positive", // positive, neutral, subtle
  icon: Icon,
  accentColor = "#6366f1",
  sparklineData = [40, 48, 45, 62, 58, 75, 84, 92]
}) {
  const points = sparklineData
    .map((val, idx) => {
      const x = (idx / (sparklineData.length - 1)) * 100;
      const y = 30 - (val / 100) * 26;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="metric-card" style={{ "--card-accent": accentColor }}>
      <div className="metric-card-top">
        <span className="metric-label">{label}</span>
        <div
          className="metric-icon-box"
          style={{
            background: `${accentColor}20`,
            color: accentColor,
            border: `1px solid ${accentColor}40`
          }}
        >
          {Icon ? <Icon size={16} /> : <Sparkles size={16} />}
        </div>
      </div>

      <div className="metric-value">{value}</div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span className={`metric-delta ${deltaType}`}>
          <TrendingUp size={12} />
          {delta}
        </span>

        {/* Subtle Micro-Sparkline */}
        <div style={{ width: 64, height: 20 }}>
          <svg viewBox="0 0 100 30" width="100%" height="100%" preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke={accentColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
