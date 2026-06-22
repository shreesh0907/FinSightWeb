from pydantic import BaseModel
from typing import List, Dict, Any

class HealthScoreResponse(BaseModel):
    health_score: float
    confidence: float

class PurchaseRiskResponse(BaseModel):
    risk: str
    confidence: float

class GoalDelayResponse(BaseModel):
    predicted_delay_months: float

class CourseAffordabilityResponse(BaseModel):
    affordability_score: float

class SubscriptionBurdenResponse(BaseModel):
    burden_score: float

class FeatureImpact(BaseModel):
    feature: str
    impact: float

class ExplainResponse(BaseModel):
    prediction: Any
    top_factors: List[FeatureImpact]

class RecommendationResponse(BaseModel):
    category: str
    message: str
