const toNumber = (value, fallback = 0) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

function calculateAIScore(data) {
  const cost = toNumber(data.cost);
  const currentSavings = toNumber(data.currentSavings);
  const goalDelayMonths = toNumber(data.goalDelayMonths);
  const healthScore = toNumber(data.healthScore);
  const riskLevel = data.riskLevel || "Medium";

  let score = 100;

  if (currentSavings <= 0) return 0;

  const savingsImpact = (cost / currentSavings) * 100;

  if (savingsImpact > 80) score -= 40;
  else if (savingsImpact > 50) score -= 25;
  else if (savingsImpact > 25) score -= 15;
  else score -= 5;

  if (goalDelayMonths > 12) score -= 30;
  else if (goalDelayMonths > 6) score -= 20;
  else if (goalDelayMonths > 3) score -= 10;

  if (riskLevel === "High") score -= 30;
  else if (riskLevel === "Medium") score -= 15;

  if (healthScore < 40) score -= 25;
  else if (healthScore < 60) score -= 15;
  else if (healthScore < 75) score -= 5;

  return Math.max(0, Math.min(100, Math.round(score)));
}

function getDecision(score) {
  if (score >= 70) return "YOU CAN BUY";
  if (score >= 40) return "WAIT";
  return "DO NOT BUY";
}

module.exports = {
  calculateAIScore,
  getDecision,
};