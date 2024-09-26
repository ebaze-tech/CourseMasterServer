const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const { router: authRoutes } = require("./routes/auth");
const testRoutes = require("./routes/Test");
const adminRoutes = require("./routes/Admin");
const dotenv = require("dotenv");
// const seed = require("./seed");
dotenv.config();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://coursemasterserver.onrender.com",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(bodyParser.json());

mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // 30 seconds
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection failed", err));

app.use("/auth", authRoutes); //User authentication routes
app.use("/test", testRoutes); // Test routes
app.use("/admin", adminRoutes);
// app.use(seed);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.get("/", (req, res) => {
  console.log("Server running.");
  res.status(200).send("SERVER RUNNING.");
});
