const express = require("express");
const router = express.Router();
const moment = require("moment");
const TestSchedule = require("../models/TestSchedule");
const ReminderModel = require("../models/Reminder");
const { protect, isAdmin } = require("./Authentication");

const nodemailer = require("nodemailer");
// const sgMail = require("@sendgrid/mail");

// Route to create a test schedule
router.post("/testschedule/create", protect, isAdmin, async (req, res) => {
  try {
    const { course, lecturerName, description, time, duration } = req.body;
    console.log(req.body);
    let schedule = await TestSchedule.findOne({
      course,
      lecturerName,
      description,
      time,
      duration,
    });

    if (schedule) {
      // update existing schedule
      schedule.course = course;
      schedule.lecturerName = lecturerName;
      schedule.description = description;
      schedule.time = time;
      schedule.duration = duration;
    } else {
      // Create new schedule
      schedule = new TestSchedule({
        course,
        lecturerName,
        time,
        duration,
        description,
      });
    }
    await schedule.save();
    res
      .status(200)
      .json({ message: "Test schedule saved successfully.", schedule });
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(400).json({
        message: "Validation failed",
        error: error.message,
      });
    }
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Route to view a test schedule
router.get("/admin/testschedule", protect, async (req, res) => {
  try {
    const schedules = await TestSchedule.find({});
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: "Error fetching test schedules", error });
  }
});
router.get("/user/testschedule", protect, isAdmin, async (req, res) => {
  try {
    const schedules = await TestSchedule.find({});
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: "Error fetching test schedules", error });
  }
});

// Route to find or view previous test schedules by day,week or month
router.get("/previous", protect, async (req, res) => {
  try {
    const { view, month, week, day } = req.query;
    let startDate, endDate;

    if (view === "month" && month) {
      // Search by month
      startDate = moment(month, "YYYY-MM").startOf("month").toDate();
      endDate = moment(month, "YYYY-MM").endOf("moth").toDate();
    } else if (view === "week" && week) {
      // Search by week
      startDate = moment(week, "YYYY-[W]WW").startOf("isoWeek").toDate();
      endDate = moment(week, "YYYY-[W]WW").endOf("isoWeek").toDate();
    } else if (view === "day" && day) {
      // Search by day
      startDate = moment(day, "YYYY-MM-DD").startOf("day").toDate();
      endDate = moment(day, "YYYY-MM-DD").endOf("day").toDate();
    } else {
      return res.status(400).json({
        message:
          "Please provide a valid view with corresponding day,week or month.",
      });
    }

    // Find schedules within the specifies range
    const schedules = await TestSchedule.find({
      date: { $gte: startDate, $lte: endDate },
    });

    res.status(200).json(schedules);
  } catch (error) {
    console.error(error);
    res.status(200).json({ messahe: "Server error: ", error: error.message });
  }
});

// Route to get detailed info about a specific test by its ID
router.get("/user/testschedule/:id", protect, async (req, res) => {
  try {
    const schedule = await TestSchedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({ message: "Test not found." });
    }

    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({ messagE: "Server error: ", error: error.message });
  }
});

const transporter = nodemailer.createTransport({
  service: "gmail", // Or your email service provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Route to set reminder for a specific test
router.post("/user/testschedule/reminder", protect, async (req, res) => {
  try {
    const { testId, reminderTime } = req.body;

    // Find the test schedule by ID
    const schedule = await TestSchedule.findById(testId);
    if (!schedule) {
      return res.status(404).json({ message: "Test not found." });
    }

    // Validate that the reminder time is before the test schedule time
    if (new Date(reminderTime) >= new Date(schedule.date)) {
      return res
        .status(400)
        .json({ message: "Reminder time must be before the test start time." });
    }

    // Save the reminder to the database
    const newReminder = new Reminder({
      user: req.user.id, // Assuming the "protect" middleware adds the authenticated user
      testId: schedule._id,
      reminderTime,
    });

    await newReminder.save();

    // Schedule the email reminder using cron
    scheduleReminderNotification(req.user.email, reminderTime, schedule);

    res
      .status(200)
      .json({ message: "Reminder set successfully.", testId, reminderTime });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});

// Helper function to schedule a reminder notification
const scheduleReminderNotification = (
  userEmail,
  reminderTime,
  testSchedule
) => {
  const reminderDate = new Date(reminderTime);

  // Cron syntax: minute, hour, day of month, month, day of week
  const cronExpression = `${reminderDate.getMinutes()} ${reminderDate.getHours()} ${reminderDate.getDate()} ${
    reminderDate.getMonth() + 1
  } *`;

  cron.schedule(cronExpression, () => {
    sendReminderEmail(userEmail, testSchedule);
  });

  console.log(`Reminder scheduled for ${reminderDate}`);
};

// Helper function to send reminder email using Nodemailer
const sendReminderEmail = (userEmail, testSchedule) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender's email
    to: userEmail, // Recipient's email
    subject: `Reminder: Upcoming test for ${testSchedule.testName}`,
    text: `Hello, just a reminder that your test for ${testSchedule.testName} is scheduled for ${testSchedule.date}. Duration: ${testSchedule.duration} minutes.`,
    html: `<p>Hello,</p><p>Just a reminder that your test for <strong>${testSchedule.testName}</strong> is scheduled for <strong>${testSchedule.date}</strong>. The duration of the test is <strong>${testSchedule.duration} minutes</strong>.</p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error("Error sending reminder email:", error);
    }
    console.log("Reminder email sent:", info.response);
  });
};

module.exports = router;
