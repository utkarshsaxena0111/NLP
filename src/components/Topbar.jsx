
import React from "react";
import {
  Sun,
  Moon,
  Activity,
  Cpu,
  CheckCircle2
} from "lucide-react";

export default function Topbar({
  currentPage,
  pageTitle,
  activeModel,
  isLiveBackend,
  theme,
  onToggleTheme,
  onLaunchJudgeMode,
  searchQuery,
  onSearchChange,
  onSelectPage
}) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        {/* Search temporarily hidden */}
        <div className="topbar-chip champion">
          <Cpu size={13} />
          <span>
            Active: <b>{activeModel?.name || "BharatIntent-X E58"}</b>
          </span>
        </div>
      </div>

      <div className="topbar-right">
        <div
          className={`topbar-chip ${isLiveBackend ? "live-status" : ""}`}
          onClick={() => onSelectPage("settings_page")}
          style={{ cursor: "pointer" }}
          title={
            isLiveBackend
              ? "Connected to FastAPI Backend (port 8000)"
              : "Running embedded client inference engine"
          }
        >
          {isLiveBackend ? (
            <>
              <CheckCircle2 size={13} style={{ color: "#10b981" }} />
              <span>
                FastAPI Live: <b>8000</b>
              </span>
            </>
          ) : (
            <>
              <Activity size={13} style={{ color: "#06b6d4" }} />
              <span>
                Engine: <b>Client Offline Ready</b>
              </span>
            </>
          )}
        </div>

        {/* Judge Pitch temporarily hidden */}

        <button
          className="icon-button"
          onClick={onToggleTheme}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>
    </header>
  );
}
