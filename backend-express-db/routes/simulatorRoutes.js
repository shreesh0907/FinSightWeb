const express = require("express");
const router = express.Router();

const { simulatePurchase } = require("../controllers/simulatorController");

router.post("/", simulatePurchase);

module.exports = router;