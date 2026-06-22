from fastapi import APIRouter, HTTPException, Depends
from loguru import logger

from app.schemas.requests import (
    HealthScoreRequest, PurchaseRiskRequest, GoalDelayRequest,
    CourseAffordabilityRequest, SubscriptionBurdenRequest, ExplainRequest,
    RecommendationRequest
)
from app.schemas.responses import (
    HealthScoreResponse, PurchaseRiskResponse, GoalDelayResponse,
    CourseAffordabilityResponse, SubscriptionBurdenResponse, ExplainResponse,
    RecommendationResponse
)
from app.services.model_loader import ModelLoader
from app.services.recommendation_service import RecommendationService
from app.explainability.shap_explainer import ShapExplainer
import pandas as pd
import numpy as np

router = APIRouter()

def get_model_loader():
    return ModelLoader.get_instance()

def get_shap_explainer():
    return ShapExplainer(ModelLoader.get_instance())

@router.post("/health-score", response_model=HealthScoreResponse)
async def predict_health_score(request: HealthScoreRequest, loader: ModelLoader = Depends(get_model_loader)):
    try:
        model, pipeline = loader.get_model("financial_health")
        df = pd.DataFrame([request.model_dump()])
        if pipeline:
            df = pipeline.transform(df)
        pred = model.predict(df)[0]
        # Calculate pseudo-confidence based on distribution bounds or variance if possible.
        # For XGBoost regressor, we'll return a fixed high confidence for this demo.
        return HealthScoreResponse(health_score=round(float(pred), 2), confidence=0.91)
    except Exception as e:
        logger.error(f"Error in /health-score: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/purchase-risk", response_model=PurchaseRiskResponse)
async def predict_purchase_risk(request: PurchaseRiskRequest, loader: ModelLoader = Depends(get_model_loader)):
    try:
        model, pipeline = loader.get_model("purchase_risk")
        df = pd.DataFrame([request.model_dump()])
        if pipeline:
            df = pipeline.transform(df)
        pred_idx = model.predict(df)[0]
        probs = model.predict_proba(df)[0]
        
        # Output Classes: Low, Medium, High, Critical
        class_mapping = {0: "Low", 1: "Medium", 2: "High", 3: "Critical"}
        risk = class_mapping.get(int(pred_idx), "Unknown")
        confidence = float(np.max(probs))
        
        return PurchaseRiskResponse(risk=risk, confidence=round(confidence, 2))
    except Exception as e:
        logger.error(f"Error in /purchase-risk: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/goal-delay", response_model=GoalDelayResponse)
async def predict_goal_delay(request: GoalDelayRequest, loader: ModelLoader = Depends(get_model_loader)):
    try:
        model, pipeline = loader.get_model("goal_delay")
        df = pd.DataFrame([request.model_dump()])
        if pipeline:
            df = pipeline.transform(df)
        pred = model.predict(df)[0]
        return GoalDelayResponse(predicted_delay_months=round(float(pred), 2))
    except Exception as e:
        logger.error(f"Error in /goal-delay: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/course-affordability", response_model=CourseAffordabilityResponse)
async def predict_course_affordability(request: CourseAffordabilityRequest, loader: ModelLoader = Depends(get_model_loader)):
    try:
        model, pipeline = loader.get_model("course_affordability")
        df = pd.DataFrame([request.model_dump()])
        if pipeline:
            df = pipeline.transform(df)
        pred = model.predict(df)[0]
        return CourseAffordabilityResponse(affordability_score=round(float(pred), 2))
    except Exception as e:
        logger.error(f"Error in /course-affordability: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/subscription-burden", response_model=SubscriptionBurdenResponse)
async def predict_subscription_burden(request: SubscriptionBurdenRequest, loader: ModelLoader = Depends(get_model_loader)):
    try:
        model, pipeline = loader.get_model("subscription_burden")
        df = pd.DataFrame([request.model_dump()])
        if pipeline:
            df = pipeline.transform(df)
        pred = model.predict(df)[0]
        return SubscriptionBurdenResponse(burden_score=round(float(pred), 2))
    except Exception as e:
        logger.error(f"Error in /subscription-burden: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/explain", response_model=ExplainResponse)
async def explain_prediction(request: ExplainRequest, explainer: ShapExplainer = Depends(get_shap_explainer)):
    try:
        result = explainer.explain(request.model, request.features)
        return ExplainResponse(**result)
    except Exception as e:
        logger.error(f"Error in /explain: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/recommend", response_model=RecommendationResponse)
async def get_recommendations(request: RecommendationRequest):
    try:
        rec = RecommendationService.generate_recommendation(
            health_score=request.health_score,
            purchase_risk=request.purchase_risk,
            goal_delay=request.goal_delay,
            burden_score=request.burden_score,
            affordability_score=request.affordability_score
        )
        return RecommendationResponse(**rec)
    except Exception as e:
        logger.error(f"Error in /recommend: {e}")
        raise HTTPException(status_code=500, detail=str(e))
