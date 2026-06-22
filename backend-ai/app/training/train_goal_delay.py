import pandas as pd
import xgboost as xgb
import os
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
from loguru import logger
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
from app.utils.feature_engineering import create_preprocessing_pipeline, save_pipeline
import joblib

def train_model():
    dataset_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "dataset", "student_finance_dataset.csv")
    models_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models")
    os.makedirs(models_dir, exist_ok=True)

    df = pd.read_csv(dataset_path)
    
    features = [
        "goal_amount", "current_savings", "monthly_income", 
        "monthly_expenses", "purchase_cost", "goal_priority"
    ]
    target = "predicted_delay_months"
    
    X = df[features]
    y = df[target]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    numerical_cols = X.select_dtypes(include=['int64', 'float64']).columns.tolist()
    categorical_cols = X.select_dtypes(include=['object', 'category']).columns.tolist()

    pipeline = create_preprocessing_pipeline(numerical_cols, categorical_cols)
    
    X_train_processed = pipeline.fit_transform(X_train)
    X_test_processed = pipeline.transform(X_test)

    logger.info("Training Goal Delay Model (XGBoost Regressor)...")
    model = xgb.XGBRegressor(n_estimators=100, learning_rate=0.1, max_depth=5, random_state=42)
    model.fit(X_train_processed, y_train)

    y_pred = model.predict(X_test_processed)
    mse = mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    logger.info(f"Goal Delay Model - MSE: {mse:.4f}, R2: {r2:.4f}")

    joblib.dump(model, os.path.join(models_dir, "goal_delay_model.pkl"))
    save_pipeline(pipeline, os.path.join(models_dir, "goal_delay_pipeline.pkl"))
    logger.info("Saved Goal Delay model and pipeline.")

if __name__ == "__main__":
    train_model()
