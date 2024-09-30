const express = require("express");
const { protect } = require("./Authentication");
const Test = require("../models/Test");
const router = express.Router();

// Get all test results for the logged-in user
router.get("/test/results", protect, async (req, res) => {
  try {
    // Fetch all tests that belong to the logged-in user
    const tests = await Test.find({ userId: req.user.id }).populate(
      "userId",
      "username email"
    );

    res.json(tests);
  } catch (error) {
    console.error("Error retrieving user test results:", error);
    res
      .status(500)
      .json({ message: "Error retrieving test results", error: error.message });
  }
});

// Get detailed result of a specific test
router.get("/test/result/:id", protect, async (req, res) => {
  try {
    const test = await Test.findById(req.params.id)
      .populate("userId", "username email")
      .populate({
        path: "answers.questionId",
        select: "questionText category options correctAnswer",
      });
    if (!test)
      return res
        .status(404)
        .json({ message: "Test not found or unauthorized access." });

    res.json(test);
  } catch (error) {
    console.error("Error retrieving test details:", error);
    res
      .status(500)
      .json({ message: "Error retrieving test details", error: error.message });
  }
});

// Get top 10 test scores for the logged-in user
router.get("/test/top10", protect, async (req, res) => {
  try {
    const topScores = await Test.find({ userId: req.user.id })
      .sort({ totalScore: -1 })
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

// Get pie chart data for the logged-in user
router.get("/test/pieData", protect, async (req, res) => {
  try {
    // Aggregate user-specific results based on question categories
    const resultCounts = await Test.aggregate([
      { $match: { userId: req.user.id } }, // Only include tests of the logged-in user
      { $unwind: "$answers" }, // Unwind answers array
      { $group: { _id: "$answers.category", count: { $sum: 1 } } }, // Group by category and count
    ]);

    // Prepare labels and values for pie chart
    const labels = resultCounts.map((item) => item._id);
    const values = resultCounts.map((item) => item.count);

    res.json({ labels, values });
  } catch (error) {
    console.error("Error retrieving pie chart data:", error);
    res.status(500).json({
      message: "Error retrieving pie chart data",
      error: error.message,
    });
  }
});

module.exports = router;
