const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const { createProfile } = require("../controllers/profileController");

router.post("/", auth, createProfile);

// router.post("/", (req, res) => {
//     res.json({
//         success: true,
//         message: "Profile route working"
//     });
// });

module.exports = router;