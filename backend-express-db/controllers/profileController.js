const supabase = require("../config/supabase");

exports.createProfile = async (req, res) => {
  try {
    const {
      collegeYear,
      monthlyIncome,
      currentSavings,
      monthlyExpenses,
      financialGoals = [],
    } = req.body;

    const userId = req.user.id;

    if (
      !collegeYear ||
      monthlyIncome === undefined ||
      currentSavings === undefined ||
      monthlyExpenses === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "collegeYear, monthlyIncome, currentSavings and monthlyExpenses are required",
      });
    }

    const income = Number(monthlyIncome);
    const savings = Number(currentSavings);
    const expenses = Number(monthlyExpenses);

    if (income < 0 || savings < 0 || expenses < 0) {
      return res.status(400).json({
        success: false,
        message: "Financial values cannot be negative",
      });
    }

    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (existingProfile) {
      return res.status(409).json({
        success: false,
        message: "Profile already exists for this user",
      });
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .insert([
        {
          user_id: userId,
          college_year: collegeYear,
          monthly_income: income,
          current_savings: savings,
          monthly_expenses: expenses,
        },
      ])
      .select("*")
      .single();

    if (profileError) {
      return res.status(400).json({
        success: false,
        message: profileError.message,
      });
    }

    let insertedGoals = [];

    if (Array.isArray(financialGoals) && financialGoals.length > 0) {
      const goals = financialGoals.map((goal) => ({
        user_id: userId,
        name: goal.name,
        target_amount: Number(goal.targetAmount),
        current_amount: Number(goal.currentAmount || 0),
        monthly_saving: Number(goal.monthlySaving || 0),
      }));

      const { data: goalData, error: goalError } = await supabase
        .from("goals")
        .insert(goals)
        .select("*");

      if (goalError) {
        return res.status(400).json({
          success: false,
          message: goalError.message,
        });
      }

      insertedGoals = goalData;
    }

    return res.status(201).json({
      success: true,
      message: "Profile created successfully",
      data: {
        profile,
        goals: insertedGoals,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while creating profile",
      error: error.message,
    });
  }
};