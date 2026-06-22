const supabase = require("../config/supabase");

const calculateHealthScore = (profile) => {
  const income = Number(profile.monthly_income || 0);
  const expenses = Number(profile.monthly_expenses || 0);
  const savings = Number(profile.current_savings || 0);

  let score = 50;

  if (income > 0) {
    const savingsRate = ((income - expenses) / income) * 100;

    if (savingsRate >= 40) score += 25;
    else if (savingsRate >= 20) score += 15;
    else if (savingsRate >= 5) score += 5;
    else score -= 10;
  }

  if (expenses > 0) {
    const emergencyMonths = savings / expenses;

    if (emergencyMonths >= 6) score += 25;
    else if (emergencyMonths >= 3) score += 15;
    else if (emergencyMonths >= 1) score += 5;
    else score -= 15;
  }

  if (expenses > income) score -= 20;

  return Math.max(0, Math.min(100, Math.round(score)));
};

const getRiskLevel = (score) => {
  if (score >= 75) return "Low";
  if (score >= 45) return "Medium";
  return "High";
};

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (profileError) {
      return res.status(400).json({
        success: false,
        message: profileError.message,
      });
    }

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found. Please create your profile first.",
      });
    }

    const { data: goals, error: goalsError } = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", userId);

    if (goalsError) {
      return res.status(400).json({
        success: false,
        message: goalsError.message,
      });
    }

    const healthScore = calculateHealthScore(profile);
    const riskLevel = getRiskLevel(healthScore);

    const totalGoalAmount = goals.reduce(
      (sum, goal) => sum + Number(goal.target_amount || 0),
      0
    );

    const totalGoalSaved = goals.reduce(
      (sum, goal) => sum + Number(goal.current_amount || 0),
      0
    );

    return res.status(200).json({
      success: true,
      data: {
        userId,
        healthScore,
        riskLevel,
        currentSavings: Number(profile.current_savings || 0),
        monthlyIncome: Number(profile.monthly_income || 0),
        monthlyExpenses: Number(profile.monthly_expenses || 0),
        activeGoals: goals.length,
        totalGoalAmount,
        totalGoalSaved,
        goals,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while fetching dashboard",
      error: error.message,
    });
  }
};