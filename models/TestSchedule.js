const mongoose = require("mongoose");

const testSchedule = new mongoose.Schema({
  course: { type: String, required: true },
  lecturerName: { type: String, required: true },
  time: { type: String, required: true },
  duration: { type: String, required: true },
  description: { type: String, required: true },
});

module.exports = mongoose.model("TestSchedule", testSchedule);
