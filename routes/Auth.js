const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Admin = require("../models/Admin");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();

// JWT secret

// Register a new user
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  console.log("Original Password:", password);

  // Check if all fields are provided
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if the email is already registered
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Check if username is already registered
    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      username,
      email,
      password:hashedPassword, //hashedPassword, // Store the hashed password
    });
    console.log("Hashed Password:", hashedPassword);

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
});

// Admin Register
router.post("/admin/register", async (req, res) => {
  const { adminNumber, email, password } = req.body;
  console.log("Original Password:", password);

  // Check if all fields are provided
  if (!adminNumber || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if the email is already registered
    const existingAdminByEmail = await Admin.findOne({ email });
    if (existingAdminByEmail) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Check if admin number is already registered
    const existingAdminByAdminNumber = await Admin.findOne({ adminNumber });
    if (existingAdminByAdminNumber) {
      return res.status(400).json({ message: "Number already taken" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new Admin
    const newAdmin = new Admin({
      adminNumber,
      email,
      password:hashedPassword, //hashedPassword, // Store the hashed password
    });
    console.log("Hashed Password:", hashedPassword);

    await newAdmin.save();
    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error registering admin", error: error.message });
  }
});

// Login admin
router.post("/admin/login", async (req, res) => {
  const { adminNumber, password } = req.body;
  // Input validation
  if (!adminNumber || !password) {
    return res
      .status(400)
      .json({ message: "Admin number and password are required" });
  }

  try {
    const user = await Admin.findOne({ adminNumber });
    if (!user) {
      console.log("Admin not found");
      return res.status(401).json({ message: "Admin number not found." });
    }

    console.log("Stored Hash:", user.password);
    // Pass the password to matchPassword
    const isMatch = await user.matchPassword(password);
    console.log("Password Match Result:", isMatch);

    if (!isMatch) {
      console.log("Password mismatch");
      return res.status(401).json({ message: "Password mismatch." });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log(token);
    res.json({ token });
  } catch (error) {
    console.error("Login error:", error); // Log the error for debugging
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
});

// Login an existing user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Input validation
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  console.log("Input Password:", password);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(401).json({ message: "Email mismatch" });
    }

    console.log("Stored Hash:", user.password);
    // Pass the password to matchPassword
    const isMatch = await user.matchPassword(password);
    console.log("Password Match Result:", isMatch);

    if (!isMatch) {
      console.log("Password mismatch");
      return res.status(401).json({ message: "Password mismatch" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log(token);
    res.json({ token });
  } catch (error) {
    console.error("Login error:", error); // Log the error for debugging
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
});

// Middleware to authenticate JWT token
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access banned." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("Decoded user:", req.user);
    next();
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    return res.status(401).json({ message: "Not authorized." });
  }
};

// Middleware to check if the user is an admin
const isAdmin = async (req, res, next) => {
  try {
    console.log("Decoded user ID:", req.user.id); // Log the user ID from JWT
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ message: "Unauthorized. User information is missing." });
    }
    const admin = await Admin.findById(req.user.id);

    if (!admin) {
      console.log("Admin not found");
      return res
        .status(403)
        .json({ message: "Access forbidden. Admins only." });
    }

    console.log("Admin found:", admin); // Log the admin details
    next();
  } catch (error) {
    console.error("Error checking admin status:", error.message); // Log the error for debugging
    return res
      .status(500)
      .json({ message: "Error checking admin status", error: error.message });
  }
};

module.exports = { router, protect, isAdmin };
