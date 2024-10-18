const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const { router: authRoutes } = require("./routes/Authentication");
const testRoutes = require("./routes/Test");
const adminRoutes = require("./routes/Admin");
const userDashboardRoutes = require("./routes/UserDashboard");
const fetchUserRoutes = require("./routes/FetchUser");
const testSchedule = require("./routes/TestSchedule");
const dotenv = require("dotenv");
mongoose.set("strictPopulate", false);

// const seed = require("./seed");
dotenv.config();

// Middleware to parse JSON request bodies
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      // "http://localhost:5174",
      "https://coursemaster.vercel.app",
      "https://coursemasteradmin.vercel.app",
      "https://coursemasterserver.onrender.com",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(bodyParser.json());

// Connect to MongoDB database. This will throw an error if the connection fails.
mongoose
  .connect(process.env.DB_URI, {
    serverSelectionTimeoutMS: 30000, // 30 seconds
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection failed", err));

app.use("/auth", authRoutes); //User authentication routes
app.use("/test", testRoutes); // Test routes
app.use("/admin", adminRoutes);
app.use("/dashboard/user", userDashboardRoutes);
app.use("/userdetail", fetchUserRoutes);
app.use("/schedule", testSchedule);
// app.use(seed);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.get("/current-datetime", (req, res) => {
  try {
    const utcDate = new Date();
    const watDate = new Date(utcDate.getTime() + 1 * 60 * 60 * 1000); // Adjusting for WAT

    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = watDate.toLocaleDateString(undefined, options);

    const option = { month: "long", year: "numeric" };
    const formattedMonth = watDate.toLocaleDateString(undefined, option);
    res.json({ formattedDate, formattedMonth }); // Return formatted date
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Couldn't fetch date." });
  }
});

// Test route to check server status.
app.get("/", (req, res) => {
  console.log("Server running.");
  res.status(200).send("SERVER RUNNING.");
});
