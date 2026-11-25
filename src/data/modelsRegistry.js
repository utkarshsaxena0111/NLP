export const MODELS_REGISTRY = [
  {
    id: "e58",
    name: "E58 Verified MuRIL + Dual TF-IDF Champion",
    code: "E58-MURIL-CHAR-ENSEMBLE",
    version: "E58",
    tag: "Champion",
    isChampion: true,
    status: "Backend required",
    deploymentStatus: "Local FastAPI deployment",
    kagglePublicScore: 0.86085,
    validationScore: 0.896231,
    accuracy: 89.9321,
    latencyMs: null,
    sizeMB: null,
    parameters: "247,005,184 counted parameters",
    color: "#10b981",
    accentGlow: "rgba(16, 185, 129, 0.35)",
    architecture: "MuRIL + romanization TTA + character TF-IDF LinearSVC + character word-boundary TF-IDF LinearSVC with fixed normalized score fusion",
    trainingInfo: "Epoch-7 checkpoint; public leaderboard Macro-F1 0.86085; grouped fold-0 Macro-F1 0.896231.",
    supportedScripts: ["Devanagari", "Latin (Romanized)", "Mixed Hinglish", "English"],
    strengths: ["Verified E58 champion; fixed 56-class decision-score fusion", "Neural and lexical expert score outputs"],
    limitations: ["Requires the local E58 model artifacts and FastAPI backend", "Scores are decision scores, not calibrated probabilities"],
    scriptPerformance: { latin: 0.918311, devanagari: null, mixed: null }
  },
  {
    id: "e46",
    name: "E46 Augmented Hybrid",
    code: "E46-AUG-HYBRID",
    version: "v2.4.1",
    tag: "Champion",
    isChampion: true,
    status: "Ready",
    deploymentStatus: "Production Deployed",
    kagglePublicScore: 0.81043,
    validationScore: 0.8663,
    accuracy: 87.42,
    latencyMs: 14,
    sizeMB: 38.4,
    parameters: "14.2M features",
    color: "#6366f1",
    accentGlow: "rgba(99, 102, 241, 0.4)",
    architecture: "Augmented Hybrid (Character n-gram TF-IDF [2-5] + Sublinear TF + LinearSVC + Synthetic Romanization)",
    trainingInfo: "Trained on 40,800 augmented examples (16,936 original + 23,864 retained synthetic Romanization variants).",
    supportedScripts: ["Devanagari", "Latin (Romanized)", "Mixed Hinglish", "English"],
    strengths: [
      "Highest competition public score (0.81043)",
      "Exceptional robustness to informal Romanized spelling variations",
      "Sub-20ms ultra-low CPU inference latency",
      "No GPU required for production serving"
    ],
    limitations: [
      "Sublinear lexical decay on very long conversational queries (>120 chars)",
      "Requires explicit dictionary coverage for regional dialect slang"
    ],
    scriptPerformance: {
      latin: 0.8825,
      devanagari: 0.8389,
      mixed: 0.7588
    }
  },
  {
    id: "e50",
    name: "E50 Script-Aware Hybrid",
    code: "E50-SCRIPT-ROUTED",
    version: "v2.1.0",
    tag: "Routing",
    isChampion: false,
    status: "Ready",
    deploymentStatus: "Production Deployed",
    kagglePublicScore: 0.80168,
    validationScore: 0.8413,
    accuracy: 85.19,
    latencyMs: 22,
    sizeMB: 46.2,
    parameters: "18.5M features",
    color: "#06b6d4",
    accentGlow: "rgba(6, 182, 212, 0.4)",
    architecture: "Script-Aware Dual-Stream Routing (Unicode codepoint heuristic -> Devanagari Expert vs Latin Expert)",
    trainingInfo: "Separate expert training on partitioned script corpuses with cross-boundary consensus voting.",
    supportedScripts: ["Devanagari", "Latin (Romanized)", "Mixed Hinglish"],
    strengths: [
      "Superior Devanagari grammatical agreement handling",
      "Independent hyperparameter tuning per script branch",
      "Prevents cross-script feature interference"
    ],
    limitations: [
      "Slight degradation on ambiguous mixed-script code-switched queries",
      "Dual pipeline overhead increases memory footprint"
    ],
    scriptPerformance: {
      latin: 0.8654,
      devanagari: 0.8542,
      mixed: 0.7321
    }
  },
  {
    id: "phon",
    name: "Phonetic Expert (E27 / E59)",
    code: "E27-PHONETIC-SKELETON",
    version: "v1.9.3",
    tag: "Phonetic",
    isChampion: false,
    status: "Ready",
    deploymentStatus: "Production Deployed",
    kagglePublicScore: 0.79428,
    validationScore: 0.8521,
    accuracy: 84.76,
    latencyMs: 9,
    sizeMB: 28.1,
    parameters: "8.9M features",
    color: "#f59e0b",
    accentGlow: "rgba(245, 158, 11, 0.4)",
    architecture: "Consonant-Skeleton Hashing & Transliteration Normalization (Soundex-indic + character n-grams)",
    trainingInfo: "Vowel-invariant canonical skeleton mapping collapsing 'kripaya', 'kirpya', 'krpya' to identical roots.",
    supportedScripts: ["Latin (Romanized)", "Hinglish Slang", "Devanagari"],
    strengths: [
      "Extremely robust to typographical errors, phonetic slurs, and SMS texting styles",
      "Fastest inference latency (<10ms)",
      "High precision on colloquial Romanized Hindi"
    ],
    limitations: [
      "Reduced discriminative capability between minimal-pair vocabulary words",
      "Lower performance on English-only syntax"
    ],
    scriptPerformance: {
      latin: 0.8712,
      devanagari: 0.8015,
      mixed: 0.7490
    }
  },
  {
    id: "e60",
    name: "E60 Neural Semantic Encoder",
    code: "E60-INDIC-ENCODER",
    version: "v3.0.0-rc",
    tag: "Encoder",
    isChampion: false,
    status: "Integration pending",
    deploymentStatus: "Checkpoint Adapter Pending",
    kagglePublicScore: null,
    validationScore: 0.8715,
    accuracy: 88.04,
    latencyMs: 68,
    sizeMB: 480.0,
    parameters: "110M params",
    color: "#ec4899",
    accentGlow: "rgba(236, 72, 153, 0.4)",
    architecture: "IndicBERT / XLM-RoBERTa Dense Representation with Classification Head",
    trainingInfo: "Fine-tuned on competition training split with cosine warmup and AdamW.",
    supportedScripts: ["Devanagari", "Latin (Romanized)", "Mixed Hinglish", "English"],
    strengths: [
      "Deep semantic generalization across complex syntactic structures",
      "Zero-shot transfer capability across Indic languages"
    ],
    limitations: [
      "GPU deployment recommended; CPU latency higher than linear classifiers",
      "Requires ONNX runtime optimization for browser edge deployment"
    ],
    scriptPerformance: {
      latin: 0.8890,
      devanagari: 0.8795,
      mixed: 0.8240
    }
  },
  {
    id: "muril",
    name: "MuRIL Transformer Classifier",
    code: "MURIL-BASE-C56",
    version: "v3.2.0-exp",
    tag: "Transformer",
    isChampion: false,
    status: "Experimental",
    deploymentStatus: "Research Evaluation",
    kagglePublicScore: null,
    validationScore: 0.8842,
    accuracy: 89.65,
    latencyMs: 115,
    sizeMB: 950.0,
    parameters: "237.6M params",
    color: "#8b5cf6",
    accentGlow: "rgba(139, 92, 246, 0.4)",
    architecture: "Google MuRIL (Multilingual Representations for Indian Languages) with 56-class linear head",
    trainingInfo: "Pretrained on 17 Indian languages with monolingual + translated + transliterated pairs.",
    supportedScripts: ["Devanagari", "Latin", "Mixed", "Regional scripts"],
    strengths: [
      "Industry-standard foundation model for Indian multilingual NLP",
      "Unmatched cross-script phonetic embedding alignment"
    ],
    limitations: [
      "Heavy memory footprint (requires dedicated GPU server for high QPS)",
      "Higher cold-start latency"
    ],
    scriptPerformance: {
      latin: 0.8992,
      devanagari: 0.8910,
      mixed: 0.8412
    }
  },
  {
    id: "v3",
    name: "V3 Multimodal Agentic Engine",
    code: "V3-AGENTIC-FUSION",
    version: "v4.0.0-alpha",
    tag: "Planned",
    isChampion: false,
    status: "Planned",
    deploymentStatus: "Roadmap Stage",
    kagglePublicScore: null,
    validationScore: null,
    accuracy: null,
    latencyMs: null,
    sizeMB: null,
    parameters: "Planned Architecture",
    color: "#3b82f6",
    accentGlow: "rgba(59, 130, 246, 0.4)",
    architecture: "Joint Hierarchical Intent Disambiguation with Agentic Action Routing",
    trainingInfo: "Planned next-generation architecture combining E46 lexical speed with MuRIL semantic depth.",
    supportedScripts: ["Pan-Indian 22 Official Languages"],
    strengths: [
      "End-to-end intent to tool execution mapping",
      "Dynamic confidence gating"
    ],
    limitations: [
      "Currently under active design phase"
    ],
    scriptPerformance: {
      latin: null,
      devanagari: null,
      mixed: null
    }
  }
];

export const HISTORICAL_EXPERIMENTS = [
  {
    id: "EXP-01",
    name: "Initial Lexical Baseline",
    date: "2026-11-21",
    model: "LinearSVC + Word TF-IDF",
    valScore: 0.7421,
    publicScore: 0.75596,
    status: "Completed",
    notes: "Initial word n-gram model. Suffered on unstandardized Romanized Hindi variations.",
    delta: "Baseline"
  },
  {
    id: "EXP-27",
    name: "E27 Phonetic Skeleton Model",
    date: "2026-11-23",
    model: "Consonant Skeletal Normalization + Char TF-IDF",
    valScore: 0.7890,
    publicScore: 0.79428,
    status: "Completed",
    notes: "Significant +0.0383 jump on Romanized test queries by invariant consonant hashing.",
    delta: "+0.03832"
  },
  {
    id: "EXP-59",
    name: "E59 Phonetic Skeleton Pruned",
    date: "2026-11-24",
    model: "Sublinear Phonetic Skeleton with Min-DF 5",
    valScore: 0.7684,
    publicScore: 0.77268,
    status: "Completed",
    notes: "Pruned rare ngrams for memory optimization. Observed minor regression in rare classes.",
    delta: "-0.02160"
  },
  {
    id: "EXP-50",
    name: "E50 Script-Aware Hybrid",
    date: "2026-11-24",
    model: "Script-Routed Dual Classifier",
    valScore: 0.8413,
    publicScore: 0.80168,
    status: "Completed",
    notes: "Partitioned Devanagari and Latin pipelines. Strong in-domain cross-validation.",
    delta: "+0.00740"
  },
  {
    id: "EXP-46",
    name: "E46 Augmented Hybrid (CHAMPION)",
    date: "2026-11-24",
    model: "E46 Char [2-5] TF-IDF + Synthetic Romanization",
    valScore: 0.8663,
    publicScore: 0.81043,
    status: "Active Champion",
    notes: "Current best public Kaggle submission. Trained on 40,800 augmented training instances.",
    delta: "+0.01615"
  }
];
