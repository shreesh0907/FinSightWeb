import shap
import pandas as pd
from loguru import logger
import numpy as np

class ShapExplainer:
    def __init__(self, model_loader):
        self.loader = model_loader
        self.explainers = {}

    def _get_explainer(self, model_name, model, pipeline):
        if model_name not in self.explainers:
            try:
                # TreeExplainer is ideal for XGBoost/RandomForest
                self.explainers[model_name] = shap.TreeExplainer(model)
            except Exception as e:
                logger.warning(f"Failed to create TreeExplainer for {model_name}, falling back to KernelExplainer. Error: {e}")
                # Fallback, requires background data which isn't available easily here, so we might just use a generic approach or raise.
                # In this system, we mostly use tree-based models.
                pass
        return self.explainers.get(model_name)

    def explain(self, model_name: str, features: dict) -> dict:
        model, pipeline = self.loader.get_model(model_name)
        
        df = pd.DataFrame([features])
        df_transformed = pipeline.transform(df) if pipeline else df
        
        explainer = self._get_explainer(model_name, model, pipeline)
        if not explainer:
            return {"prediction": "Unknown", "top_factors": []}

        shap_values = explainer.shap_values(df_transformed)
        
        # If it's a classifier (e.g., purchase risk), shap_values might be a list of arrays.
        if isinstance(shap_values, list):
            # For multi-class, we take the class that was predicted
            pred_class = int(model.predict(df_transformed)[0])
            shap_values_to_use = shap_values[pred_class][0]
        else:
            shap_values_to_use = shap_values[0]
            if len(shap_values_to_use.shape) > 1: # Handling some specific SHAP formats
                 shap_values_to_use = shap_values_to_use[0]

        # Get feature names after pipeline transformation
        if pipeline:
            # Try to get feature names if ColumnTransformer is used
            try:
                feature_names = pipeline.get_feature_names_out()
            except AttributeError:
                feature_names = [f"Feature_{i}" for i in range(len(shap_values_to_use))]
        else:
            feature_names = list(df.columns)

        # Pair feature names with their SHAP values
        impacts = [{"feature": fn.replace("num__", "").replace("cat__", ""), "impact": float(val)} 
                   for fn, val in zip(feature_names, shap_values_to_use)]
        
        # Sort by absolute impact descending
        impacts.sort(key=lambda x: abs(x["impact"]), reverse=True)

        prediction = model.predict(df_transformed)[0]
        if hasattr(prediction, "item"):
            prediction = prediction.item()
            
        if model_name == "purchase_risk":
             class_mapping = {0: "Low", 1: "Medium", 2: "High", 3: "Critical"}
             prediction = class_mapping.get(int(prediction), "Unknown")

        return {
            "prediction": prediction,
            "top_factors": impacts[:5] # Top 5 factors
        }
