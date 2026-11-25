import taxonomy from "../data/intentTaxonomy.json";

const DEFAULT_BACKEND_URL = "http://localhost:8000";

let currentBackendUrl = DEFAULT_BACKEND_URL;
let lastHealthCheck = 0;
let backendHealthy = false;
let cachedHealth = null;

const INTENT_MAP = Object.fromEntries(
  taxonomy.map((item) => [
    Number(item.id),
    {
      name: item.name || `Intent Class ${item.id}`,
      displayName:
        item.displayName ||
        item.name ||
        `Intent Class ${item.id}`
    }
  ])
);

export function getIntentName(intentId) {
  const id = Number(intentId);
  return INTENT_MAP[id]?.displayName ?? `Intent Class ${intentId}`;
}

export function setBackendUrl(url) {
  currentBackendUrl = String(url || DEFAULT_BACKEND_URL)
    .trim()
    .replace(/\/+$/, "");

  lastHealthCheck = 0;
  backendHealthy = false;
  cachedHealth = null;
}

export function getBackendUrl() {
  return currentBackendUrl;
}

async function request(path, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const res = await fetch(`${currentBackendUrl}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...(options.headers || {})
      }
    });

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      const detail =
        typeof body.detail === "string"
          ? body.detail
          : `HTTP ${res.status}`;

      throw new Error(detail);
    }

    return body;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function checkBackendHealth(force = false) {
  const now = Date.now();

  if (!force && now - lastHealthCheck < 3000) {
    return backendHealthy;
  }

  try {
    const health = await request("/health");

    backendHealthy =
      health.status === "ready" &&
      health.model_version === "E58";

    cachedHealth = backendHealthy ? health : null;
  } catch {
    backendHealthy = false;
    cachedHealth = null;
  }

  lastHealthCheck = now;
  return backendHealthy;
}

export function getCachedHealth() {
  return cachedHealth;
}

function adaptPrediction(data, originalQuery = "") {
  const id = Number(data.intent_id);
  const intent = INTENT_MAP[id];

  const top5 = (data.top_intents || []).map((item) => {
    const itemId = Number(item.intent_id);
    const meta = INTENT_MAP[itemId];

    return {
      intentId: itemId,
      intent_id: itemId,
      intentName: meta?.name ?? `Intent Class ${itemId}`,
      displayName: meta?.displayName ?? `Intent Class ${itemId}`,
      labelType: "Dataset-derived",
      score: Number(item.score),
      scoreType: "Decision score"
    };
  });

  const nativeOutOfScope =
    Boolean(data.out_of_scope) || id === 55;

  const guard = data.reliability_guard || null;

  return {
    ...data,
    rawApiResponse: data,

    intentId: id,
    intent_id: id,
    intentName: intent?.name ?? `Intent Class ${id}`,
    displayName: intent?.displayName ?? `Intent Class ${id}`,
    intentLabelType: "Dataset-derived",

    // Native E58 result remains independent from E65.
    isOutOfScope: nativeOutOfScope,
    nativeOutOfScope,

    top5,

    // E65 assessment is kept as a separate object.
    reliabilityGuard: guard,
    reliabilityStatus: guard?.status ?? (
      nativeOutOfScope ? "POTENTIALLY_UNSUPPORTED" : "UNAVAILABLE"
    ),
    reliabilityReasons: guard?.triggered_reasons ?? [],
    detectedDomain: guard?.detected_domain ?? null,
    reliabilityAction: guard?.recommended_action ?? null,
    predictionUnchanged: guard?.prediction_unchanged ?? null,

    // Compatibility fields for existing dashboard components.
    paymentDomainWarning:
      guard?.detected_domain === "banking_transfer" ||
      guard?.detected_domain === "loan_credit" ||
      guard?.detected_domain === "bill_payment",

    reviewRequired: guard?.status === "REVIEW_REQUIRED",

    confidence: null,
    confidencePercent: null,

    margin: Number(data.margin),
    script: data.script,
    modelUsed: "E58",
    latencyMs: Number(data.latency_ms),

    expertAgreement: Boolean(data.expert_agreement),
    neuralIntent: Number(data.neural_intent),
    lexicalIntent: Number(data.lexical_intent),

    scoreType: "normalized_decision_score_not_probability",
    isLiveBackend: true,
    originalQuery
  };
}

export async function predictIntent(query) {
  if (!String(query || "").trim()) {
    throw new Error("Enter a query before running inference.");
  }

  const healthy = await checkBackendHealth(true);

  if (!healthy) {
    throw new Error(
      `E58 backend is unavailable. Start the E58 FastAPI server at ${currentBackendUrl}.`
    );
  }

  const data = await request("/predict", {
    method: "POST",
    body: JSON.stringify({
      query: String(query),
      top_k: 5
    })
  });

  return adaptPrediction(data, query);
}

export async function predictBatch(rows, _modelId, onProgress) {
  const items = rows.map((item, index) => ({
    id:
      typeof item === "object"
        ? (item.example_id ?? item.id ?? index + 1)
        : index + 1,
    query:
      typeof item === "string"
        ? item
        : (
            item.query_text ??
            item.query ??
            item.text ??
            ""
          )
  }));

  if (!items.length) return [];

  if (items.some((item) => !String(item.query).trim())) {
    throw new Error("Every batch row must contain a non-empty query.");
  }

  const healthy = await checkBackendHealth(true);

  if (!healthy) {
    throw new Error(
      "E58 backend is unavailable. Batch predictions were not simulated."
    );
  }

  const output = [];
  const chunkSize = 24;

  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);

    const data = await request("/predict-batch", {
      method: "POST",
      body: JSON.stringify({
        queries: chunk.map((item) => item.query),
        top_k: 5
      })
    });

    if (!Array.isArray(data.predictions)) {
      throw new Error("Invalid response from E58 batch prediction API.");
    }

    if (data.predictions.length !== chunk.length) {
      throw new Error(
        "E58 returned a different number of predictions than requested."
      );
    }

    data.predictions.forEach((prediction, j) => {
      output.push({
        example_id: chunk[j].id,
        query: chunk[j].query,
        ...adaptPrediction(prediction, chunk[j].query)
      });
    });

    if (onProgress) {
      onProgress(
        Math.min(
          100,
          Math.round(((i + chunk.length) / items.length) * 100)
        )
      );
    }
  }

  return output;
}

export async function explainPrediction(query) {
  const result = await predictIntent(query);

  return {
    ...result,
    tokenAttributions: [],

    subscores: {
      neural: result.neural_scores,
      lexical: result.lexical_scores,
      fused: result.scores
    },

    uncertaintyWarning: result.expertAgreement
      ? null
      : "Neural and lexical experts disagree. This is a diagnostic signal, not proof of an incorrect prediction.",

    explanationNote:
      "Intent names are dataset-derived display labels. E58 exposes expert decision scores, not calibrated probabilities or token-level SHAP/attention attributions."
  };
}