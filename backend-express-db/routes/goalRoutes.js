const express = require("express");
const router = express.Router();

const { calculateGoalDelay } = require("../services/goalDelayService");

router.post("/delay", (req, res) => {
  try {
    const {
      goalAmount,
      currentSavings,
      monthlySavings,
      purchaseCost,
    } = req.body;

    if (
      goalAmount === undefined ||
      currentSavings === undefined ||
      monthlySavings === undefined ||
      purchaseCost === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "goalAmount, currentSavings, monthlySavings and purchaseCost are required",
      });
    }

    const result = calculateGoalDelay({
      goalAmount: Number(goalAmount),
      currentSavings: Number(currentSavings),
      monthlySavings: Number(monthlySavings),
      purchaseCost: Number(purchaseCost),
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error calculating goal delay",
      error: error.message,
    });
  }
});

module.exports = router;