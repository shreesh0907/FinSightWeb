const toNumber = (value, fallback = 0) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

function calculateHealthScore({ savings, income, expenses }) {
  const currentSavings = toNumber(savings);
  const monthlyIncome = toNumber(income);
  const monthlyExpenses = toNumber(expenses);

  let score = 50;

  if (monthlyIncome > 0) {
    const savingsRate =
      ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100;

    if (savingsRate >= 40) score += 25;
    else if (savingsRate >= 20) score += 15;
    else if (savingsRate >= 5) score += 5;
    else score -= 10;
  }

  if (monthlyExpenses > 0) {
    const emergencyMonths = currentSavings / monthlyExpenses;

    if (emergencyMonths >= 6) score += 25;
    else if (emergencyMonths >= 3) score += 15;
    else if (emergencyMonths >= 1) score += 5;
    else score -= 15;
  }

  if (monthlyExpenses > monthlyIncome) {
    score -= 20;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

module.exports = {
  calculateHealthScore,
};