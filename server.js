const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const { router: authRoutes } = require("./routes/Authentication");
const testRoutes = require("./routes/Test");
const adminRoutes = require("./routes/Admin");
const userDashboardRoutes = require("./routes/UserDashboard");
const fetchUserRoutes = require("./routes/FetchUser");
const testSchedule = require("./routes/TestSchedule");
const dotenv = require("dotenv");
mongoose.set("strictPopulate", false);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(",") || [
      "http://localhost:5173",
      "https://coursemaster.vercel.app",
      "https://coursemasteradmin.vercel.app",
      "https://coursemasterserver.onrender.com",
    ],
  },
});
io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  // Listening to chat messsages from the frontend
  socket.on("sendMessage", (message) => {
    console.log("Message received:", message);
    // Send broadcast message to all clients
    io.emit("newMessage", {
      sender: message.sender,
      avatarUrl: message.avatarUrl,
      text: message.text,
      timestamp: message.timestamp,
    });
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });

  // Listen for typing event
  socket.on("typing", (data) => {
    socket.broadcast.emit("userTyping", { user: data.user });
  });

  // Handle stop typing from client
  socket.on("stopTyping", (data) => {
    socket.broadcast.emit("userTyping", { user: data.user });
  });

  socket.on("joinRoom", ({ username, room }) => {
    socket.join(room);
    console.log(`${username} joined room: ${room}`);
  });

  socket.emit("message", {
    sender: "System",
    text: `Welcome to ${room} room!`,
    timestamp: new Date(),
  });

  // Broadcast to other users in the room
  socket.broadcast.to(room).emit("message", {
    sender: "System",
    text: `${username} joined the room`,
    timestamp: new Date(),
  });

  // Send messages to a specific room
  socket.on("sendRoomMessage", ({ room, message }) => {
    io.to(room).emit("newMessage", message); // Send message to everyone in the room
  });
});
// const seed = require("./seed");
dotenv.config();

// Middleware to parse JSON request bodies
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || [
      "http://localhost:5173",
      "https://coursemaster.vercel.app",
      "https://coursemasteradmin.vercel.app",
      "https://coursemasterserver.onrender.com",
    ],
    credentials: true,
  })
);
app.use(express.json());
// app.use(bodyParser.json());

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
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
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
