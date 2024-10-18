const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();

// Register a new user
router.post("/register", async (req, res) => {
  const {
    username,
    email,
    password,
    age,
    department,
    faculty,
    level,
    hostel,
    matricNumber,
  } = req.body;
  console.log("Original Password:", password);

  // Check if all fields are provided
  if (
    !username ||
    !email ||
    !password ||
    !age ||
    !department ||
    !faculty ||
    !level ||
    !hostel ||
    !matricNumber
  ) {
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

    // Check if matricNumber is already registered
    const existingUserByMatric = await User.findOne({ matricNumber });
    if (existingUserByMatric) {
      return res
        .status(400)
        .json({ message: "Matric Number already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      username,
      email,
      password: hashedPassword, // Store the hashed password
      age,
      department,
      faculty,
      level,
      hostel,
      matricNumber,
    });
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const userDetails = {
      id: user._id,
      username: user.username,
      email: user.email,
      age: user.age,
      department: user.department,
      faculty: user.faculty,
      level: user.level,
      hostel: user.hostel,
      matricNumber: user.matricNumber,
      password: user.password,
    };

    res.status(201).json({
      message: "User registered successfully",
      user: userDetails,
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
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
    // Find the user by email and include password field
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    console.log(user.password);
    // Compare the passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send token and user details (excluding  password)
    const userDetails = {
      id: user._id,
      username: user.username,
      email: user.email,
      // password: user.password,
      age: user.age,
      department: user.department,
      faculty: user.faculty,
      level: user.level,
      hostel: user.hostel,
      matricNumber: user.matricNumber,
    };
    res.json({ token, user: userDetails, message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
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

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new Admin
    const newAdmin = new Admin({
      adminNumber,
      email,
      password: hashedPassword,
    });

    await newAdmin.save();

    // Generate JWT token
    const token = jwt.sign({ id: newAdmin._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const adminDetails = {
      id: newAdmin._id,
      adminNumber,
      email,
    };
    res.status(201).json({
      message: "Admin registered successfully",
      token,
      admin: adminDetails,
    });
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
    const user = await Admin.findOne({ adminNumber }).select("+password");

    if (!user) {
      console.log("Admin not found");
      return res.status(401).json({ message: "Admin number not found." });
    }

    console.log("Stored Hash:", user.password);
    console.log("Login - Admin Number:", adminNumber);
    console.log("Login - Entered Password:", password);
    console.log("Login - Stored Hashed Password:", this.password);

    // Pass the password to matchPassword
    const isMatch = await user.matchPassword(password, user.password);
    console.log("Password Match Result:", isMatch);
    console.log("Login - Password Comparison Result:", isMatch);

    if (!isMatch) {
      console.log("Password mismatch");
      return res.status(401).json({ message: "Password mismatch." });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const adminDetails = {
      id: user._id,
      adminNumber: user.adminNumber,
      email: user.email,
    };
    console.log({ token, user: adminDetails, message: "Login succesful." });
    res.json({ token, user: adminDetails, message: "Login succesful." });
  } catch (error) {
    console.error("Login error:", error); // Log the error for debugging
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
});

// Middleware to authenticate user JWT token
const protect = async (req, res, next) => {
  console.log("Authorization Header:", req.headers.authorization);
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access banned." });
  }
  // const user = await User.findById(req.user.id);
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
        .json({ message: "Unauthorized. Admin information is missing." });
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
