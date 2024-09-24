const express = require("express");
const router = express.Router();
const Test = require("../models/Test"); // Assuming you have a Test model

// Middleware for authentication
const { protect, isAdmin } = require("../routes/Auth");

// Get all scores
router.get("/scores", protect, isAdmin, async (req, res) => {
  try {
    const tests = await Test.find().populate("userId", "username email");
    res.json(tests);
  } catch (error) {
    console.error("Error retrieving scores:", error);
    res
      .status(500)
      .json({ message: "Error retrieving scores", error: error.message });
  }
});

// Get top 10 scores
router.get("/top10", protect, isAdmin, async (req, res) => {
  try {
    const topScores = await Test.find()
      .sort({ score: -1 })
      .limit(10)
      .populate("userId", "username email");
    res.json(topScores);
  } catch (error) {
    console.error("Error retrieving top scores:", error);
    res
      .status(500)
      .json({ message: "Error retrieving top scores", error: error.message });
  }
});

// Get pie chart data
router.get("/pieData", protect, isAdmin, async (req, res) => {
  try {
    // Assuming you have a way to aggregate results by category or similar
    // Adjust the aggregation based on your data structure
    const resultCounts = await Test.aggregate([
      { $unwind: "$answers" },
      { $group: { _id: "$answers.category", count: { $sum: 1 } } },
    ]);

    const labels = resultCounts.map((item) => item._id);
    const values = resultCounts.map((item) => item.count);

    res.json({ labels, values });
  } catch (error) {
    console.error("Error retrieving pie chart data:", error);
    res
      .status(500)
      .json({
        message: "Error retrieving pie chart data",
        error: error.message,
      });
  }
});

module.exports = router;
