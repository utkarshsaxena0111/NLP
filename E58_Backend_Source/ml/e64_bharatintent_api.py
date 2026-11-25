
"""Local API for frozen E58 plus the independent E65 Intent Reliability Guard."""

import os
from contextlib import asynccontextmanager
from threading import Lock
from typing import Annotated

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, StringConstraints

from ml.e61_bharatintent_engine import BharatIntentEngine
from ml.e65_reliability_guard import (
    assess_reliability,
    VERSION as GUARD_VERSION,
)

# --------------------------------------------------
# Request schemas
# --------------------------------------------------

Query = Annotated[str, StringConstraints(min_length=1, max_length=2000)]


class PredictRequest(BaseModel):
    query: Query
    top_k: int = Field(default=5, ge=1, le=56)


class BatchRequest(BaseModel):
    queries: list[Query] = Field(min_length=1, max_length=256)
    top_k: int = Field(default=5, ge=1, le=56)


# --------------------------------------------------
# Startup and shutdown
# --------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Loading frozen E58 champion model...")

    app.state.engine = BharatIntentEngine(
        champion=os.getenv("BHARATINTENT_CHAMPION") or None,
        device=os.getenv("BHARATINTENT_DEVICE", "auto"),
    )

    app.state.lock = Lock()

    print("E58 model loaded successfully.")
    print(f"E65 Reliability Guard: {GUARD_VERSION}")

    yield

    print("Shutting down BharatIntent-X API...")
    del app.state.engine
    del app.state.lock


# IMPORTANT: lifespan must be connected here.
app = FastAPI(
    title="BharatIntent-X",
    version="E58+E65-IRG",
    description=(
        "Frozen E58 multilingual classifier with separate "
        "E65 reliability diagnostics. "
        "E58 scores are not calibrated probabilities."
    ),
    lifespan=lifespan,
)


# --------------------------------------------------
# CORS configuration
# --------------------------------------------------

origins = os.getenv(
    "BHARATINTENT_CORS",
    (
        "http://localhost:5000,"
        "http://127.0.0.1:5000,"
        "http://localhost:5173,"
        "http://127.0.0.1:5173"
    ),
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[s.strip() for s in origins if s.strip()],
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


# --------------------------------------------------
# Health endpoint
# --------------------------------------------------

@app.get("/health")
def health(request: Request):
    e = request.app.state.engine

    return {
        "status": "ready",
        "model_version": "E58",
        "reliability_guard": GUARD_VERSION,
        "device": str(e.device),
        "parameters": e.params,
    }


# --------------------------------------------------
# Model information
# --------------------------------------------------

@app.get("/model-info")
def model_info(request: Request):
    e = request.app.state.engine

    return {
        "model_version": "E58",
        "reliability_guard": GUARD_VERSION,
        "encoder": "google/muril-base-cased",
        "checkpoint_epoch": 7,
        "parameters": e.params,
        "classes": list(range(56)),
        "oos_class": 55,
        "max_tokens": 64,
        "neural_weight": 0.4,
        "lexical_weight": 0.6,
        "tta_weight_within_neural": 0.15,
        "neural_scale": e.zs,
        "lexical_scale": e.ls,
        "device": str(e.device),
        "precision": str(e.dtype),
        "score_type": "normalized_decision_score_not_probability",
        "script_is_heuristic": True,
        "prediction_logic": "frozen_original_E58",
    }


# --------------------------------------------------
# Official and verified metrics
# --------------------------------------------------

@app.get("/metrics")
def metrics():
    return {
        "public_leaderboard": {
            "macro_f1": 0.86085,
            "rank_at_reported_snapshot": 3,
        },
        "official_final": {
            "shortlist_rank": 4,
            "shortlisted_teams": 15,
            "competing_teams": 28,
            "private_macro_f1": 0.83961,
            "cumulative_score": 0.85023,
        },
        "grouped_fold_0": {
            "macro_f1": 0.8962310186539048,
            "latin_macro_f1": 0.918310841432447,
            "accuracy": 0.8993209329790375,
            "oos_f1": 0.8761904761904762,
        },
        "reproduction": {
            "device": "cuda",
            "precision": "bfloat16",
            "rows": 4912,
            "mismatches": 0,
        },
        "note": (
            "E65 diagnostics are separate and do not alter "
            "E58 benchmark metrics."
        ),
    }


# --------------------------------------------------
# Intent taxonomy
# --------------------------------------------------

@app.get("/intents")
def intents():
    return {
        "intents": [
            {
                "intent_id": i,
                "name": "Out of scope" if i == 55 else None,
            }
            for i in range(56)
        ],
        "note": "Human-readable names require verified label mapping.",
    }


# --------------------------------------------------
# Validation and reliability guard
# --------------------------------------------------

def validate(texts: list[str]):
    if any(not text.strip() for text in texts):
        raise HTTPException(
            status_code=422,
            detail="Queries must not be blank",
        )


def attach_guard(query: str, prediction: dict):
    """
    Preserve the original E58 prediction.
    Add E65 reliability assessment separately.
    """
    result = dict(prediction)

    result["reliability_guard"] = assess_reliability(
        query,
        prediction,
    )

    return result


# --------------------------------------------------
# Single prediction endpoint
# --------------------------------------------------

@app.post("/predict")
def predict(body: PredictRequest, request: Request):
    validate([body.query])

    with request.app.state.lock:
        original = request.app.state.engine.predict(
            body.query,
            body.top_k,
        )

    return attach_guard(body.query, original)


# --------------------------------------------------
# Batch prediction and comparison endpoints
# --------------------------------------------------

@app.post("/predict-batch")
@app.post("/compare")
def batch(body: BatchRequest, request: Request):
    validate(body.queries)

    with request.app.state.lock:
        original = request.app.state.engine.predict_batch(
            body.queries,
            body.top_k,
        )

    predictions = [
        attach_guard(query, prediction)
        for query, prediction in zip(
            body.queries,
            original["predictions"],
        )
    ]

    return {
        **original,
        "predictions": predictions,
    }
