export const dashboardData = {
  healthScore: 68,
  currentSavings: 120000,
  activeGoals: 3,
  riskLevel: "Medium",
};

export const simulationResult = {
  beforeSavings: 120000,
  afterSavings: 30000,
  savingsReductionPercent: 75,
  emergencyFundBefore: 6,
  emergencyFundAfter: 1.5,
  healthScoreBefore: 82,
  healthScoreAfter: 68,
  riskLevel: "Medium",
  goalDelayMonths: 18,
};

export const recommendationData = {
  decision: "Wait 3 Months",
  summary:
    "This purchase significantly impacts your savings and delays your higher studies goal.",
  recommendations: [
    "Wait 3 months before buying",
    "Save ₹3,000 more per month",
    "Consider a refurbished alternative",
    "Maintain at least 6 months emergency fund",
  ],
};

export const goalDelayData = {
  withoutPurchaseMonths: 14,
  afterPurchaseMonths: 32,
  delayMonths: 18,
};

// --- Chart datasets ---

export const savingsTrend = [
  { month: "Jan", savings: 65000 },
  { month: "Feb", savings: 72000 },
  { month: "Mar", savings: 80000 },
  { month: "Apr", savings: 75000 },
  { month: "May", savings: 95000 },
  { month: "Jun", savings: 120000 },
];

export const spendingBreakdown = [
  { name: "Food", value: 4200, color: "#a855f7" },
  { name: "Transport", value: 1800, color: "#22d3ee" },
  { name: "Education", value: 3500, color: "#6366f1" },
  { name: "Entertainment", value: 2000, color: "#f59e0b" },
  { name: "Utilities", value: 1500, color: "#10b981" },
];

export const healthScoreHistory = [
  { month: "Jan", score: 74 },
  { month: "Feb", score: 78 },
  { month: "Mar", score: 82 },
  { month: "Apr", score: 77 },
  { month: "May", score: 80 },
  { month: "Jun", score: 68 },
];

export const goalProgress = [
  { name: "Higher Studies", target: 150000, saved: 80000 },
  { name: "Emergency Fund", target: 100000, saved: 60000 },
  { name: "Certification", target: 30000, saved: 12000 },
];

export const monthlyAllowanceVsExpense = [
  { month: "Jan", allowance: 15000, expense: 9500 },
  { month: "Feb", allowance: 15000, expense: 11200 },
  { month: "Mar", allowance: 15000, expense: 10800 },
  { month: "Apr", allowance: 15000, expense: 13000 },
  { month: "May", allowance: 15000, expense: 12300 },
  { month: "Jun", allowance: 15000, expense: 13000 },
];