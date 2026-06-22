const AI_BACKEND_URL = process.env.AI_BACKEND_URL || "http://localhost:8000";

const safeNumber = (value, fallback = 0) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const callAI = async (endpoint, payload) => {
  const response = await fetch(`${AI_BACKEND_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || data.message || "AI backend request failed");
  }

  return data;
};

exports.simulatePurchase = async (req, res) => {
  try {
    const {
      itemName,
      cost,
      category,
      goalId,
      currentSavings,
      monthlyAllowance,
      monthlyExpenses,
      emergencyFund,
      goalAmount,
    } = req.body;

    if (
      !itemName ||
      cost === undefined ||
      currentSavings === undefined ||
      monthlyAllowance === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "itemName, cost, currentSavings and monthlyAllowance are required",
      });
    }

    const purchaseCost = safeNumber(cost);
    const savings = safeNumber(currentSavings);
    const income = safeNumber(monthlyAllowance);
    const expenses = safeNumber(monthlyExpenses, income * 0.6);
    const emergency = safeNumber(emergencyFund, 30000);
    const goal = safeNumber(goalAmount, 150000);

    if (purchaseCost <= 0 || savings < 0 || income <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid financial input values",
      });
    }

    const afterSavings = Math.max(0, savings - purchaseCost);

    const riskPayload = {
      purchase_cost: purchaseCost,
      monthly_income: income,
      current_savings: savings,
      goal_amount: goal,
      emergency_fund: emergency,
      monthly_expenses: expenses,
    };

    const healthPayload = {
      monthly_income: income,
      monthly_expenses: expenses,
      current_savings: afterSavings,
      emergency_fund: emergency,
      goal_amount: goal,
      subscription_cost: 0,
      monthly_savings_rate: income > 0 ? Math.max(0, (income - expenses) / income) : 0,
      risk_tolerance: 3,
    };

    const delayPayload = {
      goal_amount: goal,
      current_savings: savings,
      monthly_income: income,
      monthly_expenses: expenses,
      purchase_cost: purchaseCost,
      goal_priority: 3,
    };

    const [riskData, healthData, delayData] = await Promise.all([
      callAI("/api/v1/purchase-risk", riskPayload),
      callAI("/api/v1/health-score", healthPayload),
      callAI("/api/v1/goal-delay", delayPayload),
    ]);

    const emergencyFundBefore =
      expenses > 0 ? Number((savings / expenses).toFixed(1)) : 0;

    const emergencyFundAfter =
      expenses > 0 ? Number((afterSavings / expenses).toFixed(1)) : 0;

    const savingsReductionPercent =
      savings > 0 ? Number(((purchaseCost / savings) * 100).toFixed(1)) : 100;

    const healthScoreAfter =
      healthData.health_score ||
      healthData.predicted_health_score ||
      healthData.score ||
      60;

    const riskLevel =
      riskData.risk ||
      riskData.risk_level ||
      riskData.predicted_risk ||
      "Medium";

    const goalDelayMonths =
      delayData.predicted_delay_months ||
      delayData.delay_months ||
      delayData.goal_delay ||
      0;

    return res.status(200).json({
      success: true,
      data: {
        itemName,
        category: category || null,
        goalId: goalId || null,
        healthScoreBefore: 78,
        healthScoreAfter,
        beforeSavings: savings,
        afterSavings,
        savingsReductionPercent,
        emergencyFundBefore,
        emergencyFundAfter,
        goalDelayMonths,
        riskLevel,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error running simulation",
      error: error.message,
    });
  }
};