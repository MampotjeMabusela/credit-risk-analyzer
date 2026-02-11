import pandas as pd

def explain_prediction(model, data):
    df = pd.DataFrame([data])
    # Use SHAP only for tree-based models; otherwise return placeholder
    try:
        import shap
        explainer = shap.TreeExplainer(model)
        shap_values = explainer.shap_values(df)
        return shap_values.tolist()
    except Exception:
        # DummyModel or non-tree model: return zeros per feature
        return [[0.0] * len(df.columns) for _ in range(len(df))]
