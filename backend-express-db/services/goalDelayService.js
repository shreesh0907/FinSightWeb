const toNumber = (value, fallback = 0) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

function calculateGoalDelay({
  goalAmount,
  currentSavings,
  monthlySavings,
  purchaseCost,
}) {
  const goal = toNumber(goalAmount);
  const savings = toNumber(currentSavings);
  const monthly = toNumber(monthlySavings);
  const cost = toNumber(purchaseCost);

  if (goal <= 0) {
    throw new Error("Goal amount must be greater than 0");
  }

  if (monthly <= 0) {
    throw new Error("Monthly savings must be greater than 0");
  }

  const remainingBefore = Math.max(0, goal - savings);
  const savingsAfterPurchase = Math.max(0, savings - cost);
  const remainingAfter = Math.max(0, goal - savingsAfterPurchase);

  const withoutPurchaseMonths = Math.ceil(remainingBefore / monthly);
  const afterPurchaseMonths = Math.ceil(remainingAfter / monthly);
  const delayMonths = Math.max(0, afterPurchaseMonths - withoutPurchaseMonths);

  return {
    withoutPurchaseMonths,
    afterPurchaseMonths,
    delayMonths,
    savingsAfterPurchase,
  };
}

module.exports = {
  calculateGoalDelay,
};