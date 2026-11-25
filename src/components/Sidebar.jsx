
import React from "react";
import {
  LayoutDashboard,
  MessageSquareText,
  Languages,
  Compass,
  FileSpreadsheet,
  FlaskConical,
  Workflow,
  SearchCode,
  History,
  ChartNoAxesCombined,
  Database,
  AlertTriangle,
  Activity,
  Milestone,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  BrainCircuit
} from "lucide-react";

export const NAVIGATION_SECTIONS = [
  {
    title: "OVERVIEW",
    items: [
      { id: "command_center", label: "Command Center", icon: LayoutDashboard, badge: "Main" }
    ]
  },
  {
    title: "INTELLIGENCE",
    items: [
      { id: "live_inference", label: "Live Intent Recognition", icon: MessageSquareText, badge: "Core" },
      { id: "multilingual_lab", label: "Multilingual Intelligence", icon: Languages },
      { id: "intent_explorer", label: "Intent Explorer", icon: Compass, count: "56" },
      { id: "batch_prediction", label: "Batch Prediction", icon: FileSpreadsheet }
    ]
  },
  {
    title: "MODEL LAB",
    items: [
      { id: "model_laboratory", label: "Model Laboratory", icon: FlaskConical },
      { id: "architecture_visualizer", label: "Architecture Visualizer", icon: Workflow, badge: "Graph" },
      { id: "model_explainability", label: "Model Explainability", icon: SearchCode },
      { id: "experiments", label: "Experiments Tracking", icon: History }
    ]
  },
  {
    title: "ANALYTICS",
    items: [
      { id: "performance_analytics", label: "Performance Analytics", icon: ChartNoAxesCombined },
      { id: "dataset_intelligence", label: "Dataset Intelligence", icon: Database },
      { id: "error_analysis", label: "Error Analysis & Class 55", icon: AlertTriangle },
      { id: "live_monitoring", label: "Live Monitoring", icon: Activity }
    ]
  },
  {
    title: "PROJECT",
    items: [
      { id: "research_timeline", label: "Research Timeline", icon: Milestone }
    ]
  }
];

export default function Sidebar({
  currentPage,
  onSelectPage,
  collapsed,
  onToggleCollapsed,
  onLaunchJudgeMode,
  isLiveBackend
}) {
  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <a
          href="#overview"
          onClick={(e) => {
            e.preventDefault();
            onSelectPage("command_center");
          }}
          className="brand-wrapper"
        >
          <div className="brand-icon-box">
            <BrainCircuit size={22} />
          </div>

          {!collapsed && (
            <div className="brand-titles">
              <b>BharatIntent<span>-X</span></b>
              <small>Multilingual AI Platform</small>
            </div>
          )}
        </a>

        <button
          className="icon-button"
          onClick={onToggleCollapsed}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          style={{ width: 28, height: 28 }}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {NAVIGATION_SECTIONS.map((section) => (
          <div className="nav-section" key={section.title}>
            {!collapsed && (
              <div className="nav-section-title">{section.title}</div>
            )}

            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectPage(item.id)}
                  className={`nav-item ${isActive ? "active" : ""}`}
                  title={item.label}
                >
                  <Icon size={16} />

                  {!collapsed && (
                    <>
                      <span>{item.label}</span>

                      {item.badge && (
                        <span className="nav-badge">{item.badge}</span>
                      )}

                      {item.count && (
                        <span
                          className="nav-badge"
                          style={{
                            background: "rgba(6, 182, 212, 0.2)",
                            color: "#a5f3fc"
                          }}
                        >
                          {item.count}
                        </span>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        {!collapsed && (
          <button
            className="judge-cta-btn"
            onClick={onLaunchJudgeMode}
          >
            <Sparkles size={14} />
            <span>Judge Presentation Mode</span>
          </button>
        )}

        <div className="system-status-pill">
          <span
            className="pulse-dot"
            style={{
              background: isLiveBackend ? "#10b981" : "#06b6d4",
              boxShadow: isLiveBackend
                ? "0 0 10px #10b981"
                : "0 0 10px #06b6d4"
            }}
          />

          {!collapsed && (
            <span>
              {isLiveBackend ? "FastAPI Backend Live" : "Client Engine Ready"}
            </span>
          )}
        </div>
      </div>
    </aside>
  );
}
