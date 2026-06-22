import os
import joblib
from loguru import logger

class ModelLoader:
    _instance = None

    def __init__(self):
        self.models = {}
        self.pipelines = {}
        self.models_dir = os.getenv("MODEL_DIR", "app/models")
        self.model_configs = {
            "financial_health": "financial_health_model.pkl",
            "purchase_risk": "purchase_risk_model.pkl",
            "goal_delay": "goal_delay_model.pkl",
            "course_affordability": "course_affordability_model.pkl",
            "subscription_burden": "subscription_burden_model.pkl"
        }

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = ModelLoader()
        return cls._instance

    def load_all_models(self):
        for name, filename in self.model_configs.items():
            model_path = os.path.join(self.models_dir, filename)
            pipeline_path = os.path.join(self.models_dir, f"{name}_pipeline.pkl")
            
            try:
                if os.path.exists(model_path):
                    self.models[name] = joblib.load(model_path)
                    logger.info(f"Loaded model: {name}")
                else:
                    logger.warning(f"Model file not found: {model_path}")
                
                if os.path.exists(pipeline_path):
                    self.pipelines[name] = joblib.load(pipeline_path)
                    logger.info(f"Loaded pipeline: {name}")
                else:
                    self.pipelines[name] = None
            except Exception as e:
                logger.error(f"Error loading {name}: {e}")

    def get_model(self, name: str):
        if name not in self.models:
            raise ValueError(f"Model {name} not found or not loaded.")
        return self.models[name], self.pipelines.get(name)
