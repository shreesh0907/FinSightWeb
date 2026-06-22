from pydantic import BaseModel, Field
from typing import Dict, Any

class HealthScoreRequest(BaseModel):
    monthly_income: float = Field(..., ge=0)
    monthly_expenses: float = Field(..., ge=0)
    current_savings: float = Field(..., ge=0)
    emergency_fund: float = Field(..., ge=0)
    goal_amount: float = Field(..., ge=0)
    subscription_cost: float = Field(..., ge=0)
    monthly_savings_rate: float = Field(..., ge=0, le=1)
    risk_tolerance: int = Field(..., ge=1, le=5)

class PurchaseRiskRequest(BaseModel):
    purchase_cost: float = Field(..., ge=0)
    monthly_income: float = Field(..., ge=0)
    current_savings: float = Field(..., ge=0)
    goal_amount: float = Field(..., ge=0)
    emergency_fund: float = Field(..., ge=0)
    monthly_expenses: float = Field(..., ge=0)

class GoalDelayRequest(BaseModel):
    goal_amount: float = Field(..., ge=0)
    current_savings: float = Field(..., ge=0)
    monthly_income: float = Field(..., ge=0)
    monthly_expenses: float = Field(..., ge=0)
    purchase_cost: float = Field(..., ge=0)
    goal_priority: int = Field(..., ge=1, le=5)

class CourseAffordabilityRequest(BaseModel):
    course_cost: float = Field(..., ge=0)
    monthly_income: float = Field(..., ge=0)
    current_savings: float = Field(..., ge=0)
    monthly_expenses: float = Field(..., ge=0)
    goal_amount: float = Field(..., ge=0)

class SubscriptionBurdenRequest(BaseModel):
    subscription_cost: float = Field(..., ge=0)
    monthly_income: float = Field(..., ge=0)
    monthly_expenses: float = Field(..., ge=0)
    current_savings: float = Field(..., ge=0)

class ExplainRequest(BaseModel):
    model: str = Field(..., description="Name of the model (e.g., 'purchase_risk')")
    features: Dict[str, float] = Field(..., description="Feature values to explain")

class RecommendationRequest(BaseModel):
    health_score: float = Field(..., ge=0, le=100)
    purchase_risk: str = Field(..., description="Low, Medium, High, or Critical")
    goal_delay: float = Field(..., ge=0)
    burden_score: float = Field(..., ge=0, le=100)
    affordability_score: float = Field(..., ge=0, le=100)
