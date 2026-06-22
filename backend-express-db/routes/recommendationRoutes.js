const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const { getRecommendation } = require("../controllers/recommendationController");

router.post("/", auth, getRecommendation);

// router.post("/", (req, res) => {
//     res.json({
//         success: true,
//         message: "Profile route working"
//     });
// });

module.exports = router;