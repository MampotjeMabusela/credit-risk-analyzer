import os
from typing import Any, Dict

import joblib
import numpy as np
import pandas as pd


class DummyModel:
    """
    Fallback model used when the real trained model file is not available.
    Returns a fixed 50/50 default probability so the API stays functional.
    """

    def predict_proba(self, X):
        n = len(X)
        return np.array([[0.5, 0.5]] * n)


def load_model() -> Any:
    """
    Load a trained model if present; otherwise return a dummy model so that
    the API can run without a local model file.
    """
    model_path = os.getenv("MODEL_PATH", "xgb_model.pkl")
    try:
        return joblib.load(model_path)
    except Exception:
        # In dev / fresh environments, we gracefully fall back instead of crashing.
        return DummyModel()


def predict_default(model: Any, data: Dict) -> float:
    """
    Compute the default probability for a single applicant payload.
    """
    df = pd.DataFrame([data])
    prob = float(model.predict_proba(df)[0][1])
    return round(prob, 3)

