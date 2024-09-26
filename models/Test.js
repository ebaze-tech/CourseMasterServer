const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  answer: { type: String, required: true }, // User's answer
  correctAnswer: { type: String }, // Correct answer from the database
  isCorrect: { type: Boolean }, // Mark if the answer is correct or not
  category: { type: String, required: true },
});

const testSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, required: true },
  answers: [answerSchema],
  score: { type: Number, default: 0 }, // Add a field to store the score
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Test", testSchema);
