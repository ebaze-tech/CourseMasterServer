const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TestSchedule",
    required: true,
  },
  reminderTime: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Reminder = mongoose.model("Reminder", reminderSchema);

module.exports = Reminder;
