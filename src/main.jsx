import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

// Layout Components
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import PresentationMode from "./components/PresentationMode";

// Functional Pages
import CommandCenter from "./pages/CommandCenter";
import LiveInference from "./pages/LiveInference";
import MultilingualLab from "./pages/MultilingualLab";
import IntentExplorer from "./pages/IntentExplorer";
import BatchPrediction from "./pages/BatchPrediction";
import ModelLaboratory from "./pages/ModelLaboratory";
import ArchitectureVisualizer from "./pages/ArchitectureVisualizer";
import ModelExplainability from "./pages/ModelExplainability";
import PerformanceAnalytics from "./pages/PerformanceAnalytics";
import DatasetIntelligence from "./pages/DatasetIntelligence";
import ErrorAnalysis from "./pages/ErrorAnalysis";
import LiveMonitoring from "./pages/LiveMonitoring";
import ResearchTimeline from "./pages/ResearchTimeline";
import AboutProject from "./pages/AboutProject";
import SettingsPage from "./pages/SettingsPage";

// Services and Data
import { MODELS_REGISTRY } from "./data/modelsRegistry";
import { checkBackendHealth } from "./services/api";

function App() {
  const [currentPage, setCurrentPage] = useState("command_center");
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [activeModelId, setActiveModelId] = useState("e58");
  const [isLiveBackend, setIsLiveBackend] = useState(false);
  const [isJudgeModeOpen, setIsJudgeModeOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const [activeQuery, setActiveQuery] = useState("कल सुबह 7 बजे का अलार्म लगा दो");

  const activeModel = MODELS_REGISTRY.find((m) => m.id === activeModelId) || MODELS_REGISTRY[0];

  // Apply theme class to document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Periodic health check for FastAPI backend
  useEffect(() => {
    const check = async () => {
      const healthy = await checkBackendHealth();
      setIsLiveBackend(healthy);
    };
    check();
    const interval = setInterval(check, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleTheme = () => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "command_center":
        return (
          <CommandCenter
            onSelectPage={setCurrentPage}
            onRunQuery={(q) => {
              setActiveQuery(q);
              setCurrentPage("live_inference");
            }}
          />
        );
      case "live_inference":
        return (
          <LiveInference
            initialQuery={activeQuery}
            activeModelId={activeModelId}
          />
        );
      case "multilingual_lab":
        return <MultilingualLab />;
      case "intent_explorer":
        return (
          <IntentExplorer
            onSelectQuery={(q) => {
              setActiveQuery(q);
              setCurrentPage("live_inference");
            }}
          />
        );
      case "batch_prediction":
        return <BatchPrediction />;
      case "model_laboratory":
        return <ModelLaboratory onSelectModel={setActiveModelId} />;
      case "architecture_visualizer":
        return <ArchitectureVisualizer />;
      case "model_explainability":
        return <ModelExplainability />;
      case "experiments":
        return <ResearchTimeline />;
      case "performance_analytics":
        return <PerformanceAnalytics />;
      case "dataset_intelligence":
        return <DatasetIntelligence />;
      case "error_analysis":
        return <ErrorAnalysis />;
      case "live_monitoring":
        return <LiveMonitoring />;
      case "research_timeline":
        return <ResearchTimeline />;
      case "about_project":
        return <AboutProject />;
      case "settings_page":
        return (
          <SettingsPage
            activeModelId={activeModelId}
            onSelectModel={setActiveModelId}
            isLiveBackend={isLiveBackend}
          />
        );
      default:
        return (
          <CommandCenter
            onSelectPage={setCurrentPage}
            onRunQuery={(q) => {
              setActiveQuery(q);
              setCurrentPage("live_inference");
            }}
          />
        );
    }
  };

  return (
    <div className="app-shell">
      <Sidebar
        currentPage={currentPage}
        onSelectPage={setCurrentPage}
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed(!collapsed)}
        onLaunchJudgeMode={() => setIsJudgeModeOpen(true)}
        isLiveBackend={isLiveBackend}
      />

      <div className="main-wrapper">
        <Topbar
          currentPage={currentPage}
          activeModel={activeModel}
          isLiveBackend={isLiveBackend}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onLaunchJudgeMode={() => setIsJudgeModeOpen(true)}
          searchQuery={globalSearch}
          onSearchChange={setGlobalSearch}
          onSelectPage={setCurrentPage}
        />

        <main className="content-container">
          {renderCurrentPage()}
        </main>
      </div>

      {/* FULLSCREEN JUDGE PRESENTATION MODE OVERLAY */}
      {isJudgeModeOpen && (
        <PresentationMode onClose={() => setIsJudgeModeOpen(false)} />
      )}
    </div>
  );
}

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
