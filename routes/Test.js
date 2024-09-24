const express = require("express");
const Question = require("../models/Question");
const Test = require("../models/Test");
const { protect, isAdmin } = require("../routes/Auth");
const router = express.Router();

// Get categories
// Routes accessible to authenticated users.
router.get("/categories", protect, (req, res) => {
  const categories = ["React.js", "PHP", "Python", "C++", "Java", "HTML","AWS","Google Cloud"];
  res.json(categories);
});

// Get questions for a specific category
// Routes accessible to authenticated users.
router.get("/questions/:category", protect, async (req, res) => {
  const category = req.params.category;
  try {
    const questions = await Question.find({ category });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching questions", error });
  }
});

// Submit the test
// Routes accessible to authenticated users.
router.post("/submit", protect, async (req, res) => {
  const { category, answers } = req.body;
  console.log("Decoded user in /submit:", req.user);
  const userId = req.user.id;
  try {
    const test = new Test({
      userId,
      category,
      answers,
    });

    console.log("Saving Test:", { userId, category, answers });
    await test.save();
    res.status(201).json({ message: "Test submitted successfully" });
  } catch (error) {
    console.error("Error submitting test:", error);
    res.status(500).json({ message: "Error submitting test", error });
  }
});

// Get all tests submitted by a user
// Admin Access Only: Route to retrieve all tests submitted by a specific user
router.get("/submitted", protect, isAdmin, async (req, res) => {
  try {
    const tests = await Test.find().populate("userId", "username email");
    console.log("Retrieved tests:", tests);

    res.json(tests);
  } catch (error) {
    console.error("Error retrieving tests:", error);
    res
      .status(500)
      .json({ message: "Error retrieving tests", error: error.message });
  }
});
router.get("/test-query", async (req, res) => {
  try {
    const tests = await Test.find();
    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: "Error executing test query", error });
  }
});

// Get a specific test by ID
// Admin Access Only: Route to retrieve a specific test by its ID
router.get("/submitted/:id", protect, isAdmin, async (req, res) => {
  try {
    const test = await Test.findById(req.params.id)
      .populate("userId", "username email")
      .populate({
        path: "answers.questionId",
        select: "questionText category answers correctAnswer",
      }); // Assuming Question schema has a questionText field
    if (!test) return res.status(404).json({ message: "Test not found" });
    res.json(test);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error retrieving test", error: error.message });
  }
});

// Get all test scores (admin only)
// Admin Access Only**: Route to retrieve all test scores
router.get("/scores", protect, isAdmin, async (req, res) => {
  try {
    const tests = await Test.find().populate("userId", "username email");
    res.json(tests);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving scores", error: error.message });
  }
});
module.exports = router;
