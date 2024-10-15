const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const { router: authRoutes } = require("./routes/Authentication");
const testRoutes = require("./routes/Test");
const adminRoutes = require("./routes/Admin");
const userDashboardRoutes = require("./routes/UserDashboard");
const fetchUserRoutes = require("./routes/FetchUser.js");
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
app.use("/fetchuser/:id", fetchUserRoutes);
// app.use(seed);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.get("/current-datetime", (req, res) => {
  //  Get current UTC date and time
  const utcDate = new Date();

  //Convert UTC date and time to local time zone
  const watDate = new Date(utcDate.getTime() + 1 * 60 * 60 * 1000);

  // Get date components
  const year = watDate.getFullYear();
  const month = watDate.getMonth();
  const day = watDate.getDate();

  // Array of month names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Get month in words
  const months = monthNames[month];

  // Format date string
  const formattedDate = `${months} ${day} ${year}`;
  res.json({ datetime: formattedDate });
});

// Test route to check server status.
app.get("/", (req, res) => {
  console.log("Server running.");
  res.status(200).send("SERVER RUNNING.");
});
