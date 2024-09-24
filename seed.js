const mongoose = require("mongoose");
const Question = require("./models/Question");
const dotenv = require("dotenv");

dotenv.config();
mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection failed", err));

const questions = [
  {
    category: "React.js",
    questionText: "What is JSX in React?",
    answers: ["A JavaScript extension", "A CSS framework", "A Python library"],
    correctAnswer: "A JavaScript extension",
  },
  {
    category: "PHP",
    questionText: "What is PHP used for?",
    answers: [
      "Frontend development",
      "Backend development",
      "Mobile development",
    ],
    correctAnswer: "Backend development",
  },
];

async function seedQuestions() {
  await Question.insertMany(questions);
  console.log("Questions seeded");
  mongoose.disconnect();
}
mongoose.tests.find({userId: "66f2483afb8f48157451d7b4"})
seedQuestions();
