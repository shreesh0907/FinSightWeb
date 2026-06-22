const { calculateAIScore, getDecision } = require("../services/aiService");

exports.getRecommendation = async (req, res) => {
  try {
    const {
      itemName,
      cost,
      currentSavings,
      goalDelayMonths,
      riskLevel,
      healthScore,
      goal,
    } = req.body;

    if (
      !itemName ||
      cost === undefined ||
      currentSavings === undefined ||
      goalDelayMonths === undefined ||
      !riskLevel ||
      healthScore === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "itemName, cost, currentSavings, goalDelayMonths, riskLevel and healthScore are required",
      });
    }

    const numericCost = Number(cost);
    const numericSavings = Number(currentSavings);
    const numericDelay = Number(goalDelayMonths);
    const numericHealthScore = Number(healthScore);

    if (numericCost <= 0 || numericSavings < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid cost or savings value",
      });
    }

    const score = calculateAIScore({
      cost: numericCost,
      currentSavings: numericSavings,
      goalDelayMonths: numericDelay,
      riskLevel,
      healthScore: numericHealthScore,
    });

    const decision = getDecision(score);

    let summary = "";
    const recommendations = [];

    if (decision === "DO NOT BUY") {
      summary = `Buying ${itemName} right now can seriously affect your savings and financial goals.`;
      recommendations.push("Avoid this purchase for now.");
      recommendations.push("Build a stronger emergency fund first.");
      recommendations.push("Look for a cheaper alternative or delay the purchase.");
    } else if (decision === "WAIT") {
      summary = `${itemName} is possible, but waiting would be financially safer.`;
      recommendations.push("Wait for a few months before buying.");
      recommendations.push("Save more so your emergency fund is not affected.");
      recommendations.push("Compare alternatives before making the final decision.");
    } else {
      summary = `Your current financial condition can handle this purchase.`;
      recommendations.push("You can buy it, but keep tracking your monthly savings.");
      recommendations.push("Make sure your financial goals are still on track.");
    }

    return res.status(200).json({
      success: true,
      data: {
        itemName,
        goal: goal || null,
        score,
        decision,
        summary,
        recommendations,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while generating recommendation",
      error: error.message,
    });
  }
};