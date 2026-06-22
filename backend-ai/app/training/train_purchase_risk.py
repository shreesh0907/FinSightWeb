import pandas as pd
import xgboost as xgb
import os
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix
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
        "purchase_cost", "monthly_income", "current_savings", 
        "goal_amount", "emergency_fund", "monthly_expenses"
    ]
    target = "purchase_risk_class"
    
    X = df[features]
    y = df[target]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    numerical_cols = X.select_dtypes(include=['int64', 'float64']).columns.tolist()
    categorical_cols = X.select_dtypes(include=['object', 'category']).columns.tolist()

    pipeline = create_preprocessing_pipeline(numerical_cols, categorical_cols)
    
    X_train_processed = pipeline.fit_transform(X_train)
    X_test_processed = pipeline.transform(X_test)

    logger.info("Training Purchase Risk Model (XGBoost Classifier)...")
    model = xgb.XGBClassifier(n_estimators=100, learning_rate=0.1, max_depth=5, random_state=42)
    model.fit(X_train_processed, y_train)

    y_pred = model.predict(X_test_processed)
    
    logger.info("Purchase Risk Model Evaluation:")
    logger.info("\n" + classification_report(y_test, y_pred))
    logger.info("Confusion Matrix:\n" + str(confusion_matrix(y_test, y_pred)))

    joblib.dump(model, os.path.join(models_dir, "purchase_risk_model.pkl"))
    save_pipeline(pipeline, os.path.join(models_dir, "purchase_risk_pipeline.pkl"))
    logger.info("Saved Purchase Risk model and pipeline.")

if __name__ == "__main__":
    train_model()
