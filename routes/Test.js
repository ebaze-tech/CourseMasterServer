const express = require("express");
const Question = require("../models/Question");
const Test = require("../models/Test");
const { protect, isAdmin } = require("./Authentication");
const router = express.Router();

// Get categories
// Routes accessible to authenticated users.
router.get("/categories", protect, (req, res) => {
  const categories = [
    "React.js",
    "PHP",
    "Python",
    "C++",
    "Java",
    "HTML",
    "AWS",
    "Google Cloud",
  ];
  res.json(categories);
});

// Get questions for a specific category
// Routes accessible to authenticated users.
router.get("/questions/:category", protect, async (req, res) => {
  const category = req.params.category;
  console.log("Category received:", category);
  try {
    const questions = await Question.aggregate([
      { $match: { category } },
      { $sample: { size: 40 } }, // Sample 40 random questions
    ]);
    console.log("Questions found:", questions);
    res.json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Error fetching questions", error });
  }
});

// Submit the test
// Routes accessible to authenticated users.

// Submit the test
// Routes accessible to authenticated users.
// Submitting the test
router.post("/submit", protect, async (req, res) => {
  const { category, answers } = req.body;
  const userId = req.user.id;

  try {
    const enhancedAnswers = await Promise.all(
      answers.map(async (answer) => {
        const question = await Question.findById(answer.questionId);

        if (!question) {
          throw new Error(`Question with ID ${answer.questionId} not found.`);
        }

        const isCorrect = answer.answer === question.correctAnswer;

        return {
          questionId: answer.questionId,
          answer: answer.answer,
          correctAnswer: question.correctAnswer,
          isCorrect,
          category: question.category,
        };
      })
    );

    // Calculate score
    const score = enhancedAnswers.filter((a) => a.isCorrect).length;

    const test = new Test({
      userId,
      category,
      answers: enhancedAnswers,
      score, // Save the score
    });

    await test.save();
    res.status(201).json({ message: "Test submitted successfully", score });
  } catch (error) {
    console.error("Error submitting test:", error);
    res
      .status(500)
      .json({ message: "Error submitting test", error: error.message });
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
// Get a specific test by ID
router.get("/submitted/:id", protect, isAdmin, async (req, res) => {
  try {
    const test = await Test.findById(req.params.id)
      .populate("userId", "username email")
      .populate({
        path: "answers.questionId",
        select: "questionText category correctAnswer", // Include fields relevant to display
      });

    if (!test) return res.status(404).json({ message: "Test not found" });
    res.json(test);
  } catch (error) {
    console.error("Error retrieving test:", error);
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
