const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  category: { type: String, required: true },
  questionText: { type: String, required: true },
  answers: [{ type: String }], //Multiple choice options or theory
  correctAnswer: { type: String },
});

module.exports = mongoose.model("Question", questionSchema);
