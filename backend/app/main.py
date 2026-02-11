from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.models import load_model, predict_default
from app.explain import explain_prediction


app = FastAPI(title="Credit Risk Analyzer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = load_model()


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict")
def predict(data: dict):
    prob = predict_default(model, data)
    return {"default_probability": prob}


@app.post("/explain")
def explain(data: dict):
    explanation = explain_prediction(model, data)
    return {"explanation": explanation}

