class RecommendationService:
    
    @staticmethod
    def generate_recommendation(health_score: float, purchase_risk: str, goal_delay: float, burden_score: float, affordability_score: float) -> dict:
        category = "WAIT"
        message = "Consider delaying this purchase."

        if purchase_risk == "Critical" or health_score < 30:
            category = "CRITICAL_RISK"
            message = "This purchase is highly discouraged. It severely impacts your financial health."
        elif purchase_risk == "High" or burden_score > 75:
            category = "HIGH_RISK"
            message = "High risk purchase. It significantly burdens your monthly budget and limits flexibility."
        elif goal_delay > 12:
            category = "SAVE_MORE"
            message = f"This delays your goal by {round(goal_delay)} months. Try saving more before buying."
        elif purchase_risk == "Medium" and affordability_score < 50:
            category = "CHEAPER_ALTERNATIVE"
            message = "Consider finding a cheaper alternative to keep your goals on track."
        elif purchase_risk == "Low" and health_score > 70 and affordability_score > 70:
            category = "BUY_NOW"
            message = "You are in good financial standing to make this purchase."
        elif purchase_risk == "Low":
            category = "LOW_RISK"
            message = "This purchase has minimal impact on your financial health."

        return {
            "category": category,
            "message": message
        }
