import pandas as pd
import numpy as np
import os
import random
from loguru import logger

NUM_RECORDS = 50000
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "dataset")
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "student_finance_dataset.csv")

def generate_dataset():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    logger.info(f"Generating {NUM_RECORDS} synthetic student financial records...")

    data = {
        "student_id": [f"STU_{i:06d}" for i in range(1, NUM_RECORDS + 1)],
        "age": np.random.randint(18, 26, NUM_RECORDS),
        "college_year": np.random.choice([1, 2, 3, 4, 5], NUM_RECORDS, p=[0.25, 0.25, 0.25, 0.20, 0.05]),
        "monthly_allowance": np.random.normal(15000, 5000, NUM_RECORDS).clip(5000, 40000),
        "internship_income": np.random.choice([0, 5000, 10000, 15000, 20000], NUM_RECORDS, p=[0.6, 0.15, 0.15, 0.05, 0.05]),
        "fixed_expenses": np.random.normal(8000, 2000, NUM_RECORDS).clip(3000, 20000),
        "variable_expenses": np.random.normal(5000, 3000, NUM_RECORDS).clip(1000, 15000),
        "current_savings": np.random.exponential(15000, NUM_RECORDS).clip(0, 100000),
        "emergency_fund": np.random.exponential(5000, NUM_RECORDS).clip(0, 50000),
        "goal_amount": np.random.normal(50000, 20000, NUM_RECORDS).clip(5000, 200000),
        "goal_priority": np.random.randint(1, 6, NUM_RECORDS),
        "subscription_cost": np.random.normal(1000, 500, NUM_RECORDS).clip(0, 5000),
        "course_cost": np.random.choice([0, 2000, 5000, 10000, 25000, 50000], NUM_RECORDS),
        "purchase_cost": np.random.exponential(8000, NUM_RECORDS).clip(500, 150000),
        "purchase_category": np.random.choice(["Gadgets", "Course", "Certification", "Subscription", "Lifestyle", "Travel"], NUM_RECORDS),
        "risk_tolerance": np.random.randint(1, 6, NUM_RECORDS),
        "financial_dependents": np.random.choice([0, 1, 2], NUM_RECORDS, p=[0.9, 0.08, 0.02]),
        "past_purchase_count": np.random.poisson(5, NUM_RECORDS)
    }

    df = pd.DataFrame(data)
    
    # Derived features
    df["monthly_income"] = df["monthly_allowance"] + df["internship_income"]
    df["monthly_expenses"] = df["fixed_expenses"] + df["variable_expenses"] + df["subscription_cost"]
    
    # Ensuring income >= expenses generally, but with some exceptions
    df["monthly_expenses"] = np.minimum(df["monthly_expenses"], df["monthly_income"] * np.random.uniform(0.6, 1.2, NUM_RECORDS))
    
    # monthly savings rate
    df["monthly_savings_rate"] = ((df["monthly_income"] - df["monthly_expenses"]) / df["monthly_income"]).clip(0, 1)
    
    # Target 1: Financial Health Score
    health_base = (df["monthly_savings_rate"] * 40) + \
                  ((df["current_savings"] + df["emergency_fund"]) / (df["monthly_expenses"] * 3).clip(1) * 30).clip(0, 30) + \
                  (df["risk_tolerance"] * 2) + \
                  np.random.normal(10, 5, NUM_RECORDS)
    df["financial_health_score"] = health_base.clip(0, 100)

    # Target 2: Purchase Risk (0: Low, 1: Medium, 2: High, 3: Critical)
    risk_ratio = df["purchase_cost"] / (df["current_savings"] + 1)
    conditions = [
        (risk_ratio > 0.8) | (df["purchase_cost"] > df["monthly_income"] * 3),
        (risk_ratio > 0.4) | (df["purchase_cost"] > df["monthly_income"] * 1.5),
        (risk_ratio > 0.1) | (df["purchase_cost"] > df["monthly_income"] * 0.5)
    ]
    choices = [3, 2, 1]
    df["purchase_risk_class"] = np.select(conditions, choices, default=0)

    # Target 3: Goal Delay (months)
    monthly_savings = (df["monthly_income"] - df["monthly_expenses"]).clip(100) # prevent div by 0
    df["predicted_delay_months"] = (df["purchase_cost"] / monthly_savings) + np.random.normal(1, 0.5, NUM_RECORDS).clip(0)
    df["predicted_delay_months"] = df["predicted_delay_months"].round(1)

    # Target 4: Course Affordability Score
    affordability = 100 - (df["course_cost"] / (df["current_savings"] + df["monthly_income"] + 1) * 100).clip(0, 100)
    df["affordability_score"] = affordability + np.random.normal(0, 5, NUM_RECORDS)
    df["affordability_score"] = df["affordability_score"].clip(0, 100)

    # Target 5: Subscription Burden Score
    burden = (df["subscription_cost"] / df["monthly_income"].clip(1)) * 500 # scales up burden
    df["burden_score"] = burden + np.random.normal(0, 5, NUM_RECORDS)
    df["burden_score"] = df["burden_score"].clip(0, 100)

    df.to_csv(OUTPUT_FILE, index=False)
    logger.info(f"Dataset generated and saved to {OUTPUT_FILE}")

if __name__ == "__main__":
    generate_dataset()
